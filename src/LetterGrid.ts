import * as fs from "fs";

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

export class GridDirection {
  readonly x: number;
  readonly y: number;

  constructor(deltaX: number, deltaY: number) {
    this.x = deltaX;
    this.y = deltaY;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }
}

export class LetterGrid {
  public static readonly EAST = new GridDirection(1, 0);
  public static readonly WEST = new GridDirection(-1, 0);
  public static readonly SOUTH = new GridDirection(0, 1);
  public static readonly NORTH = new GridDirection(0, -1);
  public static readonly SOUTHEAST = new GridDirection(1, 1);
  public static readonly SOUTHWEST = new GridDirection(-1, 1);
  public static readonly NORTHEAST = new GridDirection(1, -1);
  public static readonly NORTHWEST = new GridDirection(-1, -1);

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

  placeWordAt(
    x: number,
    y: number,
    direction: GridDirection,
    word: string
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
}
