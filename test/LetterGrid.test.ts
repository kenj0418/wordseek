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
});
