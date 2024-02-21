import { BACKEND_BUCKET } from "../env";
import { errorMessages } from "../constants";
import { stem } from "stemr";

export default new class GuessService {

  word_list?: Array<string>;

  async init(word: string): Promise<void> {
    const response = await fetch(`${BACKEND_BUCKET}/english/${word}`);
    if (!response.ok) {
      throw new Error(errorMessages.backend.any);
    }
    let word_list_string = await response.text();
    this.word_list = word_list_string.split(",");
  }

  stem_word(word: string): string {
    let lower: string = word.toLowerCase();
    return stem(lower);
  }

  guess(word: string): number {
    if (!this.word_list) {
        throw Error(errorMessages.guessing.noData)
    }
    let index = this.word_list.indexOf(word);
    if (index == -1 && word.endsWith("s")) {
      index = this.word_list.indexOf(word.slice(0, -1));
    }
    if (index == -1) {
        throw Error(errorMessages.guessing.unknown)
    }
    return index + 1;
  }

}
