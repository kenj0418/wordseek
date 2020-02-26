import * as fs from "fs";

const cleanWord = (word: string): string => {
  return word.replace(/[^0-9a-z]/gi, "");
};

const cleanWordsArray = (words: Array<string>): Array<string> => {
  const cleanWords = words.map(cleanWord);
  return [...new Set<string>(cleanWords)];
};

export class WordList {
  words: Array<string>;

  constructor(words: Array<string>) {
    this.words = cleanWordsArray(words);
  }

  getAllWords(): Array<string> {
    return this.words;
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
