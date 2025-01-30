import { GameState } from "./GameState"

export const emptyGameState: GameState = {
  current: undefined,
  guesses: [],
  guessCount: 0,
  colorCounts: undefined,
  wordFound: false,
  wordOfTheDay: "",
};

export const errorMessages = {
    guessing: {
        unknown: "Unknown word",
        duplicate: "Word already used",
        noData: "Data not loaded yet"
    },
    backend: {
        any: "Internal server error"
    }
}

export const languages = {
    english: "english"
}

export const gameServiceDataKey = "word_data";
export const gameStateKey = "state";

export const bucketKeys = {
  dailyGames: "daily_games",
  guessWords: "guess_words.txt",
  stopWords: "stop_words.txt",
  wordToIdMapping: "word_to_id_mapping"
};