const cleanWord = (word: string): string => {
  return word.replace(/[^0-9a-z]/gi, "").toUpperCase();
};

const cleanWordsArray = (words: Array<string>): Array<string> => {
  const cleanWords = words.map(cleanWord);
  return [...new Set<string>(cleanWords)];
};

export class WordList {
  readonly originalWords: Array<string>;
  readonly words: Array<string>;

  constructor(words: Array<string>) {
    this.originalWords = [...new Set<string>(words)];
    this.words = cleanWordsArray(words);
  }

  getCount(): number {
    return this.words.length;
  }

  getAllWords(): Array<string> {
    return this.words;
  }

  getAllWordsOriginal(): Array<string> {
    return this.originalWords.sort();
  }

  getRandomWord(): string | undefined {
    const index = Math.floor(Math.random() * this.words.length);
    return this.words[index];
  }

  getRemainingWordList(wordToRemove: string): WordList {
    const remainingWords = this.words.filter(word => word != wordToRemove);
    return new WordList(remainingWords);
  }
}
