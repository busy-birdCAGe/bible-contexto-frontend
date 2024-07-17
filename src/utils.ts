import { errorMessages } from "./constants";
import { stem } from "stemr";

export interface GameToken {
  gameId: string
  wordId: string
}

export function decodeGameToken(token: string): GameToken | undefined {
  try {
    let rawData = atob(token);
    let [gameId, wordId] = rawData.split(",")
    if (!gameId || !wordId) {
      throw Error()
    }
    return {gameId, wordId}
  } catch {
    return
  }
}

export function encodeGameToken(token: GameToken): string {
  return btoa(`${token.gameId},${token.wordId}`)
}

export function getPathToken(): string | undefined {
  const path = window.location.pathname;
  return path != "/" ? path.split("/")[1] : undefined;
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
  const gameId = Math.random().toString(36).slice(-10);
  const gameToken: GameToken = {gameId, wordId};
  const encodedToken = encodeGameToken(gameToken)
  return `${window.location.origin}/${encodedToken}`;
}

export function getGameName(gameId: string): string {
  return gameId[0] == "s" ? "-" : "#" + gameId;
}