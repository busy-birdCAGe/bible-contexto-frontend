import { bucketKeys } from "../src/constants";
import { dailyGames } from "./data/dailyGames";
import { guessWords } from "./data/guessWords";
import { stopWords } from "./data/stopWords";
import { wordList } from "./data/wordList";

export async function backendGetMock(key) {
  switch (key) {
    case bucketKeys.dailyGames:
      return dailyGames;
    case bucketKeys.guessWords:
      return guessWords;
    case bucketKeys.stopWords:
      return stopWords;
    case "625fc8f4-5d80-4c18-9f42-93573a34fb6c":
      return wordList;
    default:
      throw Error("No mock data available");
  }
}
