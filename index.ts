import * as fs from "fs";
import * as pdfkit from "pdfkit";
import { WordList } from "./src/WordList";
import { WordSeekPuzzle } from "./src/WordSeekPuzzle";
import { WordSeekFinder } from "./src/WordSeekFinder";
import { LetterGrid } from "./src/LetterGrid";

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
  return grid.getGridOutput() + "\n\n" + grid.getWordsOutput();
};

const wl = new WordList(readFileAsArray(filename));

let wsGrid = new WordSeekPuzzle(wl, 30, 20);
// console.log(getOutput(wsGrid));

// const solver = new WordSeekFinder(wsGrid.getGrid());

// const allPlacements = solver.findWords(wl.getAllWords());

// console.log(allPlacements);

///////////////////////////////////////////

const PDFDocument = require("pdfkit");
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(outputFilename));

// Draw the grid
const lines = wsGrid
  .getGridOutput()
  .split("\n")
  .map(line => line.split(""));

const horizStart = 50;
const vertStart = 50;
const horizSpacing = 15;
const vertSpacing = 20;

const gridText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(12);
for (let lineNum = 0; lineNum < lines.length; lineNum++) {
  const line = lines[lineNum];
  for (let charNum = 0; charNum < line.length; charNum++) {
    gridText.text(
      line[charNum],
      horizStart + charNum * horizSpacing,
      vertStart + lineNum * vertSpacing
    );
  }
}

const lineStartVert = vertStart + lines.length * vertSpacing;

// Draw a line between grid and words
doc
  .moveTo(25, lineStartVert)
  .lineTo(600, lineStartVert)
  .lineTo(600, lineStartVert + 2)
  .lineTo(25, lineStartVert + 2)
  .lineTo(25, lineStartVert)
  .fill("#000000");

// List words
const wordText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(10);
const words = wl.getAllWordsOriginal();
const wordsPerLine = 3;
const wordLines = Math.ceil(words.length / wordsPerLine);

const wordHorizStart = 50;
const wordVertStart = lineStartVert + 25;
const wordHorizSpacing = Math.floor(600 / wordsPerLine);
const wordVertSpacing = 30;

for (let wordLine = 0; wordLine < wordLines; wordLine++) {
  for (let wordNum = 0; wordNum < wordsPerLine; wordNum++) {
    const word = words[wordLine * wordsPerLine + wordNum];
    if (word) {
      wordText.text(
        word,
        wordHorizStart + wordNum * wordHorizSpacing,
        wordVertStart + wordLine * wordVertSpacing
      );
    }
  }
}

// Add an image, constrain it to a given size, and center it vertically and horizontally
// doc.image("path/to/image.png", {
//   fit: [250, 300],
//   align: "center",
//   valign: "center"
// });

// Add another page
// doc
//   .addPage()
//   .fontSize(25)
//   .text("Here is some vector graphics...", 100, 100);

// Draw a triangle
// doc
//   .save()
//   .moveTo(100, 150)
//   .lineTo(100, 250)
//   .lineTo(200, 250)
//   .fill("#FF3300");

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
// doc
//   .scale(0.6)
//   .translate(470, -380)
//   .path("M 250,75 L 323,301 131,161 369,161 177,301 z")
//   .fill("red", "even-odd")
//   .restore();

// Add some text with annotations
// doc
//   .addPage()
//   .fillColor("blue")
//   .text("Here is a link!", 100, 100)
//   .underline(100, 100, 160, 27, { color: "#0000FF" })
//   .link(100, 100, 160, 27, "http://google.com/");

// Finalize PDF file
doc.end();
