import * as fs from "fs";
import { WordList } from "./src/WordList";
import { WordSeekGrid } from "./src/WordSeekGrid";

const readFileAsArray = (filename: string): Array<string> => {
  return fs
    .readFileSync(filename)
    .toString()
    .split("\n");
};

function readWordListFromFile(filename: string): WordSeekGrid {
  return new WordSeekGrid(readFileAsArray(filename));
}

let grid = readWordListFromFile("test/data/stlouis.txt");
console.log(grid.getOutput());
