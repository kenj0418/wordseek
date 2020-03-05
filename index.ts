import * as fs from "fs";
import { WordList } from "./src/WordList";
import { WordSeekPuzzle } from "./src/WordSeekPuzzle";
import { WordSeekFinder } from "./src/WordSeekFinder";
import { LetterGrid } from "./src/LetterGrid";
import { WordSeekPdfFormatter } from "./src/WordSeekPdfFormatter";

const filename = "data/stlouisSmall.txt";
const outputFilename = "output/stlouisSmall.pdf";
// const filename = "data/stlouis.txt";
// const outputFilename = "output/stlouis.pdf";
// const filename = "data/ocelot.txt";
// const outputFilename = "output/ocelot.pdf";

const readFileAsArray = (filename: string): Array<string> => {
  return fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .filter(word => word.length);
};

const getOutput = (grid: WordSeekPuzzle): string => {
  return grid.getGridLetters().join("\n") + "\n\n" + grid.getWordsOutput();
};

const wl = new WordList(readFileAsArray(filename));

let wsGrid = new WordSeekPuzzle(wl, 30, 20);

const formatter = new WordSeekPdfFormatter();
formatter.format(wsGrid).then(pdfDoc => {
  fs.writeFileSync(outputFilename, pdfDoc);
});
