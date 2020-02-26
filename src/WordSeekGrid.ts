import { WordList } from "./WordList";

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
  readonly grid: Array<string>;

  constructor(wordList: WordList, forceWidth?: number, forceHeight?: number) {
    this.grid = new Array<string>(0);
    this.words = wordList;
  }

  getGridOutput(): string {
    return this.grid.join(""); //todo \n
  }

  getWordsOutput(): string {
    return ""; //getWordsOutput NOT IMPLEMENTED
  }

  // getOutput(): string {
  //   return this.getGridOutput() + "\n\n" + this.getWordsOutput();
  // }
}
