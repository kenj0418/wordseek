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
  private readonly fixedWidth?: number;
  private readonly fixedHeight?: number;

  constructor();
  constructor(letters: LetterGrid);
  constructor(letters: Array<string>);
  constructor(
    letters: Array<string>,
    fixedWidth?: number,
    fixedHeight?: number
  );
  constructor(
    letters?: Array<string> | LetterGrid,
    fixedWidth?: number,
    fixedHeight?: number
  ) {
    if (!letters) {
      this.letterGrid = new LetterGrid();
    } else if (letters && letters instanceof LetterGrid) {
      this.letterGrid = <LetterGrid>letters!;
    } else {
      this.letterGrid = new LetterGrid(<Array<string>>letters).expandSize(
        fixedWidth || 0,
        fixedHeight || 0
      );
      this.fixedWidth = fixedWidth;
      this.fixedHeight = fixedHeight;
    }
  }

  private newFromLetterGrid(letters: LetterGrid): WordSeekGrid {
    return new WordSeekGrid(
      letters.getLetters(),
      this.fixedWidth,
      this.fixedHeight
    );
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
    return this.newFromLetterGrid(this.letterGrid.fillVacant());
  }

  private get(x: number, y: number): string {
    return this.letterGrid.get(x, y);
  }

  private set(x: number, y: number, ch: string): WordSeekGrid {
    return this.newFromLetterGrid(this.letterGrid.set(x, y, ch));
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
    if (this.fixedHeight) {
      throw new Error("Size is fixed and could not be expanded");
    } else if (this.fixedWidth) {
      return this.newFromLetterGrid(this.letterGrid.expandVertical());
    } else {
      return this.newFromLetterGrid(this.letterGrid.expandRandom());
    }
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

  private addWordFixedGrid(word: string): WordSeekGrid {
    // adding when can not expand
    const maxAttempts = 100;

    for (let i = 0; i <= maxAttempts; i++) {
      const randomDirection =
        GridDirection.ALL_DIRECTIONS[
          randomNumber(GridDirection.ALL_DIRECTIONS.length)
        ];

      const placement = this.findRandomPlacement(word, randomDirection);
      if (placement) {
        return this.placeWord(word, placement)!;
      }
    }

    throw new Error(
      `Unable to place word even after trying ${maxAttempts} attempts.  Grid may be too small.`
    );
  }

  private addWordExpandableGrid(word: string): WordSeekGrid {
    // adding when can expand
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

  addWord(word: string): WordSeekGrid {
    if (this.fixedHeight) {
      return this.addWordFixedGrid(word);
    } else {
      return this.addWordExpandableGrid(word);
    }
  }
}
