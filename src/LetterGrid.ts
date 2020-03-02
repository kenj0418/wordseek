import { GridDirection } from "./GridDirection";
import { WordLocation } from "./WordLocation";
import { WordSeekFinder } from "./WordSeekFinder";

const lettersToChoose = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // change if want to allow numbers, exclude Q, Z, etc.
const maxPlacementAttemptBeforeExpand = 1000;
const expandChunkSize = 10; // number of row/col to expand by if expanding

const randomNumber = (n: number): number => {
  return Math.floor(Math.random() * n);
};

const normalizeStringWidth = (st: string, targetWidth: number): string => {
  let returnString = st;
  while (returnString.length < targetWidth) {
    returnString = returnString + "?";
  }
  return returnString;
};

const normalizeWidth = (
  letters: Array<string>,
  targetWidth: number
): Array<string> => {
  const arr = new Array<string>(letters.length);
  for (let i = 0; i < letters.length; i++) {
    arr[i] = normalizeStringWidth(letters[i], targetWidth);
  }
  return arr;
};

const getMaxWidth = (letters: Array<string>): number => {
  let currMax = 0;

  letters.forEach(row => {
    if (row && row.length > currMax) {
      currMax = row.length;
    }
  });

  return currMax;
};

export class LetterGrid {
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly letters: Array<string>;

  constructor(letters?: Array<string>) {
    this.gridHeight = letters ? letters.length : 0;
    this.gridWidth = letters ? getMaxWidth(letters) : 0;
    this.letters = letters ? normalizeWidth(letters, this.gridWidth) : [];
  }

  getWidth(): number {
    return this.gridWidth;
  }

  getHeight(): number {
    return this.gridHeight;
  }

  getLetters(): Array<string> {
    return this.letters;
  }

  expandLeft(): LetterGrid {
    const newLetters = this.letters.map(row => "?" + row);
    return new LetterGrid(newLetters);
  }

  expandRight(): LetterGrid {
    const newLetters = this.letters.map(row => row + "?");
    return new LetterGrid(newLetters);
  }

  expandUp(): LetterGrid {
    const targetWidth = this.letters.length ? this.letters[0].length : 0;
    const newLetters = [normalizeStringWidth("", targetWidth), ...this.letters];
    return new LetterGrid(newLetters);
  }

  expandDown(): LetterGrid {
    const targetWidth = this.letters.length ? this.letters[0].length : 0;
    const newLetters = [...this.letters, normalizeStringWidth("", targetWidth)];
    return new LetterGrid(newLetters);
  }

  expandRandom(): LetterGrid {
    const direction = randomNumber(4);

    let currGrid: LetterGrid = this;

    for (let i = 0; i < expandChunkSize; i++) {
      switch (direction) {
        case 0:
          currGrid = currGrid.expandUp();
        case 1:
          currGrid = currGrid.expandDown();
        case 2:
          currGrid = currGrid.expandLeft();
        default:
          currGrid = currGrid.expandRight();
      }
    }

    return currGrid;
  }

  expandSize(newWidth: number, newHeight: number): LetterGrid {
    let currGrid: LetterGrid = this;

    while (currGrid.getHeight() < newHeight) {
      if (Math.random() >= 0.5) {
        currGrid = currGrid.expandUp();
      } else {
        currGrid = currGrid.expandDown();
      }
    }

    while (currGrid.getWidth() < newWidth) {
      if (Math.random() >= 0.5) {
        currGrid = currGrid.expandLeft();
      } else {
        currGrid = currGrid.expandRight();
      }
    }

    return currGrid;
  }

  checkPosition(x: number, y: number): void {
    if (x >= this.getWidth() || y >= this.getHeight()) {
      throw new Error(
        `Out of range position (${x},${y}) in ${this.getWidth() +
          1}x${this.getHeight() + 1} grid`
      );
    }
  }

  get(x: number, y: number): string {
    this.checkPosition(x, y);
    return this.letters[y][x];
  }

  set(x: number, y: number, ch: string): LetterGrid {
    this.checkPosition(x, y);

    const setInString = (st: string, index: number, ch: string): string => {
      return st.slice(0, index) + ch + st.slice(index + 1);
    };

    const newLetters = this.letters.map((row, index) => {
      return index == y ? setInString(row, x, ch) : row;
    });
    return new LetterGrid(newLetters);
  }

  setRandom(x: number, y: number): LetterGrid {
    const randomLetter =
      lettersToChoose[Math.floor(Math.random() * lettersToChoose.length)];
    return this.set(x, y, randomLetter);
  }

  fillVacant(): LetterGrid {
    let curr: LetterGrid = this;
    for (let x = 0; x < this.getWidth(); x++) {
      for (let y = 0; y < this.getHeight(); y++) {
        if (curr.get(x, y) == "?") {
          curr = curr.setRandom(x, y);
        }
      }
    }

    return curr;
  }

  placeWordAt(
    word: string,
    x: number,
    y: number,
    direction: GridDirection
  ): LetterGrid | undefined {
    let currX = x;
    let currY = y;
    let currGrid: LetterGrid = this;
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

  placeWord(word: string, placement: WordLocation): LetterGrid | undefined {
    return this.placeWordAt(
      word,
      placement.getX(),
      placement.getY(),
      placement.getDirection()
    );
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

  addWord(word: string): LetterGrid {
    const maxExpand = word.length * 5; // so doesn't try for ever if things go wrong

    const randomDirection =
      GridDirection.ALL_DIRECTIONS[
        randomNumber(GridDirection.ALL_DIRECTIONS.length)
      ];

    let currGrid: LetterGrid = this;
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
