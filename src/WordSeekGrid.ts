import { GridDirection } from "./GridDirection";
import { LetterGrid } from "./LetterGrid";
import { WordLocation } from "./WordLocation";
import { WordSeekFinder } from "./WordSeekFinder";

const maxPlacementAttemptBeforeExpand = 1000;

const randomNumber = (n: number): number => {
  return Math.floor(Math.random() * n);
};

export class WordSeekGrid {
  private readonly letterGrid: LetterGrid;

  constructor();
  constructor(letters: LetterGrid);
  constructor(letters: Array<string>);
  constructor(letters: Array<string>, fixedWidth?: number);
  constructor(letters?: Array<string> | LetterGrid, fixedWidth?: number) {
    if (!letters) {
      this.letterGrid = new LetterGrid();
    } else if (letters && letters instanceof LetterGrid) {
      this.letterGrid = <LetterGrid>letters!;
    } else {
      this.letterGrid = new LetterGrid(<Array<string>>letters, fixedWidth);
    }
  }

  getWidth(): number {
    return this.letterGrid.getWidth();
  }

  getHeight(): number {
    return this.letterGrid.getHeight();
  }

  getLetters(): Array<string> {
    return this.letterGrid.getLetters();
  }

  fillVacant(): WordSeekGrid {
    return new WordSeekGrid(this.letterGrid.fillVacant());
  }

  private get(x: number, y: number): string {
    return this.letterGrid.get(x, y);
  }

  private set(x: number, y: number, ch: string): WordSeekGrid {
    return new WordSeekGrid(this.letterGrid.set(x, y, ch));
  }

  placeWordAt(
    word: string,
    x: number,
    y: number,
    direction: GridDirection
  ): WordSeekGrid | undefined {
    let currX = x;
    let currY = y;
    let currGrid: WordSeekGrid = this;
    let currIndex = 0;

    while (currIndex < word.length) {
      const outOfRange =
        currX < 0 ||
        currY < 0 ||
        currX >= currGrid.getWidth() ||
        currY >= currGrid.getHeight();
      if (outOfRange) {
        return undefined;
      }
      const currValue = currGrid.get(currX, currY);
      const desiredValue = word[currIndex];
      if (currValue == "?") {
        currGrid = currGrid.set(currX, currY, word[currIndex]);
      } else if (currValue != desiredValue) {
        return undefined; // conflict, can't place
      }
      currIndex++;
      currX += direction.getX();
      currY += direction.getY();
    }
    return currGrid;
  }

  findRandomPlacement(
    word: string,
    direction: GridDirection
  ): WordLocation | undefined {
    const solver = new WordSeekFinder(this.fillVacant());
    const existingLocation = solver.findWord(word);
    if (existingLocation) {
      return existingLocation;
    } else {
      for (let i = 0; i < maxPlacementAttemptBeforeExpand; i++) {
        const x = randomNumber(this.getWidth());
        const y = randomNumber(this.getHeight());
        if (this.placeWordAt(word, x, y, direction)) {
          return new WordLocation(x, y, direction);
        }
      }
      return undefined;
    }
  }

  private expandRandom(): WordSeekGrid {
    return new WordSeekGrid(this.letterGrid.expandRandom());
  }

  private placeWord(
    // todo refactor placeWord and placeWordAt
    word: string,
    placement: WordLocation
  ): WordSeekGrid | undefined {
    return this.placeWordAt(
      word,
      placement.getX(),
      placement.getY(),
      placement.getDirection()
    );
  }

  addWord(word: string): WordSeekGrid {
    const maxExpand = word.length * 5; // so doesn't try for ever if things go wrong

    const randomDirection =
      GridDirection.ALL_DIRECTIONS[
        randomNumber(GridDirection.ALL_DIRECTIONS.length)
      ];
    let currGrid: WordSeekGrid = this;
    for (let i = 0; i <= maxExpand; i++) {
      const placement = currGrid.findRandomPlacement(word, randomDirection);
      if (placement) {
        return currGrid.placeWord(word, placement)!;
      }
      currGrid = currGrid.expandRandom();
    }

    throw new Error(
      `Unable to place word even after expanding grid ${maxExpand} times.`
    );
  }
}

// private readonly allowHorizExpand: boolean;
// constructor(letters?: Array<string>, fixedWidth?: number) {
//   if (
//     fixedWidth &&
//     letters &&
//     letters.length &&
//     fixedWidth < getMaxWidth(letters)
//   ) {
//     throw new Error(
//       `Fixed width of ${fixedWidth} too small for letters provided with width of ${getMaxWidth(
//         letters
//       )}`
//     );
//   }
//   this.allowHorizExpand = !fixedWidth;
//   this.gridHeight = letters ? letters.length : 0;
//   if (fixedWidth) {
//     this.gridWidth = fixedWidth;
//   } else if (letters && letters.length) {
//     this.gridWidth = getMaxWidth(letters);
//   } else {
//     this.gridWidth = 0;
//   }
//   this.letters = letters ? normalizeWidth(letters, this.gridWidth) : [];
// }

// getFixedWidth(): number | undefined {
//   return this.allowHorizExpand ? 0 : this.gridWidth;
// }

// placeWord(word: string, placement: WordLocation): LetterGrid | undefined {
//   return this.placeWordAt(
//     word,
//     placement.getX(),
//     placement.getY(),
//     placement.getDirection()
//   );
// }

// addWord(word: string): LetterGrid {
//   const maxExpand = word.length * 5; // so doesn't try for ever if things go wrong
//   const randomDirection =
//     GridDirection.ALL_DIRECTIONS[
//       randomNumber(GridDirection.ALL_DIRECTIONS.length)
//     ];
//   let currGrid: LetterGrid = this;
//   for (let i = 0; i <= maxExpand; i++) {
//     const placement = currGrid.findRandomPlacement(word, randomDirection);
//     if (placement) {
//       return currGrid.placeWord(word, placement)!;
//     }
//     currGrid = currGrid.expandRandom();
//   }
//   throw new Error(
//     `Unable to place word even after expanding grid ${maxExpand} times.`
//   );
// }
