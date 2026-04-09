import { bucketKeys } from "../constants";
import { GameToken } from "../utils";
import BackendApi from "../api";


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

  async isWord(word: string): Promise<boolean> {
    const guessWordsString = await this.backendApi.get(`${this.language}/${bucketKeys.guessWords}`, false, 3600);
    const guessWords = guessWordsString.split("\n")
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
};
