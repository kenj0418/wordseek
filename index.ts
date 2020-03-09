import * as fs from "fs";
import { WordList } from "./src/WordList";
import { WordSeekPuzzle } from "./src/WordSeekPuzzle";
import { WordSeekFinder } from "./src/WordSeekFinder";
import { LetterGrid } from "./src/LetterGrid";
import { WordSeekPdfFormatter } from "./src/WordSeekPdfFormatter";
import { WordSeekSolutionPdfFormatter } from "./src/WordSeekSolutionPdfFormatter";

const filename = "data/stlouisSmall.txt";
const outputFilename = "output/stlouisSmall.pdf";
const solutionFilename = "output/stlouisSmall_solve.pdf";
// const filename = "data/stlouis.txt";
// const outputFilename = "output/stlouis.pdf";
// const outputFilename = "output/stlouis_solve.pdf";
// const filename = "data/ocelot.txt";
// const outputFilename = "output/ocelot.pdf";
// const outputFilename = "output/ocelot_solve.pdf";

const readFileAsArray = (filename: string): Array<string> => {
  return fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .filter(word => word.length);
};

const wl = new WordList(readFileAsArray(filename));

let wsGrid = new WordSeekPuzzle(wl, 30, 20);

const formatter = new WordSeekPdfFormatter();
formatter.format(wsGrid).then(pdfDoc => {
  fs.writeFileSync(outputFilename, pdfDoc);
});

const solver = new WordSeekFinder(wsGrid.getGrid());
const solutions = solver.findWords(wl.getAllWords());

const solutionFormatter = new WordSeekSolutionPdfFormatter();
solutionFormatter.format(wsGrid, solutions).then(pdfDoc => {
  fs.writeFileSync(solutionFilename, pdfDoc);
});
