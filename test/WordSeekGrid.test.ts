import { expect } from "chai";
import randomString from "random-string";
import { WordList } from "../src/WordList";
import { WordSeekGrid } from "../src/WordSeekGrid";

describe("WordSeekGrid", function() {
  // const getRandomString = () => randomString({ letters: true, numbers: true });

  const verifyGridSize = (
    grid: string,
    expectedWidth: number,
    expectedHeight: number
  ): void => {
    if (expectedWidth == 0 || expectedHeight == 0) {
      expect(grid).to.equal("");
    } else {
      expect(grid.length).to.equal(
        (expectedWidth + "\n".length) * expectedHeight
      );
      const lines = grid.split("\n");
      expect(lines.length).to.equal(expectedHeight);
      lines.forEach(line => {
        expect(line.length).to.equal(expectedWidth);
      });
    }
  };

  it("no words, no output", () => {
    const wg = new WordSeekGrid(new WordList([]));
    expect(wg.getWidth()).to.equal(0);
    expect(wg.getHeight()).to.equal(0);
    expect(wg.getGridOutput()).to.equal("");
    expect(wg.getWordsOutput()).to.equal("");
  });

  it("no words, forced grid size, has output", () => {
    const wordList = new WordList([]);
    const gridWidth = 5;
    const gridHeight = 10;

    const wg = new WordSeekGrid(wordList, gridWidth, gridHeight);
    expect(wg.getWidth()).to.equal(gridWidth);
    expect(wg.getHeight()).to.equal(gridHeight);
    expect(wg.getWordsOutput()).to.equal("");

    const grid = wg.getGridOutput();
    expect(grid.length).to.equal((gridWidth + "\n".length) * gridHeight - 1);
    expect(grid.split("\n").length).to.equal(gridHeight);
  });

  xit("one word, is output", () => {
    const testWord = randomString();
    const wordList = new WordList([testWord]);
    const wg = new WordSeekGrid(wordList);
    expect(wg.getWordsOutput()).to.equal(testWord);

    const grid = wg.getGridOutput();

    if (wg.getWidth() == 1) {
      //word placed vertically
      expect(wg.getHeight()).to.equal(testWord.length);
    } else if (wg.getHeight() == 1) {
      expect(wg.getWidth()).to.equal(testWord.length);
      //word placed horizontally
    } else {
      //word placed diag
      expect(wg.getWidth()).to.equal(testWord.length);
      expect(wg.getHeight()).to.equal(testWord.length);
    }

    expect(3).to.equal(4); //todo need to add a test to find the actual word
  });

  //todo need to make solver/finder in order to make most of these tests

  xit("one word, forced grid size, is output", () => {
    //
  });

  xit("one word, too small forced grid size, throws", () => {
    //
  });

  xit("two words intersect", () => {
    //
  });

  xit("two words, forced grid size, is output", () => {
    //
  });

  xit("two words, too small forced grid size, throws", () => {
    //
  });

  xit("several words, is output", () => {
    //
  });

  xit("word outut list is sorted", () => {
    //
  });

  xit("LeftToRight is used", () => {
    //
  });

  xit("RightToLeft is used", () => {
    //
  });

  xit("TopToBottom is used", () => {
    //
  });

  xit("BottomToTop is used", () => {
    //
  });

  xit("diagonal is used", () => {
    // x4
  });

  xit("word embedded in another word", () => {
    //
  });

  xit("grid does not always look the same for same words", () => {
    //
  });
});

// it("empty array, empty list", () => {
//   const wl = new WordList([]);
//   expect(wl.getAllWords()).to.deep.equal([]);
// });

// it("getting random word from empty list returns null", () => {
//   const wl = new WordList([]);
//   expect(wl.getRandomWord()).to.not.exist;
// });

// it("single word list is in list", () => {
//   const testWord = getRandomString();
//   const wl = new WordList([testWord]);
//   expect(wl.getAllWords()).to.deep.equal([testWord]);
// });

// it("single word list removed from list", () => {
//   const testWord = getRandomString();
//   const wl = new WordList([testWord]);
//   expect(wl.getRandomWord()).to.equal(testWord);
//   const remainingWl = wl.getRemainingWordList(testWord);
//   expect(remainingWl.getAllWords()).to.deep.equal([]);
// });

