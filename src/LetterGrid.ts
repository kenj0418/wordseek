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

    const newLetters = this.letters.map((row, index) =>
      index == y ? setInString(row, index, ch) : row
    );
    return new LetterGrid(newLetters);
  }
}
