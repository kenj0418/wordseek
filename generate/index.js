"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var WordList = /** @class */ (function () {
    function WordList(words) {
        this.words = [];
        //
    }
    WordList.prototype.getAllWords = function () {
        return this.words;
    };
    WordList.prototype.getRandomWord = function () {
        return "NOT IMPLEMENTED";
    };
    WordList.prototype.getRemainingWordList = function (wordToRemove) {
        return this;
    };
    return WordList;
}());
var WordSeekGrid = /** @class */ (function () {
    function WordSeekGrid() {
    }
    WordSeekGrid.prototype.getGridOutput = function () {
        return "getGridOutput NOT IMPLEMENTED";
    };
    WordSeekGrid.prototype.getWordsOutput = function () {
        return "getWordsOutput NOT IMPLEMENTED";
    };
    WordSeekGrid.prototype.getOutput = function () {
        return this.getGridOutput() + "\n\n" + this.getWordsOutput();
    };
    return WordSeekGrid;
}());
var readFileAsArray = function (filename) {
    return fs
        .readFileSync(filename)
        .toString()
        .split("\n");
};
function readWordListFromFile(filename) {
    return new WordSeekGrid();
}
var grid = readWordListFromFile("test/wordList1.txt");
console.log(grid.getOutput());
