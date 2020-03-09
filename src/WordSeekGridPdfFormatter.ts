import * as pdfkit from "pdfkit";
const PDFDocument = require("pdfkit");

export class WordSeekGridPdfFormatter {
  public static readonly GRID_START_X_POS = 50;
  public static readonly GRID_START_Y_POS = 50;
  public static readonly GRID_X_SPACING = 15;
  public static readonly GRID_Y_SPACING = 20;
  public static readonly GRID_MAX_WIDTH = 30;
  public static readonly GRID_MAX_HEIGHT = 40;

  protected createPdfDoc(): any {
    return new PDFDocument();
  }

  protected displayLetterGrid(doc: any, gridLines: Array<string>): number {
    const gridText = doc.font("/System/Library/Fonts/NewYork.ttf").fontSize(12);

    if (gridLines.length > WordSeekGridPdfFormatter.GRID_MAX_HEIGHT) {
      throw new Error(
        `Grid is too tall (height=${gridLines.length}) for this formatter.  Max height: ${WordSeekGridPdfFormatter.GRID_MAX_HEIGHT}`
      );
    }

    let yPos = 0;

    for (let lineNum = 0; lineNum < gridLines.length; lineNum++) {
      yPos =
        WordSeekGridPdfFormatter.GRID_START_Y_POS +
        lineNum * WordSeekGridPdfFormatter.GRID_Y_SPACING;
      const line = gridLines[lineNum];
      if (line.length > WordSeekGridPdfFormatter.GRID_MAX_WIDTH) {
        throw new Error(
          `Grid is too wide (width=${line.length}) for this formatter.  Max width: ${WordSeekGridPdfFormatter.GRID_MAX_WIDTH}`
        );
      }

      for (let charNum = 0; charNum < line.length; charNum++) {
        gridText.text(
          line[charNum],
          WordSeekGridPdfFormatter.GRID_START_X_POS +
            charNum * WordSeekGridPdfFormatter.GRID_X_SPACING,
          yPos
        );
      }
    }

    return yPos;
  }
}
