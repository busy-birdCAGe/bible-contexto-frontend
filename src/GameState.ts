import { Guess } from "./components/Guesses";
import { useState } from "react";
import { gameStateKey, emptyGameState } from "./constants";

export interface ColorCounts {
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

export interface GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  colorCounts: ColorCounts;
  wordFound: boolean;
  wordOfTheDay: string;
}

export class State {
  current?: Guess;
  setCurrent: React.Dispatch<React.SetStateAction<Guess | undefined>>;
  guesses: Guess[];
  setGuesses: React.Dispatch<React.SetStateAction<Guess[]>>;
  guessCount: number;
  setGuessCount: React.Dispatch<React.SetStateAction<number>>;
  colorCounts: ColorCounts;
  setColorCounts: React.Dispatch<React.SetStateAction<ColorCounts>>;
  wordFound: boolean;
  setWordFound: React.Dispatch<React.SetStateAction<boolean>>;
  gameIdInUse: string;
  setGameIdInUse: React.Dispatch<React.SetStateAction<string>>;
  gameStates: Record<string, GameState>;
  dailyGames: Array<string>;

  constructor(gameId: string) {
    let storedState = JSON.parse(localStorage.getItem(gameStateKey) || "{}");
    this.gameStates = storedState.gameStates || {};
    this.dailyGames = storedState.dailyGames || [];
    const latestDailyGame = this.gameStates[this.dailyGames.slice(-1)[0]];
    const defaultGame =
      (!gameId && latestDailyGame) || this.gameStates[gameId] || emptyGameState;
    [this.current, this.setCurrent] = useState<Guess | undefined>(
      defaultGame.current
    );
    [this.guesses, this.setGuesses] = useState<Guess[]>(defaultGame.guesses);
    [this.guessCount, this.setGuessCount] = useState<number>(
      defaultGame.guessCount
    );
    [this.colorCounts, this.setColorCounts] = useState<ColorCounts>(
      defaultGame.colorCounts
    );
    [this.wordFound, this.setWordFound] = useState<boolean>(
      defaultGame.wordFound
    );
    [this.gameIdInUse, this.setGameIdInUse] = useState<string>(
      ""
    );
  }

  updateCurrent(current: Guess) {
    this.setCurrent(current);
    this.gameStates[this.gameIdInUse].current = current;
    this.save();
  }

  addNewGuess(guess: Guess) {
    let newGuesses = [...this.guesses, guess].sort((a, b) => a.score - b.score);
    this.setGuesses(newGuesses);
    this.gameStates[this.gameIdInUse].guesses = newGuesses;
    this.save();
  }

  incrementGuessCount() {
    this.setGuessCount(this.guessCount + 1);
    this.gameStates[this.gameIdInUse].guessCount += 1;
    this.save();
  }

  updateColorCounts(colorCounts: ColorCounts) {
    this.setColorCounts(colorCounts);
    this.gameStates[this.gameIdInUse].colorCounts = colorCounts;
    this.save();
  }

  markWordFound() {
    this.setWordFound(true);
    this.gameStates[this.gameIdInUse].wordFound = true;
    this.save();
  }

  save() {
    localStorage.setItem(
      gameStateKey,
      JSON.stringify({
        gameStates: this.gameStates,
        dailyGames: this.dailyGames,
      })
    );
  }
}
