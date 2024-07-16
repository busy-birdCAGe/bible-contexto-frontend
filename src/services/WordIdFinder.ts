import { bucketKeys, errorMessages } from "../constants";
import { BACKEND_BUCKET } from "../env";
import { getWordIndex, stemWord } from "../utils";


export default class WordIdFinder {
  language: string;

  constructor(language: string) {
    this.language = language;
  }

  async getWordId(word: string): Promise<string> {
    const wordToIdMapping = await this.backendGet(bucketKeys.wordToIdMapping);
    const wordList = Object.keys(wordToIdMapping);
    const stemmedWord = stemWord(word);
    const index = getWordIndex(stemmedWord, wordList);
    return wordToIdMapping[wordList[index]];
  };

  async backendGet(key: string): Promise<Record<string, string>> {
    let response = await fetch(`${BACKEND_BUCKET}/${this.language}/${key}`);
    if (!response.ok) {
      throw new Error(errorMessages.backend.any);
    }
    return await response.json();
  }
}