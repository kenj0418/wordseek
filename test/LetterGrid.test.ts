import { expect } from "chai";
import randomString from "random-string";
import { LetterGrid } from "../src/LetterGrid";
import { GridDirection } from "../src/GridDirection";
import { WordSeekFinder } from "../src/WordSeekFinder";

const randomWord = () => randomString({ numeric: false }).toUpperCase();

describe("LetterGrid", function() {
  describe("constructor", function() {
    it("empty grid", () => {
      const grid = new LetterGrid();
      expect(grid.getWidth()).to.equal(0);
      expect(grid.getHeight()).to.equal(0);
      expect(grid.getLetters()).to.deep.equal([]);
    });

    it("1x1 grid", () => {
      const grid = new LetterGrid(["X"]);
      expect(grid.getWidth()).to.equal(1);
      expect(grid.getHeight()).to.equal(1);
      expect(grid.getLetters()).to.deep.equal(["X"]);
    });
    it("unequal length is realigned", () => {
      const grid = new LetterGrid(["AB", "C"]);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      const letters = grid.getLetters();
      expect(letters.length).to.equal(2);
      expect(letters[0]).to.equal("AB");
      expect(letters[1]).to.equal("C?");
    });
  });

  describe("expandSize", function() {
    it("empty 1x1 grid", () => {
      const grid = new LetterGrid().expandSize(1, 1);
      expect(grid.getWidth()).to.equal(1);
      expect(grid.getHeight()).to.equal(1);
      expect(grid.getLetters()).to.deep.equal(["?"]);
    });

    it("2x2 grid", () => {
      const grid = new LetterGrid(["AB", "CD"]);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      expect(grid.getLetters()).to.deep.equal(["AB", "CD"]);
    });

    it("empty 2x2 grid", () => {
      const grid = new LetterGrid().expandSize(2, 2);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      expect(grid.getLetters()).to.deep.equal(["??", "??"]);
    });

    it("2x2 can expand down", function() {
      this.retries(10); //since by random chance, it could expand up
      const grid = new LetterGrid(["AB"]).expandSize(2, 2);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      expect(grid.getLetters()).to.deep.equal(["AB", "??"]);
    });

    it("2x2 can expand up", function() {
      this.retries(10); //since by random chance, it could expand down
      const grid = new LetterGrid(["AB"]).expandSize(2, 2);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      expect(grid.getLetters()).to.deep.equal(["??", "AB"]);
    });

    it("2x2 can expand right", function() {
      this.retries(10); //since by random chance, it could expand left
      const grid = new LetterGrid(["A", "B"]).expandSize(2, 2);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      expect(grid.getLetters()).to.deep.equal(["A?", "B?"]);
    });

    it("2x2 can expand left", function() {
      this.retries(10); //since by random chance, it could expand right
      const grid = new LetterGrid(["A", "B"]).expandSize(2, 2);
      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      expect(grid.getLetters()).to.deep.equal(["?A", "?B"]);
    });
  });

  describe("get/set", () => {
    it("get value at location", () => {
      const grid = new LetterGrid(["AB", "CD"]);
      expect(grid.get(0, 0)).to.equal("A");
      expect(grid.get(1, 0)).to.equal("B");
      expect(grid.get(0, 1)).to.equal("C");
      expect(grid.get(1, 1)).to.equal("D");
    });

    it("get out-of-bounds value throws", () => {
      const grid = new LetterGrid(["AB", "CD"]);
      let exceptionReceived;
      try {
        grid.get(9, 9);
      } catch (ex) {
        exceptionReceived = ex;
      }
      expect(exceptionReceived).to.exist;
    });

    it("set value at location, new grid has value, old grid unchanged", () => {
      const grid = new LetterGrid(["AB", "CD"]);
      const newGrid = grid.set(1, 1, "E");

      expect(grid.getWidth()).to.equal(2);
      expect(grid.getHeight()).to.equal(2);
      expect(grid.get(0, 0)).to.equal("A");
      expect(grid.get(1, 0)).to.equal("B");
      expect(grid.get(0, 1)).to.equal("C");
      expect(grid.get(1, 1)).to.equal("D");

      expect(newGrid.getWidth()).to.equal(2);
      expect(newGrid.getHeight()).to.equal(2);
      expect(newGrid.get(0, 0)).to.equal("A");
      expect(newGrid.get(1, 0)).to.equal("B");
      expect(newGrid.get(0, 1)).to.equal("C");
      expect(newGrid.get(1, 1)).to.equal("E");
    });

    it("set value out of range throws", () => {
      const grid = new LetterGrid(["AB", "CD"]);
      let exceptionReceived;
      try {
        grid.set(9, 9, "E");
      } catch (ex) {
        exceptionReceived = ex;
      }
      expect(exceptionReceived).to.exist;
    });
  });

  describe("placeWordAt", function() {
    it("placeWordAt success with empty grid", () => {
      const grid = new LetterGrid(["??", "??"]);

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
      const grid = new LetterGrid(["?B", "CD"]);

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
      const grid = new LetterGrid(["AB", "CD"]);

      const eastGrid = grid.placeWordAt("AB", 0, 0, GridDirection.EAST);
      expect(eastGrid).to.exist;
      expect(eastGrid!.getLetters()).to.deep.equal(["AB", "CD"]);
    });

    it("placeWordAt fails with boundary top", () => {
      const grid = new LetterGrid(["??", "??"]);
      const northGrid = grid.placeWordAt("ABC", 0, 1, GridDirection.NORTH);
      expect(northGrid).to.not.exist;
    });

    it("placeWordAt fails with boundary bottom", () => {
      const grid = new LetterGrid(["??", "??"]);
      const southEastGrid = grid.placeWordAt(
        "XB",
        0,
        1,
        GridDirection.SOUTHEAST
      );
      expect(southEastGrid).to.not.exist;
    });

    it("placeWordAt fails with boundary left", () => {
      const grid = new LetterGrid(["??", "??"]);
      const westGrid = grid.placeWordAt("XB", 0, 0, GridDirection.WEST);
      expect(westGrid).to.not.exist;
    });

    it("placeWordAt fails with boundary right", () => {
      const grid = new LetterGrid(["??", "??"]);
      const eastGrid = grid.placeWordAt("XB", 1, 0, GridDirection.EAST);
      expect(eastGrid).to.not.exist;
    });

    it("placeWordAt fails with collision", () => {
      const grid = new LetterGrid(["A?", "??"]);
      const eastGrid = grid.placeWordAt("BQ", 0, 0, GridDirection.EAST);
      expect(eastGrid).to.not.exist;
    });
  });

  describe("fillVacant", function() {
    it("already full, does nothing", () => {
      const testLetters = ["ABCD", "EFGH", "IJKL", "MNOP"];
      const grid = new LetterGrid(testLetters);
      const filled = grid.fillVacant();
      expect(filled.getLetters()).to.deep.equal(testLetters);
    });

    it("fills empty grid", () => {
      const testLetters = ["???", "???"];
      const grid = new LetterGrid(testLetters);
      const filled = grid.fillVacant();
      const filledLetters = filled.getLetters();
      expect(filledLetters.length).to.equal(2);
      const expectedPattern = /[a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9]$/;
      expect(filledLetters[0]).to.match(expectedPattern);
      expect(filledLetters[1]).to.match(expectedPattern);
    });

    it("fills partial grid", () => {
      const testLetters = ["A?", "?D"];
      const grid = new LetterGrid(testLetters);
      const filled = grid.fillVacant();
      const filledLetters = filled.getLetters();
      expect(filledLetters.length).to.equal(2);
      expect(filledLetters[0]).to.match(/A[a-zA-Z0-9]$/);
      expect(filledLetters[1]).to.match(/[a-zA-Z0-9]D$/);
    });

    it("fills differently each time", () => {
      const testLetters = ["???", "???"];
      const grid = new LetterGrid(testLetters);
      const filled1 = grid.fillVacant();
      const filled2 = grid.fillVacant();
      expect(filled1.getLetters()).to.not.deep.equal(filled2.getLetters());
    });
  });

  describe("findRandomPlacement", function() {
    beforeEach(function() {
      this.retries(10); //since random and might not get what we want on first try
    });

    it("if already there, use existing placement, even if other valid placements", () => {
      const grid = new LetterGrid(["??C", "DEF", "G?I"]);
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
      const grid = new LetterGrid(["???", "???", "???"]);
      const placement = grid.findRandomPlacement("QW", GridDirection.EAST);
      expect(placement).to.exist;
      expect(placement!.getX()).be.at.least(0);
      expect(placement!.getX()).be.at.most(1);
      expect(placement!.getY()).be.at.least(0);
      expect(placement!.getY()).be.at.most(2);
    });

    it("place within existing grid with overlaps", () => {
      const grid = new LetterGrid(["??C", "DEF", "G?I"]);
      const placement = grid.findRandomPlacement("QEX", GridDirection.SOUTH);
      expect(placement).to.exist;
      expect(placement!.getDirection()).to.equal(GridDirection.SOUTH);
      expect(placement!.getX()).to.equal(1);
      expect(placement!.getY()).to.equal(0);
    });

    it("different placements are used randomly", () => {
      const testWord = "TESTING";
      const empty = "????????????????????";
      const grid = new LetterGrid([
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
      const grid = new LetterGrid(["???", "???", "???"]);
      const placement = grid.findRandomPlacement(
        "ABCDEFG",
        GridDirection.NORTHEAST
      );
      expect(placement).to.not.exist;
    });

    it("place when grid needs to expand because no placements to use inside", () => {
      const grid = new LetterGrid(["ABC", "??F", "GHI"]);
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
      const grid = new LetterGrid(["???", "???", "???"]);
      const gridWithWord = grid.addWord(testWord).fillVacant();
      expect(gridWithWord.getWidth()).to.equal(3);
      expect(gridWithWord.getHeight()).to.equal(3);

      const solver = new WordSeekFinder(gridWithWord);
      expect(solver.findWord(testWord)).to.exist;
    });

    it("adds a word after expanding grid", () => {
      const testWord = "ABCD";
      const grid = new LetterGrid(["???", "???", "???"]);
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
      const grid = new LetterGrid(["???", "???", "???"]);
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

      let currGrid = new LetterGrid(); //.expandSize(20, 20);
      for (let i = 0; i < testWords.length; i++) {
        currGrid = currGrid.addWord(testWords[i]);
      }

      const solver = new WordSeekFinder(currGrid);
      for (let i = 0; i < testWords.length; i++) {
        expect(solver.findWord(testWords[i])).to.exist;
      }
    });

    it("words are not all aligned", () => {
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

      let currGrid = new LetterGrid().expandSize(10, 10);
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
  });
});
