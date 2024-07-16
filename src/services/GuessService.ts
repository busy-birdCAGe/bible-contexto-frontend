import { BACKEND_BUCKET } from "../env";
import { errorMessages, guessServiceDataKey, bucketKeys } from "../constants";


interface GuessServiceData {
  guessWords?: Array<string>;
  stopWords?: Array<string>;
  cacheExpiration: number;
}

export interface DailyGame {
  gameId: string
  wordId: string
}

export default class GuessService {
  word?: string;
  dailyGames: Array<DailyGame> = [];
  language?: string;
  wordList?: Array<string>;
  guessWords?: Array<string>;
  stopWords?: Array<string>;
  cacheExpiration: number;

  constructor() {
    let data: GuessServiceData = JSON.parse(
      localStorage.getItem(guessServiceDataKey) || "{}"
    );
    this.guessWords = data.guessWords;
    this.stopWords = data.stopWords;
    this.cacheExpiration = data.cacheExpiration || 0;
  }

  async init(language: string): Promise<void> {
    this.language = language;
    const current_time = Math.floor(Date.now() / 1000);

    let dailyGamesRaw = await this.backendGet(bucketKeys.dailyGames);
    this.dailyGames = dailyGamesRaw.split("\n").map(line => {
      let [gameId, wordId] = line.split(",")
      return {gameId, wordId}
    })

    if (!this.guessWords || this.cacheExpiration < current_time) {
      let guessWords_string = await this.backendGet(bucketKeys.guessWords);
      this.guessWords = guessWords_string.split("\n");
      this.cacheExpiration = current_time + 60 * 60;
      this.saveCache();
    }

    if (!this.stopWords || this.cacheExpiration < current_time) {
      let stopWords_string = await this.backendGet(bucketKeys.stopWords)
      this.stopWords = stopWords_string.split("\n");
      this.cacheExpiration = current_time + 60 * 60;
      this.saveCache();
    }
  }

  async backendGet(key: string): Promise<string> {
    let response = await fetch(
      `${BACKEND_BUCKET}/${this.language}/${key}`
    );
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

  saveCache(): void {
    localStorage.setItem(
      guessServiceDataKey,
      JSON.stringify({
        guessWords: this.guessWords,
        stopWords: this.stopWords,
        cacheExpiration: this.cacheExpiration,
      })
    );
  }
};
