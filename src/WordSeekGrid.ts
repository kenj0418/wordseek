import { WordList } from "./WordList";
import { LetterGrid } from "./LetterGrid";

// const placeWordInGrid = (
//   currentGrid: Array<string>,
//   newWord: string
// ): Array<string> => {
//   return currentGrid;
// };

// const forceSize = (currentGrid, forceWidth?: number, forceHeight?: number) => {
//   const maxWidth = getMaxWidth(currentGrid);
//   if (forceWidth && forceWidth < maxWidth) {
//     throw new Error(`Forced width of ${forceWidth} is too small for grid with generated width of ${maxWidth}`);
//   }

//   const addLeft = (forceWidth) ? Math.floor((forceWidth - maxWidth) / 2) : 0;
//   const addRight = (forceWidth) ?
//   if (force
// }

export class WordSeekGrid {
  readonly words: WordList;
  readonly grid: LetterGrid;

  constructor(wordList: WordList, forceWidth?: number, forceHeight?: number) {
    const baseGrid = new LetterGrid();
    this.grid =
      forceWidth || forceHeight
        ? baseGrid.expandSize(forceWidth || 0, forceHeight || 0)
        : baseGrid;
    this.words = wordList;
  }

  getGridOutput(): string {
    return this.grid.getLetters().join("\n");
  }

  getWordsOutput(): string {
    return this.words.getAllWords().join("\n");
  }

  getWidth(): number {
    return this.grid.getWidth();
  }

  getHeight(): number {
    return this.grid.getHeight();
  }

  // getOutput(): string {
  //   return this.getGridOutput() + "\n\n" + this.getWordsOutput();
  // }
}