// it("multiple words in list", () => {
//   const testWord1 = getRandomString();
//   const testWord2 = getRandomString();
//   const testWord3 = getRandomString();
//   const inputArray = [testWord1, testWord2, testWord3];
//   const wl = new WordList(inputArray);
//   const randomWord = wl.getRandomWord();
//   expect(randomWord).to.exist;
//   expect(inputArray.indexOf(randomWord!)).to.be.above(-1);
//   const outputArray = wl.getAllWords();
//   expect(outputArray.length).to.equal(3);
//   expect(outputArray.indexOf(testWord1)).to.be.above(-1);
//   expect(outputArray.indexOf(testWord2)).to.be.above(-1);
//   expect(outputArray.indexOf(testWord3)).to.be.above(-1);
// });

// it("duplicate words in list removed", () => {
//   const testWord1 = getRandomString();
//   const testWord2 = getRandomString();
//   const inputArray = [testWord1, testWord2, testWord1];
//   const wl = new WordList(inputArray);
//   const randomWord = wl.getRandomWord();
//   expect(randomWord).to.exist;
//   expect(inputArray.indexOf(randomWord!)).to.be.above(-1);
//   const outputArray = wl.getAllWords();
//   expect(outputArray.length).to.equal(2);
//   expect(outputArray.indexOf(testWord1)).to.be.above(-1);
//   expect(outputArray.indexOf(testWord2)).to.be.above(-1);
// });

// it("non alpha-numeric removed from words", () => {
//   const testWord1A = getRandomString();
//   const testWord1B = getRandomString();
//   const cleanWord1 = testWord1A + testWord1B;
//   const testWord2 = getRandomString();
//   const testWord3A = getRandomString();
//   const testWord3B = getRandomString();
//   const testWord3C = getRandomString();
//   const cleanWord3 = testWord3A + testWord3B + testWord3C;
//   const inputArray = [
//     testWord1A + " " + testWord1B,
//     testWord2,
//     testWord3A +
//       "~!@#$%^&*()_+`-=" +
//       testWord3B +
//       "[]\\{}|;':\",./<>?" +
//       testWord3C
//   ];
//   const wl = new WordList(inputArray);
//   const randomWord = wl.getRandomWord();
//   expect(randomWord).to.exist;
//   expect(
//     [cleanWord1, testWord2, cleanWord3].indexOf(randomWord!)
//   ).to.be.above(-1);
//   const outputArray = wl.getAllWords();
//   expect(outputArray.length).to.equal(3);
//   expect(outputArray.indexOf(cleanWord1)).to.be.above(-1);
//   expect(outputArray.indexOf(testWord2)).to.be.above(-1);
//   expect(outputArray.indexOf(cleanWord3)).to.be.above(-1);
// });

// it("random gives different values", function() {
//   this.retries(5); //since by random chance it could be the same

//   const inputArray = [
//     getRandomString(),
//     getRandomString(),
//     getRandomString(),
//     getRandomString(),
//     getRandomString()
//   ];
//   const randomWord1 = new WordList(inputArray).getRandomWord();
//   const randomWord2 = new WordList(inputArray).getRandomWord();
//   expect(randomWord1).to.exist;
//   expect(randomWord2).to.exist;
//   expect(inputArray.indexOf(randomWord1!)).to.be.above(-1);
//   expect(inputArray.indexOf(randomWord2!)).to.be.above(-1);
//   expect(randomWord1).to.not.equal(randomWord2);
// });

// it("randomly extracting all words from list", () => {
//   const inputArray = [
//     getRandomString(),
//     getRandomString(),
//     getRandomString()
//   ];

//   let wl = new WordList(inputArray);
//   expect(wl.getAllWords().length).to.equal(3);

//   const randomWord1 = wl.getRandomWord();
//   expect(randomWord1).to.exist;
//   wl = wl.getRemainingWordList(randomWord1!);
//   expect(wl.getAllWords().length).to.equal(2);

//   const randomWord2 = wl.getRandomWord();
//   expect(randomWord2).to.exist;
//   expect(randomWord2).to.not.equal(randomWord1);
//   wl = wl.getRemainingWordList(randomWord2!);
//   expect(wl.getAllWords().length).to.equal(1);

//   const randomWord3 = wl.getRandomWord();
//   expect(randomWord3).to.exist;
//   expect(randomWord3).to.not.equal(randomWord2);
//   expect(randomWord3).to.not.equal(randomWord1);
//   wl = wl.getRemainingWordList(randomWord3!);
//   expect(wl.getAllWords().length).to.equal(0);

//   const randomWord4 = wl.getRandomWord();
//   expect(randomWord4).to.not.exist;
// });
