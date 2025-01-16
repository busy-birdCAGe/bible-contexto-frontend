import { BACKEND_BUCKET } from "../env";
import { errorMessages, gameServiceDataKey, bucketKeys } from "../constants";
import { GameToken } from "../utils";


interface GameServiceData {
  guessWords?: Array<string>;
  stopWords?: Array<string>;
  cacheExpiration: number;
}

export default class GameService {
  word?: string;
  dailyGames: Array<GameToken> = [];
  language?: string;
  wordList?: Array<string>;
  guessWords?: Array<string>;
  stopWords?: Array<string>;
  cacheExpiration: number;

  constructor() {
    let data: GameServiceData = JSON.parse(
      localStorage.getItem(gameServiceDataKey) || "{}"
    );
    this.guessWords = data.guessWords;
    this.stopWords = data.stopWords;
    this.cacheExpiration = data.cacheExpiration || 0;
  }

  async init(language: string): Promise<void> {
    this.language = language;
    const current_time = Math.floor(Date.now() / 1000);

    let dailyGamesRaw = await this.backendGet(bucketKeys.dailyGames);
    this.dailyGames = dailyGamesRaw.split("\n").map((line) => {
      let [gameId, wordId] = line.split(",");
      return { gameId, wordId };
    });

    if (!this.guessWords || this.cacheExpiration < current_time) {
      let guessWords_string = await this.backendGet(bucketKeys.guessWords);
      this.guessWords = guessWords_string.split("\n");
      this.cacheExpiration = current_time + 60 * 60;
      this.saveCache();
    }

    if (!this.stopWords || this.cacheExpiration < current_time) {
      let stopWords_string = await this.backendGet(bucketKeys.stopWords);
      this.stopWords = stopWords_string.split("\n");
      this.cacheExpiration = current_time + 60 * 60;
      this.saveCache();
    }
  }

  async backendGet(key: string): Promise<string> {
    let response = await fetch(`${BACKEND_BUCKET}/${this.language}/${key}`);
    if (!response.ok) {
      throw new Error(errorMessages.backend.any);
    }
    return await response.text();
  }

  async getWordList(wordKey: string): Promise<void> {
    let wordListString = await this.backendGet(wordKey);
    this.wordList = wordListString.split(",");
  }

  isWord(word: string): boolean {
    if (this.guessWords) {
      return this.guessWords.includes(word.toLowerCase());
    }
    return true;
  }

  isStopWord(word: string): boolean {
    if (this.stopWords) {
      return this.stopWords.includes(word.toLowerCase());
    }
    return false;
  }

  todaysGameToken(): GameToken {
    return this.dailyGames.slice(-1)[0]
  }

  saveCache(): void {
    localStorage.setItem(
      gameServiceDataKey,
      JSON.stringify({
        guessWords: this.guessWords,
        stopWords: this.stopWords,
        cacheExpiration: this.cacheExpiration,
      })
    );
  }
};