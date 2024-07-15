import { BACKEND_BUCKET } from "../env";
import { errorMessages, guessServiceDataKey } from "../constants";
import { stem } from "stemr";


interface GuessServiceData {
  guess_words?: Array<string>;
  stop_words?: Array<string>;
  cache_expiration: number;
}

export interface DailyGame {
  game_id: string
  word_id: string
}

export default class GuessService {
  word?: string;
  daily_games: Array<DailyGame> = [];
  language?: string;
  word_list?: Array<string>;
  guess_words?: Array<string>;
  stop_words?: Array<string>;
  cache_expiration: number;

  constructor() {
    let data: GuessServiceData = JSON.parse(
      localStorage.getItem(guessServiceDataKey) || "{}"
    );
    this.guess_words = data.guess_words;
    this.stop_words = data.stop_words;
    this.cache_expiration = data.cache_expiration || 0;
  }

  async init(language: string): Promise<void> {
    this.language = language;
    const current_time = Math.floor(Date.now() / 1000);

    this.word = await this.backend_get("key_of_the_day");
    await this.get_word_list(this.word);

    let daily_games_raw = await this.backend_get("daily_games")
    this.daily_games = daily_games_raw.split("\n").map(line => {
      let [game_id, word_id] = line.split(",")
      return {game_id, word_id}
    })

    if (!this.guess_words || this.cache_expiration < current_time) {
      let guess_words_string = await this.backend_get("guess_words.txt")
      this.guess_words = guess_words_string.split("\n");
      this.cache_expiration = current_time + 60 * 60;
      this.save_cache();
    }

    if (!this.stop_words || this.cache_expiration < current_time) {
      let stop_words_string = await this.backend_get("stop_words.txt")
      this.stop_words = stop_words_string.split("\n");
      this.cache_expiration = current_time + 60 * 60;
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

  async get_word_list(word_key: string): Promise<void> {
    let word_list_string = await this.backend_get(word_key);
    this.word_list = word_list_string.split(",");
  }

  is_word(word: string): boolean {
    if (this.guess_words) {
      return this.guess_words.includes(word.toLowerCase());
    }
    return true;
  }

  is_stop_word(word: string): boolean {
    if (this.stop_words) {
      return this.stop_words.includes(word.toLowerCase());
    }
    return false;
  }

  stem_word(word: string): string {
    let lower: string = word.toLowerCase();
    return stem(lower);
  }

  guess(word: string): number {
    if (!this.word_list) {
      throw Error(errorMessages.guessing.noData);
    }
    let index = this.word_list.indexOf(word);
    if (index == -1 && word.endsWith("s")) {
      index = this.word_list.indexOf(word.slice(0, -1));
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
        guess_words: this.guess_words,
        stop_words: this.stop_words,
        cache_expiration: this.cache_expiration,
      })
    );
  }
};
