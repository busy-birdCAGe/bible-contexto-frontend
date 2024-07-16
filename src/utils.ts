import { emptyGameState } from "./constants";
import { GameState } from "./GameState";
import { DailyGame } from "./services/GuessService";
import { errorMessages } from "./constants";
import { stem } from "stemr";

export function getQueryParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const queryParams: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
}

export function createNewGame(
  gameId: string,
  wordId: string,
  gameStates: Record<string, GameState>
): Record<string, GameState> {
  gameStates[gameId] = emptyGameState;
  gameStates[gameId].wordOfTheDay = wordId;
  return gameStates;
}

export function updateDailyGames(
  newDailyGames: Array<DailyGame>,
  gameStates: Record<string, GameState>
): Record<string, GameState> {
  for (let dailyGame of newDailyGames) {
    gameStates[dailyGame.gameId] = gameStates[dailyGame.gameId] || {
      ...emptyGameState,
      wordOfTheDay: dailyGame.wordId,
    };
  }
  return gameStates;
}

export function stemWord(word: string): string {
    let lower: string = word.toLowerCase();
    return stem(lower);
  }

export function getWordIndex(word: string, wordList: string[]): number {
  if (wordList.length == 0) {
    throw Error(errorMessages.guessing.noData);
  }
  let index = wordList.indexOf(word);
  if (index == -1 && word.endsWith("s")) {
    index = wordList.indexOf(word.slice(0, -1));
  }
  if (index == -1) {
    throw Error(errorMessages.guessing.unknown);
  }
  return index;
}

export const normalizeWord = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
};

export function generateGameUrl(wordId: string): string {
  return `${window.location.origin}?gameId=${Math.random().toString(36).slice(-10)}&wordId=${wordId}`;
}