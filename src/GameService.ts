import { bucketKeys } from "./constants";
import { GameToken, getWordIndex, stemWord, normalizeWord } from "./utils";
import BackendApi from "./api";
import { Guess } from "./state/reducer";


export default class GameService {
  private language: string;
  private backendApi: BackendApi;

  constructor(language: string) {
    this.language = language;
    this.backendApi = new BackendApi();
  }

  async getWordList(wordId: string): Promise<string[]> {
    const wordListString = await this.backendApi.get(`${this.language}/${wordId}`, true, null);
    return wordListString.split(",");
  }

  private async guessWords(): Promise<string[]> {
    const guessWordsString = await this.backendApi.get(`${this.language}/${bucketKeys.guessWords}`, false, 3600);
    return guessWordsString.split("\n")
  }

  async isWord(word: string): Promise<boolean> {
    const guessWords = await this.guessWords();
    return guessWords.includes(word.toLowerCase());
  }

  async isStopWord(word: string): Promise<boolean> {
    const stopWordsString = await this.backendApi.get(`${this.language}/${bucketKeys.stopWords}`, false, 3600);
    const stopWords = stopWordsString.split("\n")
    return stopWords.includes(word.toLowerCase());
  }

  async dailyGameTokens(): Promise<GameToken[]> {
    const gameTokensString = await this.backendApi.get(`${this.language}/${bucketKeys.dailyGames}`, false, 60);
    return gameTokensString.split("\n").map(token => {
      const [gameId, wordId] = token.split(",");
      return {gameId, wordId};
    });
  }

  async todaysGameToken(): Promise<GameToken> {
    const gameTokens = await this.dailyGameTokens();
    return gameTokens.slice(-1)[0];
  }

  async getWordId(word: string): Promise<string> {
    const wordIdMappingString = await this.backendApi.get(`${this.language}/${bucketKeys.wordToIdMapping}`, true, 3600);
    const wordToIdMapping = JSON.parse(wordIdMappingString);
    const wordList = Object.keys(wordToIdMapping);
    const stemmedWord = stemWord(word);
    const index = getWordIndex(stemmedWord, wordList);
    return wordToIdMapping[wordList[index]];
  };

  async getHintWord(wordId: string, guesses: Guess[]): Promise<string> {
    const wordList = await this.getWordList(wordId);
    const scores = guesses.map((guess) => guess.score);
    const minIndex = Math.min(...scores) - 1;
    const hintIndex = Math.ceil(minIndex / 2);
    const stemmedHintWord = wordList[hintIndex];
    const guessWords = await this.guessWords();
    let hintWord = stemmedHintWord;
    for (let guessWord of guessWords) {
      if (stemWord(guessWord) === stemmedHintWord) {
        hintWord = guessWord;
      }
    }
    return normalizeWord(hintWord);
  }
};
