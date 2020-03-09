import * as pdfkit from "pdfkit";
const PDFDocument = require("pdfkit");
import { WordSeekGridPdfFormatter } from "./WordSeekGridPdfFormatter";
import { WordSeekPuzzle } from "../src/WordSeekPuzzle";
import { LetterGrid } from "./LetterGrid";
import { GridDirection } from "./GridDirection";
import { WordLocation } from "./WordLocation";
import { WordSeekFinder, WordLocationMapping } from "./WordSeekFinder";

class Coordinate {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class WordSeekSolutionPdfFormatter extends WordSeekGridPdfFormatter {
  public static readonly SOLUTION_X_OFFSET = 5;
  public static readonly SOLUTION_Y_OFFSET = -2;

  getXCentered(gridX: number): number {
    return (
      WordSeekGridPdfFormatter.GRID_START_X_POS +
      WordSeekSolutionPdfFormatter.SOLUTION_X_OFFSET +
      gridX * WordSeekGridPdfFormatter.GRID_X_SPACING
    );
  }

  getYCentered(gridY: number): number {
    return (
      WordSeekGridPdfFormatter.GRID_START_Y_POS +
      WordSeekSolutionPdfFormatter.SOLUTION_Y_OFFSET +
      (gridY + 0.5) * WordSeekGridPdfFormatter.GRID_Y_SPACING
    );
  }

  private normalizeSolution(solution: WordLocation, length: number) {
    const x = solution.getX();
    const y = solution.getY();

    switch (solution.getDirection()) {
      case GridDirection.WEST:
        return new WordLocation(x - length + 1, y, GridDirection.EAST);

      case GridDirection.NORTH:
        return new WordLocation(x, y - length + 1, GridDirection.SOUTH);

      case GridDirection.NORTHWEST:
        return new WordLocation(
          x - length + 1,
          y - length + 1,
          GridDirection.SOUTHEAST
        );

      case GridDirection.SOUTHWEST:
        return new WordLocation(
          x - length + 1,
          y + length - 1,
          GridDirection.NORTHEAST
        );

      default:
        return solution;
    }
  }

  getCornerOffsets = (direction: GridDirection): Array<Coordinate> => {
    const x = WordSeekGridPdfFormatter.GRID_X_SPACING / 2;
    const y = WordSeekGridPdfFormatter.GRID_Y_SPACING / 2;

    switch (direction) {
      case GridDirection.EAST:
        return [
          new Coordinate(-x * 0.4, -y),
          new Coordinate(x * 0.4, -y),
          new Coordinate(x * 0.4, y),
          new Coordinate(-x * 0.4, y)
        ];
      case GridDirection.SOUTH:
        return [
          new Coordinate(x, -y * 0.4),
          new Coordinate(x, y * 0.4),
          new Coordinate(-x, y * 0.4),
          new Coordinate(-x, -y * 0.4)
        ];
      case GridDirection.SOUTHEAST:
        return [
          new Coordinate(0, -y),
          new Coordinate(x, -0),
          new Coordinate(0, y),
          new Coordinate(-x, 0)
        ];
      case GridDirection.NORTHEAST:
        return [
          new Coordinate(-x, -0),
          new Coordinate(0, -y),
          new Coordinate(x, 0),
          new Coordinate(0, y)
        ];

      default:
        return [
          new Coordinate(-0, -0),
          new Coordinate(0, -0),
          new Coordinate(0, 0),
          new Coordinate(-0, 0)
        ];
    }
  };

  getCorners = (solution: WordLocation, length: number): Array<Coordinate> => {
    // todo these need to change based on direction

    const x1Base = this.getXCentered(solution.getX());
    const y1Base = this.getYCentered(solution.getY());

    const x2Base = this.getXCentered(
      solution.getX() + solution.getDirection().getX() * (length - 1)
    );
    const y2Base = this.getYCentered(
      solution.getY() + solution.getDirection().getY() * (length - 1)
    );

    const cornerOffsets = this.getCornerOffsets(solution.getDirection());

    const xSpace = 0; //WordSeekGridPdfFormatter.GRID_X_SPACING / 2;
    const ySpace = 0; // WordSeekGridPdfFormatter.GRID_Y_SPACING / 2;

    return [
      new Coordinate(x1Base + cornerOffsets[0].x, y1Base + cornerOffsets[0].y),
      new Coordinate(x2Base + cornerOffsets[1].x, y2Base + cornerOffsets[1].y),
      new Coordinate(x2Base + cornerOffsets[2].x, y2Base + cornerOffsets[2].y),
      new Coordinate(x1Base + cornerOffsets[3].x, y1Base + cornerOffsets[3].y)
    ];
  };

  private displaySolution(doc: any, rawSolution: WordLocation, length: number) {
    const solution = this.normalizeSolution(rawSolution, length);

    const corners = this.getCorners(solution, length);

    const corner1 = `${corners[0].x} ${corners[0].y}`;
    const corner2 = `${corners[1].x} ${corners[1].y}`;
    const corner3 = `${corners[2].x} ${corners[2].y}`;
    const corner4 = `${corners[3].x} ${corners[3].y}`;

    const arcRadiusX = WordSeekGridPdfFormatter.GRID_X_SPACING / 2;
    const arcRadiusY = WordSeekGridPdfFormatter.GRID_Y_SPACING / 2;

    const moveToStart = `M ${corner1}`;
    const firstLine = `L ${corner2}`;
    const firstEnd = `A ${arcRadiusX} ${arcRadiusY} 0 0 1 ${corner3}`;
    const secondLine = `L ${corner4}`;
    const secondEnd = `A ${arcRadiusX} ${arcRadiusY} 0 0 1 ${corner1}`;

    doc
      .path(
        `${moveToStart} ${firstLine} ${firstEnd} ${secondLine} ${secondEnd}`
      )
      .stroke();
  }

  private displaySolutions(doc: any, solutions: WordLocationMapping) {
    Object.keys(solutions).forEach((word: string) => {
      if (solutions[word]) {
        const solution: WordLocation = solutions[word]!;
        this.displaySolution(doc, solution, word.length);
      }
    });
    // these are just for testing delete later
    // this.displaySolution(doc, new WordLocation(1, 0, GridDirection.EAST), 10);
    // this.displaySolution(doc, new WordLocation(12, 5, GridDirection.WEST), 10);
    // this.displaySolution(doc, new WordLocation(2, 8, GridDirection.SOUTH), 8);
    // this.displaySolution(
    //   doc,
    //   new WordLocation(3, 6, GridDirection.SOUTHEAST),
    //   8
    // );
    // this.displaySolution(
    //   doc,
    //   new WordLocation(3, 6, GridDirection.NORTHEAST),
    //   4
    // );
  }

  format(
    puzzle: WordSeekPuzzle,
    solutions: WordLocationMapping
  ): Promise<Buffer> {
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

      this.displayLetterGrid(doc, puzzle.getGridLetters());
      this.displaySolutions(doc, solutions);
      doc.end();
    });
  }
}
//WordLocationMapping
