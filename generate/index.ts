import * as fs from "fs";

class WordList {
  words: Array<string>;

  constructor(words: Array<string>) {
    this.words = [];
    //
  }

  getAllWords(): Array<string> {
    return this.words;
  }

  getRandomWord(): string {
    return "NOT IMPLEMENTED";
  }

  getRemainingWordList(wordToRemove: string): WordList {
    return this;
  }
}

class WordSeekGrid {
  constructor() {}

  getGridOutput(): string {
    return "getGridOutput NOT IMPLEMENTED";
  }

  getWordsOutput(): string {
    return "getWordsOutput NOT IMPLEMENTED";
  }

  getOutput(): string {
    return this.getGridOutput() + "\n\n" + this.getWordsOutput();
  }
}

const readFileAsArray = (filename: string): Array<string> => {
  return fs
    .readFileSync(filename)
    .toString()
    .split("\n");
};

function readWordListFromFile(filename: string): WordSeekGrid {
  return new WordSeekGrid();
}

let grid = readWordListFromFile("test/data/stlouis.txt");
console.log(grid.getOutput());
