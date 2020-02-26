import { expect } from "chai";
import randomString from "random-string";
import { LetterGrid } from "../src/LetterGrid";

describe.only("LetterGrid", function() {
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
    this.retries(10); //since by random chance it could expand up
    const grid = new LetterGrid(["AB"]).expandSize(2, 2);
    expect(grid.getWidth()).to.equal(2);
    expect(grid.getHeight()).to.equal(2);
    expect(grid.getLetters()).to.deep.equal(["AB", "??"]);
  });

  it("2x2 can expand up", function() {
    this.retries(10); //since by random chance it could expand up
    const grid = new LetterGrid(["AB"]).expandSize(2, 2);
    expect(grid.getWidth()).to.equal(2);
    expect(grid.getHeight()).to.equal(2);
    expect(grid.getLetters()).to.deep.equal(["??", "AB"]);
  });

  it("2x2 can expand right", function() {
    this.retries(10); //since by random chance it could expand up
    const grid = new LetterGrid(["A", "B"]).expandSize(2, 2);
    expect(grid.getWidth()).to.equal(2);
    expect(grid.getHeight()).to.equal(2);
    expect(grid.getLetters()).to.deep.equal(["A?", "B?"]);
  });

  it("2x2 can expand left", function() {
    this.retries(10); //since by random chance it could expand up
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

  xit("need more tests");
});
