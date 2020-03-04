import { WordList } from "./WordList";
import { WordSeekGrid } from "./WordSeekGrid";

export class WordSeekPuzzle {
  readonly words: WordList;
  readonly grid: WordSeekGrid;

  static generateGrid(
    baseGrid: WordSeekGrid,
    wordList: WordList
  ): WordSeekGrid {
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

  constructor(wordList: WordList, fixedWidth?: number, initialHeight?: number) {
    const baseGrid = new WordSeekGrid([], fixedWidth);
    //todo nothing with initialHeight currently.
    this.words = wordList;
    this.grid = WordSeekPuzzle.generateGrid(baseGrid, wordList);
  }

  getGrid(): WordSeekGrid {
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
