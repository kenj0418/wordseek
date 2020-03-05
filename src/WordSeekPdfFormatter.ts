import * as pdfkit from "pdfkit";
const PDFDocument = require("pdfkit");
import { WordSeekPuzzle } from "../src/WordSeekPuzzle";
import { LetterGrid } from "./LetterGrid";

export class WordSeekPdfFormatter {
  public static readonly GRID_START_X_POS = 50;
  public static readonly GRID_START_Y_POS = 50;
  public static readonly GRID_X_SPACING = 15;
  public static readonly GRID_Y_SPACING = 20;
  public static readonly GRID_MAX_WIDTH = 30;
  public static readonly GRID_MAX_HEIGHT = 40;

  protected createPdfDoc(): any {
    return new PDFDocument();
  }

  private displayLetterGrid(doc: any, gridLines: Array<string>): void {
    const gridText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(12);

    if (gridLines.length > WordSeekPdfFormatter.GRID_MAX_HEIGHT) {
      throw new Error(
        `Grid is too tall (height=${gridLines.length}) for this formatter.  Max height: ${WordSeekPdfFormatter.GRID_MAX_HEIGHT}`
      );
    }

    for (let lineNum = 0; lineNum < gridLines.length; lineNum++) {
      const line = gridLines[lineNum];
      if (line.length > WordSeekPdfFormatter.GRID_MAX_WIDTH) {
        throw new Error(
          `Grid is too wide (width=${line.length}) for this formatter.  Max width: ${WordSeekPdfFormatter.GRID_MAX_WIDTH}`
        );
      }

      for (let charNum = 0; charNum < line.length; charNum++) {
        gridText.text(
          line[charNum],
          WordSeekPdfFormatter.GRID_START_X_POS +
            charNum * WordSeekPdfFormatter.GRID_X_SPACING,
          WordSeekPdfFormatter.GRID_START_Y_POS +
            lineNum * WordSeekPdfFormatter.GRID_Y_SPACING
        );
      }
    }
  }

  format(puzzle: WordSeekPuzzle): Promise<Buffer> {
    return new Promise<any>((resolve, reject) => {
      const doc = this.createPdfDoc();

      let buffers: Array<any> = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        let pdf = Buffer.concat(buffers);
        resolve(pdf);
      });
      doc.on("error", (err: Error) => {
        reject(err);
      });

      //todo this is where we'd write the pdf

      this.displayLetterGrid(doc, puzzle.getGridLetters());

      doc.end();
    });
  }
}

// const gridText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(12);
// for (let lineNum = 0; lineNum < lines.length; lineNum++) {
//   const line = lines[lineNum];
//   for (let charNum = 0; charNum < line.length; charNum++) {
//     gridText.text(
//       line[charNum],
//       horizStart + charNum * horizSpacing,
//       vertStart + lineNum * vertSpacing
//     );
//   }
// }

// Draw the grid
// const lines = wsGrid
//   .getGridOutput()
//   .split("\n")
//   .map(line => line.split(""));

// const horizStart = 50;
// const vertStart = 50;
// const horizSpacing = 15;
// const vertSpacing = 20;

// const gridText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(12);
// for (let lineNum = 0; lineNum < lines.length; lineNum++) {
//   const line = lines[lineNum];
//   for (let charNum = 0; charNum < line.length; charNum++) {
//     gridText.text(
//       line[charNum],
//       horizStart + charNum * horizSpacing,
//       vertStart + lineNum * vertSpacing
//     );
//   }
// }

// const lineStartVert = vertStart + lines.length * vertSpacing;

// Draw a line between grid and words
// doc
//   .moveTo(25, lineStartVert)
//   .lineTo(600, lineStartVert)
//   .lineTo(600, lineStartVert + 2)
//   .lineTo(25, lineStartVert + 2)
//   .lineTo(25, lineStartVert)
//   .fill("#000000");

// List words
// const wordText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(10);
// const words = wl.getAllWordsOriginal();
// const wordsPerLine = 3;
// const wordLines = Math.ceil(words.length / wordsPerLine);

// const wordHorizStart = 50;
// const wordVertStart = lineStartVert + 25;
// const wordHorizSpacing = Math.floor(600 / wordsPerLine);
// const wordVertSpacing = 30;

// for (let wordLine = 0; wordLine < wordLines; wordLine++) {
//   for (let wordNum = 0; wordNum < wordsPerLine; wordNum++) {
//     const word = words[wordLine * wordsPerLine + wordNum];
//     if (word) {
//       wordText.text(
//         word,
//         wordHorizStart + wordNum * wordHorizSpacing,
//         wordVertStart + wordLine * wordVertSpacing
//       );
//     }
//   }
// }
