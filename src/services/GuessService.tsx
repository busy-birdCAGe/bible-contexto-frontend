import { BACKEND_BUCKET } from "../env";
import { errorMessages, guessServiceDataKey } from "../constants";
import { stem } from "stemr";


interface GuessServiceData {
  guess_words?: Array<string>;
  stop_words?: Array<string>;
  cache_expiration: number;
}

export default new (class GuessService {
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

  async init(word: string): Promise<void> {
    const current_time = Math.floor(Date.now() / 1000);

    let response = await fetch(`${BACKEND_BUCKET}/english/${word}`);
    if (!response.ok) {
      throw new Error(errorMessages.backend.any);
    }
    let word_list_string = await response.text();
    this.word_list = word_list_string.split(",");

    if (!this.guess_words || this.cache_expiration < current_time) {
      response = await fetch(
        `${BACKEND_BUCKET}/english/guess_words.txt`
      );
      if (!response.ok) {
        throw new Error(errorMessages.backend.any);
      }
      let guess_words_string = await response.text();
      this.guess_words = guess_words_string.split("\n");
      this.cache_expiration = current_time + 60 * 60;
      this.save_cache();
    }

    if (!this.stop_words || this.cache_expiration < current_time) {
      response = await fetch(
        `${BACKEND_BUCKET}/english/stop_words.txt`
      );
      if (!response.ok) {
        throw new Error(errorMessages.backend.any);
      }
      let stop_words_string = await response.text();
      this.stop_words = stop_words_string.split("\n");
      this.cache_expiration = current_time + 60 * 60;
      this.save_cache();
    }
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
        cache_expiration: this.cache_expiration
      })
    );
  }
})();
