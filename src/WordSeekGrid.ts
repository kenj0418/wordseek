import { WordList } from "./WordList";
import { LetterGrid } from "./LetterGrid";

export class WordSeekGrid {
  readonly words: WordList;
  readonly grid: LetterGrid;

  static generateGrid(baseGrid: LetterGrid, wordList: WordList): LetterGrid {
    let currGrid = baseGrid;
    let currWordList = wordList;

    let currWord = currWordList.getRandomWord();
    while (currWord) {
      currGrid = currGrid.addWord(currWord);
      currWordList = currWordList.getRemainingWordList(currWord);
      currWord = currWordList.getRandomWord();
    }

    return currGrid.fillVacant();
  }

  constructor(wordList: WordList, forceWidth?: number, forceHeight?: number) {
    const baseGrid =
      forceWidth || forceHeight
        ? new LetterGrid().expandSize(forceWidth || 0, forceHeight || 0)
        : new LetterGrid();
    this.words = wordList;
    this.grid = WordSeekGrid.generateGrid(baseGrid, wordList);
  }

  getGrid(): LetterGrid {
    return this.grid;
  }

  getGridOutput(): string {
    return this.grid.getLetters().join("\n");
  }

  getWordsOutput(): string {
    return this.words
      .getAllWords()
      .sort()
      .join("\n");
  }

  getWidth(): number {
    return this.grid.getWidth();
  }

  getHeight(): number {
    return this.grid.getHeight();
  }
}
