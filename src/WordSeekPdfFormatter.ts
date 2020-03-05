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

  public static readonly GRID_WORD_Y_SEPARATION = 40;

  public static readonly WORD_X_START = 5;
  public static readonly WORD_X_SPACING = 200;
  public static readonly WORD_Y_SPACING = 30;

  protected createPdfDoc(): any {
    return new PDFDocument();
  }

  private displayLetterGrid(doc: any, gridLines: Array<string>): number {
    const gridText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(12);

    if (gridLines.length > WordSeekPdfFormatter.GRID_MAX_HEIGHT) {
      throw new Error(
        `Grid is too tall (height=${gridLines.length}) for this formatter.  Max height: ${WordSeekPdfFormatter.GRID_MAX_HEIGHT}`
      );
    }

    let yPos = 0;

    for (let lineNum = 0; lineNum < gridLines.length; lineNum++) {
      yPos =
        WordSeekPdfFormatter.GRID_START_Y_POS +
        lineNum * WordSeekPdfFormatter.GRID_Y_SPACING;
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
          yPos
        );
      }
    }

    return yPos;
  }

  private drawLine(doc: any, gridEndYPos: number): void {
    const lineStartVert =
      gridEndYPos + Math.floor(WordSeekPdfFormatter.GRID_WORD_Y_SEPARATION / 2);

    doc
      .moveTo(25, lineStartVert)
      .lineTo(600, lineStartVert)
      .lineTo(600, lineStartVert + 2)
      .lineTo(25, lineStartVert + 2)
      .lineTo(25, lineStartVert)
      .fill("#000000");
  }

  private displayWordList(
    doc: any,
    gridEndYPos: number,
    words: Array<string>
  ): void {
    const wordText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(10);
    const wordsPerLine = 3;
    const wordLines = Math.ceil(words.length / wordsPerLine);

    const wordHorizStart = WordSeekPdfFormatter.WORD_X_START;
    const wordVertStart =
      gridEndYPos + WordSeekPdfFormatter.GRID_WORD_Y_SEPARATION;
    const wordHorizSpacing = WordSeekPdfFormatter.WORD_X_SPACING;
    const wordVertSpacing = WordSeekPdfFormatter.WORD_Y_SPACING;

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

      const lastGridYPos = this.displayLetterGrid(doc, puzzle.getGridLetters());
      this.drawLine(doc, lastGridYPos);
      this.displayWordList(doc, lastGridYPos, puzzle.getWords());
      doc.end();
    });
  }
}
