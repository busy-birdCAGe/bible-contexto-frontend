import { BACKEND_BUCKET } from "../env";
import { errorMessages, guessServiceDataKey, bucketKeys } from "../constants";
import { stem } from "stemr";


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

    let dailyGamesRaw = await this.backend_get(bucketKeys.dailyGames);
    this.dailyGames = dailyGamesRaw.split("\n").map(line => {
      let [gameId, wordId] = line.split(",")
      return {gameId, wordId}
    })

    if (!this.guessWords || this.cacheExpiration < current_time) {
      let guessWords_string = await this.backend_get(bucketKeys.guessWords);
      this.guessWords = guessWords_string.split("\n");
      this.cacheExpiration = current_time + 60 * 60;
      this.save_cache();
    }

    if (!this.stopWords || this.cacheExpiration < current_time) {
      let stopWords_string = await this.backend_get(bucketKeys.stopWords)
      this.stopWords = stopWords_string.split("\n");
      this.cacheExpiration = current_time + 60 * 60;
      this.save_cache();
    }
  }

  async backend_get(url: string): Promise<string> {
    let response = await fetch(
      `${BACKEND_BUCKET}/${this.language}/${url}`
    );
    if (!response.ok) {
      throw new Error(errorMessages.backend.any);
    }
    return await response.text();
  }

  async get_word_list(wordKey: string): Promise<void> {
    let wordListString = await this.backend_get(wordKey);
    this.wordList = wordListString.split(",");
  }

  is_word(word: string): boolean {
    if (this.guessWords) {
      return this.guessWords.includes(word.toLowerCase());
    }
    return true;
  }

  is_stop_word(word: string): boolean {
    if (this.stopWords) {
      return this.stopWords.includes(word.toLowerCase());
    }
    return false;
  }

  stem_word(word: string): string {
    let lower: string = word.toLowerCase();
    return stem(lower);
  }

  guess(word: string): number {
    if (!this.wordList) {
      throw Error(errorMessages.guessing.noData);
    }
    let index = this.wordList.indexOf(word);
    if (index == -1 && word.endsWith("s")) {
      index = this.wordList.indexOf(word.slice(0, -1));
    }
    if (index == -1) {
      throw Error(errorMessages.guessing.unknown);
    }
    return index + 1;
  }

  save_cache(): void {
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
