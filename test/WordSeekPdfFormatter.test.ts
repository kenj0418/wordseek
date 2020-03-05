import { expect } from "chai";
import randomString from "random-string";
import { WordList } from "../src/WordList";
import { WordSeekPuzzle } from "../src/WordSeekPuzzle";
import { WordSeekPdfFormatter } from "../src/WordSeekPdfFormatter";
import * as pdfkit from "pdfkit";
import * as sinon from "sinon";
const PDFDocument = require("pdfkit");

describe("WordSeekPdfFormatter", function() {
  class MockPuzzle extends WordSeekPuzzle {
    readonly mockWords: Array<string>;
    readonly mockLetters: Array<string>;

    constructor(words: Array<string>, letters: Array<string>) {
      super(new WordList([]));
      this.mockWords = words;
      this.mockLetters = letters;
    }

    getGridLetters(): Array<string> {
      return this.mockLetters;
    }

    getWords(): Array<string> {
      return this.mockWords;
    }
  }

  describe("with real pdfkit", function() {
    it("pdf is generated", async () => {
      let testWords: Array<string> = [];
      let testGrid: Array<string> = [];
      const puzzle = new MockPuzzle(testWords, testGrid);
      const formatter = new WordSeekPdfFormatter();
      const pdfBuffer = await formatter.format(puzzle);

      expect(pdfBuffer).to.exist;
      const pdfDoc = new PDFDocument(pdfBuffer);
      expect(pdfDoc.page).to.exist;
      expect(pdfDoc.page.size).to.equal("letter");
      expect(pdfDoc.page.layout).to.equal("portrait");
    });
  });

  describe("with mock pdfkit", function() {
    let listeners: any;
    let mockPdfDoc: any;
    let testFormatter: WordSeekPdfFormatter;

    class MockPdfDocument {
      listeners: any;

      constructor(listeners: any) {
        this.listeners = listeners;
      }

      on(eventType: string, func: any): void {
        listeners[eventType] = sinon.spy(func);
      }

      callListener(listenerName: string, ...args: any[]): MockPdfDocument {
        if (!listeners[listenerName]) {
          listeners[listenerName] = sinon.stub();
        }
        listeners[listenerName](...args);
        return this;
      }

      end(): void {
        this.callListener("end");
      }

      font(fontName: string): MockPdfDocument {
        return this.callListener("font", fontName);
      }

      fontSize(size: number): MockPdfDocument {
        return this.callListener("fontSize", size);
      }

      text(st: string, x: number, y: number): MockPdfDocument {
        return this.callListener("text", st, x, y);
      }

      moveTo(x: number, y: number): MockPdfDocument {
        return this.callListener("moveTo", x, y);
      }

      lineTo(x: number, y: number): MockPdfDocument {
        return this.callListener("lineTo", x, y);
      }

      fill(color: number): MockPdfDocument {
        return this.callListener("fill", color);
      }
    }

    class WordSeekPdfFormatterWithMockPdfKit extends WordSeekPdfFormatter {
      readonly mockPdfDoc: any;

      constructor(mockPdfDoc: any) {
        super();
        this.mockPdfDoc = mockPdfDoc;
      }

      protected createPdfDoc(): any {
        return this.mockPdfDoc;
      }
    }

    beforeEach(() => {
      listeners = {};
      mockPdfDoc = new MockPdfDocument(listeners);
      testFormatter = new WordSeekPdfFormatterWithMockPdfKit(mockPdfDoc);
    });

    it("pdf is properly terminated", async () => {
      let testWords: Array<string> = [];
      let testGrid: Array<string> = [];
      const puzzle = new MockPuzzle(testWords, testGrid);

      const pdfBuffer = await testFormatter.format(puzzle);

      expect(listeners["data"]).to.exist;
      expect(listeners["error"]).to.exist;
      expect(listeners["end"]).to.exist;

      expect(listeners["end"].callCount).to.equal(1);
    });

    it("letter grid is added to pdf", async () => {
      let testWords: Array<string> = [];
      let testGrid: Array<string> = ["AB", "CD"];
      const puzzle = new MockPuzzle(testWords, testGrid);

      const pdfBuffer = await testFormatter.format(puzzle);

      // not worried about the particular font or siize for the test
      // also not worried if diff fonts used between grid and word list
      expect(listeners["font"]).to.exist;
      expect(listeners["font"].firstCall).to.exist;
      expect(listeners["font"].firstCall.args[0]).to.exist;

      expect(listeners["fontSize"]).to.exist;
      expect(listeners["fontSize"].firstCall).to.exist;
      expect(listeners["fontSize"].firstCall.args[0]).to.be.at.least(6);
      expect(listeners["fontSize"].firstCall.args[0]).to.be.at.most(24);

      expect(listeners["text"]).to.exist;
      expect(listeners["text"].callCount).to.be.at.least(4);

      const xStart = WordSeekPdfFormatter.GRID_START_X_POS;
      const yStart = WordSeekPdfFormatter.GRID_START_Y_POS;
      const xSpace = WordSeekPdfFormatter.GRID_X_SPACING;
      const ySpace = WordSeekPdfFormatter.GRID_Y_SPACING;
      expect(listeners["text"].getCall(0).args).to.deep.equal([
        "A",
        xStart,
        yStart
      ]);
      expect(listeners["text"].getCall(1).args).to.deep.equal([
        "B",
        xStart + xSpace,
        yStart
      ]);
      expect(listeners["text"].getCall(2).args).to.deep.equal([
        "C",
        xStart,
        yStart + ySpace
      ]);
      expect(listeners["text"].getCall(3).args).to.deep.equal([
        "D",
        xStart + xSpace,
        yStart + ySpace
      ]);
    });

    const fill = (len: number): string => {
      let st = "";
      while (st.length < len) {
        st += "X";
      }
      return st;
    };

    const fillArr = (len: number, st?: string): Array<string> => {
      let arr = [];
      while (arr.length < len) {
        arr.push(st || randomString());
      }
      return arr;
    };

    it("grid maximum width and maximum height is fine", async () => {
      const textThatIsJustSmallEnough = fill(
        WordSeekPdfFormatter.GRID_MAX_WIDTH
      );
      const testGrid = fillArr(
        WordSeekPdfFormatter.GRID_MAX_HEIGHT,
        textThatIsJustSmallEnough
      );

      let testWords: Array<string> = [];
      const puzzle = new MockPuzzle(testWords, testGrid);
      const pdfBuffer = await testFormatter.format(puzzle);
      expect(listeners["end"].callCount).to.equal(1);
    });

    it("grid too wide throws", async () => {
      const textThatIsTooLong = fill(WordSeekPdfFormatter.GRID_MAX_WIDTH + 1);

      let testWords: Array<string> = [];
      let testGrid: Array<string> = [textThatIsTooLong, textThatIsTooLong];
      const puzzle = new MockPuzzle(testWords, testGrid);

      let receivedException: Error | undefined;
      try {
        await testFormatter.format(puzzle);
      } catch (ex) {
        receivedException = ex;
      }
      expect(receivedException).to.exist;
    });

    it("grid too tall throws", async () => {
      const testGridTooLarge = fillArr(
        WordSeekPdfFormatter.GRID_MAX_HEIGHT + 1
      );

      let testWords: Array<string> = [];
      const puzzle = new MockPuzzle(testWords, testGridTooLarge);

      let receivedException: Error | undefined;
      try {
        await testFormatter.format(puzzle);
      } catch (ex) {
        receivedException = ex;
      }
      expect(receivedException).to.exist;
    });

    it("three column word list is added", async () => {
      let testWords: Array<string> = fillArr(11);
      let testGrid: Array<string> = ["ABC", "DEF", "GHI"];
      const puzzle = new MockPuzzle(testWords, testGrid);

      const pdfBuffer = await testFormatter.format(puzzle);

      // not worried about the particular font or siize for the test
      // also not worried if diff fonts used between grid and word list
      expect(listeners["font"]).to.exist;
      expect(listeners["font"].firstCall).to.exist;
      expect(listeners["font"].firstCall.args[0]).to.exist;

      expect(listeners["fontSize"]).to.exist;
      expect(listeners["fontSize"].firstCall).to.exist;
      expect(listeners["fontSize"].firstCall.args[0]).to.be.at.least(6);
      expect(listeners["fontSize"].firstCall.args[0]).to.be.at.most(24);

      expect(listeners["text"]).to.exist;
      expect(listeners["text"].callCount).to.be.at.least(9); // for the grid
      const textCallsForWords = listeners["text"].getCalls().slice(9);

      // public static readonly WORD_X_START = 999;
      // public static readonly WORD_X_SPACING = 999;
      // public static readonly WORD_Y_SPACING = 999;

      const xStart = WordSeekPdfFormatter.WORD_X_START;
      const yStart =
        WordSeekPdfFormatter.GRID_START_Y_POS +
        (testGrid.length - 1) * WordSeekPdfFormatter.GRID_Y_SPACING +
        WordSeekPdfFormatter.GRID_WORD_Y_SEPARATION;

      const xSpace = WordSeekPdfFormatter.WORD_X_SPACING;
      const ySpace = WordSeekPdfFormatter.WORD_Y_SPACING;

      expect(textCallsForWords.length).to.equal(testWords.length);
      for (let callNum = 0; callNum < testWords.length; callNum++) {
        const expectedX = xStart + (callNum % 3) * xSpace;
        const expectedY = yStart + Math.floor(callNum / 3) * ySpace;

        expect(textCallsForWords[callNum].args).to.deep.equal([
          testWords[callNum],
          expectedX,
          expectedY
        ]);
      }
    });
  });
});
