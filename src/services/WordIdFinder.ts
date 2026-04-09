import { bucketKeys } from "../constants";
import { getWordIndex, stemWord } from "../utils";
import BackendApi from "../api"


export default class WordIdFinder {
  private language: string;
  private backendApi: BackendApi;

  constructor(language: string) {
    this.language = language;
    this.backendApi = new BackendApi();
  }

  async getWordId(word: string): Promise<string> {
    const wordIdMappingString = await this.backendApi.get(`${this.language}/${bucketKeys.wordToIdMapping}`, true, 3600);
    const wordToIdMapping = JSON.parse(wordIdMappingString);
    const wordList = Object.keys(wordToIdMapping);
    const stemmedWord = stemWord(word);
    const index = getWordIndex(stemmedWord, wordList);
    return wordToIdMapping[wordList[index]];
  };
}