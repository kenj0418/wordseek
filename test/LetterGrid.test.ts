import { expect } from "chai";
import randomString from "random-string";
import { LetterGrid } from "../src/LetterGrid";

describe("LetterGrid", function() {
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

  it("unequal length is realigned", () => {
    const grid = new LetterGrid(["AB", "C"]);
    expect(grid.getWidth()).to.equal(2);
    expect(grid.getHeight()).to.equal(2);
    const letters = grid.getLetters();
    expect(letters.length).to.equal(2);
    expect(letters[0]).to.equal("AB");
    expect(letters[1]).to.equal("C?");
  });

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

  it("placeWordAt success with empty grid", () => {
    const grid = new LetterGrid(["??", "??"]);

    const eastGrid = grid.placeWordAt(0, 0, LetterGrid.EAST, "QW");
    expect(eastGrid).to.exist;
    expect(eastGrid!.getLetters()).to.deep.equal(["QW", "??"]);

    const westGrid = grid.placeWordAt(1, 0, LetterGrid.WEST, "QW");
    expect(westGrid).to.exist;
    expect(westGrid!.getLetters()).to.deep.equal(["WQ", "??"]);

    const southGrid = grid.placeWordAt(0, 0, LetterGrid.SOUTH, "QW");
    expect(southGrid).to.exist;
    expect(southGrid!.getLetters()).to.deep.equal(["Q?", "W?"]);

    const northGrid = grid.placeWordAt(0, 1, LetterGrid.NORTH, "QW");
    expect(northGrid).to.exist;
    expect(northGrid!.getLetters()).to.deep.equal(["W?", "Q?"]);

    const southEastGrid = grid.placeWordAt(0, 0, LetterGrid.SOUTHEAST, "QW");
    expect(southEastGrid).to.exist;
    expect(southEastGrid!.getLetters()).to.deep.equal(["Q?", "?W"]);

    const southWestGrid = grid.placeWordAt(1, 0, LetterGrid.SOUTHWEST, "QW");
    expect(southWestGrid).to.exist;
    expect(southWestGrid!.getLetters()).to.deep.equal(["?Q", "W?"]);

    const northEastGrid = grid.placeWordAt(0, 1, LetterGrid.NORTHEAST, "QW");
    expect(northEastGrid).to.exist;
    expect(northEastGrid!.getLetters()).to.deep.equal(["?W", "Q?"]);

    const northWestGrid = grid.placeWordAt(1, 1, LetterGrid.NORTHWEST, "QW");
    expect(northWestGrid).to.exist;
    expect(northWestGrid!.getLetters()).to.deep.equal(["W?", "?Q"]);
  });

  it("placeWordAt success with overlap grid", () => {
    const grid = new LetterGrid(["?B", "CD"]);

    const eastGrid = grid.placeWordAt(0, 0, LetterGrid.EAST, "XB");
    expect(eastGrid).to.exist;
    expect(eastGrid!.getLetters()).to.deep.equal(["XB", "CD"]);

    const northWestGrid = grid.placeWordAt(1, 1, LetterGrid.NORTHWEST, "DY");
    expect(northWestGrid).to.exist;
    expect(northWestGrid!.getLetters()).to.deep.equal(["YB", "CD"]);
  });

  it("placeWordAt success with overlap grid full grid", () => {
    const grid = new LetterGrid(["AB", "CD"]);

    const eastGrid = grid.placeWordAt(0, 0, LetterGrid.EAST, "AB");
    expect(eastGrid).to.exist;
    expect(eastGrid!.getLetters()).to.deep.equal(["AB", "CD"]);
  });

  it("placeWordAt fails with boundary top", () => {
    const grid = new LetterGrid(["??", "??"]);
    const northGrid = grid.placeWordAt(0, 1, LetterGrid.NORTH, "ABC");
    expect(northGrid).to.not.exist;
  });

  it("placeWordAt fails with boundary bottom", () => {
    const grid = new LetterGrid(["??", "??"]);
    const southEastGrid = grid.placeWordAt(0, 1, LetterGrid.SOUTHEAST, "XB");
    expect(southEastGrid).to.not.exist;
  });

  it("placeWordAt fails with boundary left", () => {
    const grid = new LetterGrid(["??", "??"]);
    const westGrid = grid.placeWordAt(0, 0, LetterGrid.WEST, "XB");
    expect(westGrid).to.not.exist;
  });

  it("placeWordAt fails with boundary right", () => {
    const grid = new LetterGrid(["??", "??"]);
    const eastGrid = grid.placeWordAt(1, 0, LetterGrid.EAST, "XB");
    expect(eastGrid).to.not.exist;
  });

  it("placeWordAt fails with collision", () => {
    const grid = new LetterGrid(["A?", "??"]);
    const eastGrid = grid.placeWordAt(0, 0, LetterGrid.EAST, "BQ");
    expect(eastGrid).to.not.exist;
  });
});
