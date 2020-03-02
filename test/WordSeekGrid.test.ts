import { expect } from "chai";
import randomString from "random-string";
import { GridDirection } from "../src/GridDirection";
import { WordList } from "../src/WordList";
import { WordSeekGrid } from "../src/WordSeekGrid";
import { WordSeekFinder } from "../src/WordSeekFinder";

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

    expect(wg.getGridOutput().length).to.equal(
      (wg.getWidth() + "\n".length) * wg.getHeight() - 1
    );

    const grid = wg.getGrid();
    console.log("GRID:", wg.getGridOutput());

    const solver = new WordSeekFinder(grid);
    const wordLoc = solver.findWord(testWord);
    expect(wordLoc).to.exist;
    expect(wordLoc!.getDirection()).to.exist;
    if (
      wordLoc!.getDirection() == GridDirection.EAST ||
      wordLoc!.getDirection() == GridDirection.WEST
    ) {
      expect(wg.getWidth()).to.equal(testWord.length);
      expect(wg.getHeight()).to.equal(1);
    } else if (
      wordLoc!.getDirection() == GridDirection.NORTH ||
      wordLoc!.getDirection() == GridDirection.SOUTH
    ) {
      expect(wg.getWidth()).to.equal(1);
      expect(wg.getHeight()).to.equal(testWord.length);
    } else {
      expect(wg.getWidth()).to.equal(testWord.length);
      expect(wg.getHeight()).to.equal(testWord.length);
    }
  });

  xit("no ? left", () => {
    //
  });

  xit("word outut list is sorted", () => {
    //
  });
});
