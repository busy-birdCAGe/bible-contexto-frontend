import { BACKEND_BUCKET } from "../env";

export default new class GuessService {

  word_list?: Array<string>;

  async init(word: string): Promise<void> {
    const response = await fetch(`${BACKEND_BUCKET}/${word}`);
    if (!response.ok) {
      throw new Error(`Error: S3 get returned ${response.status} status`);
    }
    let word_list_string = await response.text();
    this.word_list = word_list_string.split(",");
  }

  guess(word: string): number {
    if (!this.word_list) {
        throw Error("Data not loaded yet")
    } 
    let index = this.word_list.indexOf(word);
    if (index == -1) {
        throw Error("Unknown or not helpful")
    }
    return index + 1;
  }

}
