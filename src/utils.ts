import { emptyGameState } from "./constants";
import { GameState } from "./GameState";
import { DailyGame } from "./services/GuessService";

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
    gameStates[dailyGame.game_id] = gameStates[dailyGame.game_id] || {
      ...emptyGameState,
      wordOfTheDay: dailyGame.word_id,
    };
  }
  return gameStates;
}
