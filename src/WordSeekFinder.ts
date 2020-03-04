import { WordSeekGrid } from "./WordSeekGrid";
import { GridDirection } from "./GridDirection";
import { WordLocation } from "./WordLocation";

interface WordLocationMapping {
  [index: string]: WordLocation | undefined;
}

export class WordSeekFinder {
  readonly grid: WordSeekGrid;

  constructor(grid: WordSeekGrid) {
    this.grid = grid;
  }

  findWordAt(x: number, y: number, word: string): GridDirection | undefined {
    const filledGrid = this.grid.fillVacant();
    for (let i = 0; i < GridDirection.ALL_DIRECTIONS.length; i++) {
      let dir = GridDirection.ALL_DIRECTIONS[i];
      if (filledGrid.placeWordAt(word, x, y, dir)) {
        return dir;
      }
    }

    return undefined;
  }

  findWord(word: string): WordLocation | undefined {
    for (let x = 0; x < this.grid.getWidth(); x++) {
      for (let y = 0; y < this.grid.getHeight(); y++) {
        const foundAtDir = this.findWordAt(x, y, word);
        if (foundAtDir) {
          return new WordLocation(x, y, foundAtDir);
        }
      }
    }

    return undefined;
  }

  findWords(words: Array<string>): WordLocationMapping {
    let mapping: WordLocationMapping = {};
    words.forEach(word => {
      mapping[word] = this.findWord(word);
    });
    return mapping;
  }
}
