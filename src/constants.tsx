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
export const storageKey = "state";

export const bucketKeys = {
  dailyGames: "daily_games",
  guessWords: "guess_words.txt",
  stopWords: "stop_words.txt",
  wordToIdMapping: "word_to_id_mapping"
};