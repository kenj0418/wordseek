import { WordList } from "./WordList";
import { LetterGrid } from "./LetterGrid";

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

  getGrid(): LetterGrid {
    return this.grid;
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
