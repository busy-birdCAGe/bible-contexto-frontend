import { Guess } from "./components/Guesses";
import { useState } from "react";
import { gameStateKey, emptyGameState } from "./constants";
import { GameToken } from "./utils";

export interface ColorCounts {
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

export interface GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  colorCounts?: ColorCounts;
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
  colorCounts?: ColorCounts;
  setColorCounts: React.Dispatch<React.SetStateAction<ColorCounts | undefined>>;
  wordFound: boolean;
  setWordFound: React.Dispatch<React.SetStateAction<boolean>>;
  gameIdInUse: string;
  setGameIdInUse: React.Dispatch<React.SetStateAction<string>>;
  gameStates: Record<string, GameState>;
  lastGameId: string;

  constructor(gameToken?: GameToken) {
    let storedState = JSON.parse(localStorage.getItem(gameStateKey) || "{}");
    this.gameStates = storedState.gameStates || {};
    this.lastGameId = storedState.lastGameId || "";
    const defaultGame =
      (gameToken && this.gameStates[gameToken.gameId]) ||
      (this.lastGameId && this.gameStates[this.lastGameId]) ||
      emptyGameState;
    [this.current, this.setCurrent] = useState<Guess | undefined>(
      defaultGame.current
    );
    [this.guesses, this.setGuesses] = useState<Guess[]>(defaultGame.guesses);
    [this.guessCount, this.setGuessCount] = useState<number>(
      defaultGame.guessCount
    );
    [this.colorCounts, this.setColorCounts] = useState<ColorCounts | undefined>(
      defaultGame.colorCounts
    );
    [this.wordFound, this.setWordFound] = useState<boolean>(
      defaultGame.wordFound
    );
    [this.gameIdInUse, this.setGameIdInUse] = useState<string>(this.lastGameId);
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

  updateGameInUse(gameToken: GameToken) {
    if (!this.gameStates[gameToken.gameId]) {
      this.gameStates[gameToken.gameId] = emptyGameState;
      this.gameStates[gameToken.gameId].wordOfTheDay = gameToken.wordId;
      this.save();
    }
    this.setCurrent(this.gameStates[gameToken.gameId].current);
    this.setGuesses(this.gameStates[gameToken.gameId].guesses);
    this.setGuessCount(this.gameStates[gameToken.gameId].guessCount);
    this.setColorCounts(this.gameStates[gameToken.gameId].colorCounts);
    this.setWordFound(this.gameStates[gameToken.gameId].wordFound);
    this.setGameIdInUse(gameToken.gameId);
  }

  updateLastGameId(gameId: string) {
    this.lastGameId = gameId;
    this.save();
  }

  save() {
    localStorage.setItem(
      gameStateKey,
      JSON.stringify({
        gameStates: this.gameStates,
        lastGameId: this.lastGameId,
      })
    );
  }
}
