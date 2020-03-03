import { expect } from "chai";
import randomString from "random-string";
import { WordSeekFinder } from "../src/WordSeekFinder";
import { LetterGrid } from "../src/LetterGrid";
import { GridDirection } from "../src/GridDirection";

describe("WordSeekFinder", function() {
  let solver: WordSeekFinder;

  beforeEach(() => {
    solver = new WordSeekFinder(new LetterGrid(["ABC", "DEF", "GHI"]));
  });

  it("word not found", () => {
    const wordLoc = solver.findWord("XYZ");
    expect(wordLoc).to.not.exist;
  });

  it("word found east", () => {
    const wordLoc = solver.findWord("DEF");
    expect(wordLoc).to.exist;
    expect(wordLoc!.getX()).to.equal(0);
    expect(wordLoc!.getY()).to.equal(1);
    expect(wordLoc!.getDirection()).to.equal(GridDirection.EAST);
  });

  it("word found northwest", () => {
    const wordLoc = solver.findWord("IEA");
    expect(wordLoc).to.exist;
    expect(wordLoc!.getX()).to.equal(2);
    expect(wordLoc!.getY()).to.equal(2);
    expect(wordLoc!.getDirection()).to.equal(GridDirection.NORTHWEST);
  });

  it("word found not full width", () => {
    const wordLoc = solver.findWord("BE");
    expect(wordLoc).to.exist;
    expect(wordLoc!.getX()).to.equal(1);
    expect(wordLoc!.getY()).to.equal(0);
    expect(wordLoc!.getDirection()).to.equal(GridDirection.SOUTH);
  });

  it("find multiple words", () => {
    const wordLocations = solver.findWords(["ABC", "EH"]);
    expect(wordLocations).to.exist;

    const abc = wordLocations["ABC"];
    expect(abc).to.exist;
    expect(abc!.getX()).to.equal(0);
    expect(abc!.getY()).to.equal(0);
    expect(abc!.getDirection()).to.equal(GridDirection.EAST);

    const eh = wordLocations["EH"];
    expect(eh).to.exist;
    expect(eh!.getX()).to.equal(1);
    expect(eh!.getY()).to.equal(1);
    expect(eh!.getDirection()).to.equal(GridDirection.SOUTH);
  });

  it("find multiple words some not there", () => {
    const wordLocations = solver.findWords(["ABC", "EH", "QWE"]);
    expect(wordLocations).to.exist;

    const abc = wordLocations["ABC"];
    expect(abc).to.exist;
    expect(abc!.getX()).to.equal(0);
    expect(abc!.getY()).to.equal(0);
    expect(abc!.getDirection()).to.equal(GridDirection.EAST);

    const eh = wordLocations["EH"];
    expect(eh).to.exist;
    expect(eh!.getX()).to.equal(1);
    expect(eh!.getY()).to.equal(1);
    expect(eh!.getDirection()).to.equal(GridDirection.SOUTH);

    const qwe = wordLocations["QWE"];
    expect(qwe).to.not.exist;
  });

  it("find multiple words none there", () => {
    const wordLocations = solver.findWords(["ABCD", "MEH", "QWE"]);
    expect(wordLocations).to.exist;

    const abcd = wordLocations["ABCD"];
    expect(abcd).to.not.exist;

    const meh = wordLocations["MEH"];
    expect(meh).to.not.exist;

    const qwe = wordLocations["QWE"];
    expect(qwe).to.not.exist;
  });

  it("find multiple words value not queried for is undefined", () => {
    const wordLocations = solver.findWords(["ABC", "EH", "QWE"]);
    expect(wordLocations).to.exist;

    const foo = wordLocations["FOO"];
    expect(foo).to.not.exist;
  });
});
