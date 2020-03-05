import { expect } from "chai";
import randomString from "random-string";
import { WordList } from "../src/WordList";
import { WordSeekPuzzle } from "../src/WordSeekPuzzle";
import { WordSeekPdfFormatter } from "../src/WordSeekPdfFormatter";
import * as pdfkit from "pdfkit";
import * as sinon from "sinon";
const PDFDocument = require("pdfkit");

describe.only("WordSeekPdfFormatter", function() {
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

    //todo need width and height? probably
    // getWidth(): number {
    //   return this.grid.getWidth();
    // }

    // getHeight(): number {
    //   return this.grid.getHeight();
    // }
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
    let listeners: any = {};
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

      expect(listeners["font"]).to.exist;
      expect(listeners["font"].firstCall).to.exist;
      expect(listeners["font"].firstCall.args[0]).to.exist; // not worried about the particular font for the test

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

    const fillArr = (st: string, len: number): Array<string> => {
      let arr = [];
      while (arr.length < len) {
        arr.push(st);
      }
      return arr;
    };

    it("grid maximum width and maximum height is fine", async () => {
      const textThatIsJustSmallEnough = fill(
        WordSeekPdfFormatter.GRID_MAX_WIDTH
      );
      const testGrid = fillArr(
        textThatIsJustSmallEnough,
        WordSeekPdfFormatter.GRID_MAX_HEIGHT
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
        "X",
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

    xit("three column word list is added", async () => {
      //todo check all words added
      //todo check start position (relative to where grid ended)
      //todo check columns
      //todo check spacing
    });
  });

  // import * as fs from "fs";
  // import { WordList } from "./src/WordList";
  // import { WordSeekPuzzle } from "./src/WordSeekPuzzle";
  // import { WordSeekFinder } from "./src/WordSeekFinder";
  // import { LetterGrid } from "./src/LetterGrid";

  // const getOutput = (grid: WordSeekPuzzle): string => {
  //   return grid.getGridLetters().join("\n") + "\n\n" + grid.getWordsOutput();
  // };

  // const wl = new WordList(readFileAsArray(filename));
  // let wsGrid = new WordSeekPuzzle(wl, 30, 20);
  // const solver = new WordSeekFinder(wsGrid.getGrid());
  // const allPlacements = solver.findWords(wl.getAllWords());

  ///////////////////////////////////////////

  // const doc = new PDFDocument();
  // doc.pipe(fs.createWriteStream(outputFilename));

  // // Draw the grid
  // const lines = wsGrid
  //   .getGridOutput()
  //   .split("\n")
  //   .map(line => line.split(""));

  // const horizStart = 50;
  // const vertStart = 50;
  // const horizSpacing = 15;
  // const vertSpacing = 20;

  // const gridText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(12);
  // for (let lineNum = 0; lineNum < lines.length; lineNum++) {
  //   const line = lines[lineNum];
  //   for (let charNum = 0; charNum < line.length; charNum++) {
  //     gridText.text(
  //       line[charNum],
  //       horizStart + charNum * horizSpacing,
  //       vertStart + lineNum * vertSpacing
  //     );
  //   }
  // }

  // const lineStartVert = vertStart + lines.length * vertSpacing;

  // // Draw a line between grid and words
  // doc
  //   .moveTo(25, lineStartVert)
  //   .lineTo(600, lineStartVert)
  //   .lineTo(600, lineStartVert + 2)
  //   .lineTo(25, lineStartVert + 2)
  //   .lineTo(25, lineStartVert)
  //   .fill("#000000");

  // // List words
  // const wordText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(10);
  // const words = wl.getAllWordsOriginal();
  // const wordsPerLine = 3;
  // const wordLines = Math.ceil(words.length / wordsPerLine);

  // const wordHorizStart = 50;
  // const wordVertStart = lineStartVert + 25;
  // const wordHorizSpacing = Math.floor(600 / wordsPerLine);
  // const wordVertSpacing = 30;

  // for (let wordLine = 0; wordLine < wordLines; wordLine++) {
  //   for (let wordNum = 0; wordNum < wordsPerLine; wordNum++) {
  //     const word = words[wordLine * wordsPerLine + wordNum];
  //     if (word) {
  //       wordText.text(
  //         word,
  //         wordHorizStart + wordNum * wordHorizSpacing,
  //         wordVertStart + wordLine * wordVertSpacing
  //       );
  //     }
  //   }
  // }

  // doc.end();
});
