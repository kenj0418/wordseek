import { expect } from "chai";
import randomString from "random-string";
import { WordSeekGrid } from "../src/WordSeekGrid";
import { LetterGrid } from "../src/LetterGrid";
import { GridDirection } from "../src/GridDirection";
import { WordSeekFinder } from "../src/WordSeekFinder";

const randomWord = () => randomString({ numeric: false }).toUpperCase();

describe("WordSeekGrid", function() {
  describe("constructor", function() {
    it("empty grid", () => {
      const grid = new WordSeekGrid();
      expect(grid.getLetters()).to.deep.equal([]);
      expect(grid.getWidth()).to.equal(0);
      expect(grid.getHeight()).to.equal(0);
    });

    it("from array", () => {
      const testArray = ["ABC", "DEF", "GHI"];
      const grid = new WordSeekGrid(testArray);
      expect(grid.getLetters()).to.deep.equal(testArray);
      expect(grid.getWidth()).to.equal(3);
      expect(grid.getHeight()).to.equal(3);
    });

    it("from LetterGrid", () => {
      const testArray = ["AB", "CD"];
      const grid = new WordSeekGrid(new LetterGrid(testArray));
      expect(grid.getLetters()).to.deep.equal(testArray);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
    });
  });

  describe("fillVacant", function() {
    it("fillVacant calls fillVacant on LetterGrid", () => {
      let testLetterGridInput = new LetterGrid(["?"]);
      const testLetterGridResult = new LetterGrid(["A"]);
      testLetterGridInput.fillVacant = (): LetterGrid => {
        return testLetterGridResult;
      };

      const grid = new WordSeekGrid(testLetterGridInput);
      const gridOutput = grid.fillVacant();
      expect(gridOutput.getLetters()).to.deep.equal(
        testLetterGridResult.getLetters()
      );
    });
  });

  describe("placeWordAt", function() {
    it("placeWordAt success with empty grid", () => {
      const grid = new WordSeekGrid(["??", "??"]);
      const eastGrid = grid.placeWordAt("QW", 0, 0, GridDirection.EAST);
      expect(eastGrid).to.exist;
      expect(eastGrid!.getLetters()).to.deep.equal(["QW", "??"]);
      const westGrid = grid.placeWordAt("QW", 1, 0, GridDirection.WEST);
      expect(westGrid).to.exist;
      expect(westGrid!.getLetters()).to.deep.equal(["WQ", "??"]);
      const southGrid = grid.placeWordAt("QW", 0, 0, GridDirection.SOUTH);
      expect(southGrid).to.exist;
      expect(southGrid!.getLetters()).to.deep.equal(["Q?", "W?"]);
      const northGrid = grid.placeWordAt("QW", 0, 1, GridDirection.NORTH);
      expect(northGrid).to.exist;
      expect(northGrid!.getLetters()).to.deep.equal(["W?", "Q?"]);
      const southEastGrid = grid.placeWordAt(
        "QW",
        0,
        0,
        GridDirection.SOUTHEAST
      );
      expect(southEastGrid).to.exist;
      expect(southEastGrid!.getLetters()).to.deep.equal(["Q?", "?W"]);
      const southWestGrid = grid.placeWordAt(
        "QW",
        1,
        0,
        GridDirection.SOUTHWEST
      );
      expect(southWestGrid).to.exist;
      expect(southWestGrid!.getLetters()).to.deep.equal(["?Q", "W?"]);
      const northEastGrid = grid.placeWordAt(
        "QW",
        0,
        1,
        GridDirection.NORTHEAST
      );
      expect(northEastGrid).to.exist;
      expect(northEastGrid!.getLetters()).to.deep.equal(["?W", "Q?"]);
      const northWestGrid = grid.placeWordAt(
        "QW",
        1,
        1,
        GridDirection.NORTHWEST
      );
      expect(northWestGrid).to.exist;
      expect(northWestGrid!.getLetters()).to.deep.equal(["W?", "?Q"]);
    });

    it("placeWordAt success with overlap grid", () => {
      const grid = new WordSeekGrid(["?B", "CD"]);
      const eastGrid = grid.placeWordAt("XB", 0, 0, GridDirection.EAST);
      expect(eastGrid).to.exist;
      expect(eastGrid!.getLetters()).to.deep.equal(["XB", "CD"]);
      const northWestGrid = grid.placeWordAt(
        "DY",
        1,
        1,
        GridDirection.NORTHWEST
      );
      expect(northWestGrid).to.exist;
      expect(northWestGrid!.getLetters()).to.deep.equal(["YB", "CD"]);
    });

    it("placeWordAt success with overlap grid full grid", () => {
      const grid = new WordSeekGrid(["AB", "CD"]);
      const eastGrid = grid.placeWordAt("AB", 0, 0, GridDirection.EAST);
      expect(eastGrid).to.exist;
      expect(eastGrid!.getLetters()).to.deep.equal(["AB", "CD"]);
    });

    it("placeWordAt fails with boundary top", () => {
      const grid = new WordSeekGrid(["??", "??"]);
      const northGrid = grid.placeWordAt("ABC", 0, 1, GridDirection.NORTH);
      expect(northGrid).to.not.exist;
    });

    it("placeWordAt fails with boundary bottom", () => {
      const grid = new WordSeekGrid(["??", "??"]);
      const southEastGrid = grid.placeWordAt(
        "XB",
        0,
        1,
        GridDirection.SOUTHEAST
      );
      expect(southEastGrid).to.not.exist;
    });

    it("placeWordAt fails with boundary left", () => {
      const grid = new WordSeekGrid(["??", "??"]);
      const westGrid = grid.placeWordAt("XB", 0, 0, GridDirection.WEST);
      expect(westGrid).to.not.exist;
    });

    it("placeWordAt fails with boundary right", () => {
      const grid = new WordSeekGrid(["??", "??"]);
      const eastGrid = grid.placeWordAt("XB", 1, 0, GridDirection.EAST);
      expect(eastGrid).to.not.exist;
    });

    it("placeWordAt fails with collision", () => {
      const grid = new WordSeekGrid(["A?", "??"]);
      const eastGrid = grid.placeWordAt("BQ", 0, 0, GridDirection.EAST);
      expect(eastGrid).to.not.exist;
    });
  });

  describe("findRandomPlacement", function() {
    beforeEach(function() {
      this.retries(10); //since random and might not get what we want on first try
    });

    it("if already there, use existing placement, even if other valid placements", () => {
      const grid = new WordSeekGrid(["??C", "DEF", "G?I"]);
      const placement = grid.findRandomPlacement(
        "CEG",
        GridDirection.SOUTHWEST
      );
      expect(placement).to.exist;
      expect(placement!.getX()).to.equal(2);
      expect(placement!.getY()).to.equal(0);
      expect(placement!.getDirection()).to.equal(GridDirection.SOUTHWEST);
    });

    it("place within existing empty grid", () => {
      const grid = new WordSeekGrid(["???", "???", "???"]);
      const placement = grid.findRandomPlacement("QW", GridDirection.EAST);
      expect(placement).to.exist;
      expect(placement!.getX()).be.at.least(0);
      expect(placement!.getX()).be.at.most(1);
      expect(placement!.getY()).be.at.least(0);
      expect(placement!.getY()).be.at.most(2);
    });

    it("place within existing grid with overlaps", () => {
      const grid = new WordSeekGrid(["??C", "DEF", "G?I"]);
      const placement = grid.findRandomPlacement("QEX", GridDirection.SOUTH);
      expect(placement).to.exist;
      expect(placement!.getDirection()).to.equal(GridDirection.SOUTH);
      expect(placement!.getX()).to.equal(1);
      expect(placement!.getY()).to.equal(0);
    });

    it("different placements are used randomly", () => {
      const testWord = "TESTING";
      const empty = "????????????????????";
      const grid = new WordSeekGrid([
        empty,
        empty,
        empty,
        empty,
        empty,
        empty,
        empty,
        empty,
        empty,
        empty
      ]);
      const placement1 = grid.findRandomPlacement(
        testWord,
        GridDirection.SOUTH
      );
      expect(placement1).to.exist;
      const placement2 = grid.findRandomPlacement(
        testWord,
        GridDirection.SOUTH
      );
      expect(placement2).to.exist;
      const index1 = placement1!.getX() + placement1!.getY() * grid.getWidth();
      const index2 = placement2!.getX() + placement2!.getY() * grid.getWidth();
      expect(index1).to.not.equal(index2);
    });

    it("no placement when grid needs to expand because too small", () => {
      const grid = new WordSeekGrid(["???", "???", "???"]);
      const placement = grid.findRandomPlacement(
        "ABCDEFG",
        GridDirection.NORTHEAST
      );
      expect(placement).to.not.exist;
    });

    it("place when grid needs to expand because no placements to use inside", () => {
      const grid = new WordSeekGrid(["ABC", "??F", "GHI"]);
      const placement = grid.findRandomPlacement("XYZ", GridDirection.NORTH);
      expect(placement).to.not.exist;
    });
  });

  describe("addWord", function() {
    beforeEach(function() {
      this.retries(10);
    });

    it("adds a word successfully on existing grid", () => {
      const testWord = "ABC";
      const grid = new WordSeekGrid(["???", "???", "???"]);
      const gridWithWord = grid.addWord(testWord).fillVacant();
      expect(gridWithWord.getWidth()).to.equal(3);
      expect(gridWithWord.getHeight()).to.equal(3);
      const solver = new WordSeekFinder(gridWithWord);
      expect(solver.findWord(testWord)).to.exist;
    });

    it("adds a word after expanding grid", () => {
      const testWord = "ABCD";
      const grid = new WordSeekGrid(["???", "???", "???"]);
      const gridWithWord = grid.addWord(testWord).fillVacant();
      expect(gridWithWord.getWidth()).to.be.at.least(3);
      expect(gridWithWord.getHeight()).to.be.at.least(3);
      if (
        gridWithWord.getWidth() < testWord.length &&
        gridWithWord.getHeight() < testWord.length
      ) {
        throw new Error(
          `grid not correctly expanded, size ${gridWithWord.getWidth()} x ${gridWithWord.getHeight()}`
        );
      }
      const solver = new WordSeekFinder(gridWithWord);
      expect(solver.findWord(testWord)).to.exist;
    });

    it("adds a word after expanding grid multiple times", () => {
      const testWord = "ABCDEFGHI";
      const grid = new WordSeekGrid(["???", "???", "???"]);
      const gridWithWord = grid.addWord(testWord).fillVacant();
      expect(gridWithWord.getWidth()).to.be.at.least(3);
      expect(gridWithWord.getHeight()).to.be.at.least(3);
      if (
        gridWithWord.getWidth() < testWord.length &&
        gridWithWord.getHeight() < testWord.length
      ) {
        throw new Error(
          `grid not correctly expanded, size ${gridWithWord.getWidth()} x ${gridWithWord.getHeight()}`
        );
      }
      const solver = new WordSeekFinder(gridWithWord);
      expect(solver.findWord(testWord)).to.exist;
    });

    it("add multiple words", () => {
      const testWords = [
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord()
      ];
      let currGrid = new WordSeekGrid(); //.expandSize(20, 20);
      for (let i = 0; i < testWords.length; i++) {
        currGrid = currGrid.addWord(testWords[i]);
      }
      const solver = new WordSeekFinder(currGrid);
      for (let i = 0; i < testWords.length; i++) {
        expect(solver.findWord(testWords[i])).to.exist;
      }
    });

    it("words are not all aligned", function() {
      this.retries(100);
      this.timeout(20000);
      const testWords = [
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord(),
        randomWord()
      ];
      let currGrid = new WordSeekGrid(new LetterGrid().expandSize(10, 10));
      for (let i = 0; i < testWords.length; i++) {
        currGrid = currGrid.addWord(testWords[i]);
      }
      const solver = new WordSeekFinder(currGrid);
      let vert = 0;
      let horiz = 0;
      let diag = 0;
      for (let i = 0; i < testWords.length; i++) {
        const wordLoc = solver.findWord(testWords[i]);
        expect(wordLoc).to.exist;
        switch (wordLoc!.getDirection()) {
          case GridDirection.NORTH:
          case GridDirection.SOUTH:
            vert++;
            break;
          case GridDirection.EAST:
          case GridDirection.WEST:
            horiz++;
            break;
          default:
            diag++;
        }
      }
      expect(vert).to.not.equal(10);
      expect(horiz).to.not.equal(10);
      expect(diag).to.not.equal(10);
      expect(vert).to.be.at.least(1);
      expect(horiz).to.be.at.least(1);
      expect(diag).to.be.at.least(1);
    });

    it("addWord, expanding only vertically", () => {
      const testWord = "ABCD";
      const testWidth = 10;
      const grid = new WordSeekGrid(["???", "???", "???"], testWidth);
      const gridWithWord = grid.addWord(testWord).fillVacant();
      expect(gridWithWord.getWidth()).to.equal(testWidth);
      expect(gridWithWord.getHeight()).to.be.at.least(3);
      const solver = new WordSeekFinder(gridWithWord);
      expect(solver.findWord(testWord)).to.exist;
    });

    it("addWord multiple times, expanding only vertically", () => {
      const testWords = ["ABCD", "ABCDEFG", "ABCDEFGHIJ"];
      const testWidth = 10;
      const grid = new WordSeekGrid(["???", "???", "???"], testWidth);

      const gridWithWord1 = grid.addWord(testWords[0]).fillVacant();
      expect(gridWithWord1.getWidth()).to.equal(testWidth);
      expect(gridWithWord1.getHeight()).to.be.at.least(3);
      const solver1 = new WordSeekFinder(gridWithWord1);
      expect(solver1.findWord(testWords[0])).to.exist;

      const gridWithWord2 = gridWithWord1.addWord(testWords[1]).fillVacant();
      expect(gridWithWord2.getWidth()).to.equal(testWidth);
      expect(gridWithWord2.getHeight()).to.be.at.least(3);
      const solver2 = new WordSeekFinder(gridWithWord2);
      expect(solver2.findWord(testWords[1])).to.exist;

      const gridWithWord3 = grid.addWord(testWords[2]).fillVacant();
      expect(gridWithWord3.getWidth()).to.equal(testWidth);
      expect(gridWithWord2.getHeight()).to.be.at.least(3);
      const solver3 = new WordSeekFinder(gridWithWord3);
      expect(solver3.findWord(testWords[2])).to.exist;
    });

    it("addWord multiple times no expanding in either direction", function() {
      this.retries(1);
      this.timeout(20000);
      for (let repeats = 0; repeats < 20; repeats++) {
        const testWords = ["ABCDE", "VWXYZ"];
        const testWidth = 10;
        const testHeight = 10;
        const grid = new WordSeekGrid(
          ["???", "???", "???"],
          testWidth,
          testHeight
        );

        const gridWithWord1 = grid.addWord(testWords[0]);
        expect(gridWithWord1.getWidth()).to.equal(testWidth);
        expect(gridWithWord1.getHeight()).to.equal(testHeight);
        const solver1 = new WordSeekFinder(gridWithWord1);
        expect(solver1.findWord(testWords[0])).to.exist;

        const gridWithWord2 = gridWithWord1.addWord(testWords[1]).fillVacant();
        expect(gridWithWord2.getWidth()).to.equal(testWidth);
        expect(gridWithWord1.getHeight()).to.equal(testHeight);
        const solver2 = new WordSeekFinder(gridWithWord2);
        expect(solver2.findWord(testWords[1])).to.exist;
      }
    });

    it("addWord multiple times fails when no expanding and no room", function() {
      this.retries(1);
      this.timeout(20000);
      for (let repeats = 0; repeats < 20; repeats++) {
        const testWords = ["ABCDE", "VWXYZ"];
        const testWidth = 5;
        const testHeight = 5;
        const grid = new WordSeekGrid(
          ["?????", "??QQQ", "?Q?QQ", "?QQ?Q", "?QQQ?"],
          testWidth,
          testHeight
        );

        const gridWithWord1 = grid.addWord(testWords[0]);
        expect(gridWithWord1.getWidth()).to.equal(testWidth);
        expect(gridWithWord1.getHeight()).to.equal(testHeight);
        const solver1 = new WordSeekFinder(gridWithWord1);
        expect(solver1.findWord(testWords[0])).to.exist;

        let receivedException: Error | undefined;
        try {
          gridWithWord1.addWord(testWords[1]);
        } catch (ex) {
          receivedException = ex;
        }
        expect(receivedException).to.exist;
      }
    });
  });
});
