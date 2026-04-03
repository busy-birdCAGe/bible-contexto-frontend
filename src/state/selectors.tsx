import { createSelector } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { GameState, RootState } from './reducer';

/**
 * ------------------------
 * Typed base hook
 * ------------------------
 */

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * ------------------------
 * Base selectors
 * ------------------------
 */

const selectCurrentGameId = (state: RootState): string =>
  state.currentGameId;

const selectGameStates = (
  state: RootState
): Record<string, GameState> => state.gameStates;

const selectLanguage = (state: RootState): string => state.language;

/**
 * ------------------------
 * Core selector
 * ------------------------
 */

const selectCurrentGame = createSelector(
  [selectGameStates, selectCurrentGameId],
  (gameStates, gameId): GameState | undefined => gameStates[gameId]
);

/**
 * ------------------------
 * Field selectors
 * ------------------------
 */

const selectGuesses = createSelector(
  [selectCurrentGame],
  (game) => game?.guesses ?? []
);

const selectCurrentGuess = createSelector(
  [selectCurrentGame],
  (game) => game?.current
);

const selectGuessCount = createSelector(
  [selectCurrentGame],
  (game) => game?.guessCount ?? 0
);

const selectColorCounts = createSelector(
  [selectCurrentGame],
  (game) => game?.colorCounts
);

const selectWordFound = createSelector(
  [selectCurrentGame],
  (game) => game?.wordFound ?? false
);

const selectWordId = createSelector(
  [selectCurrentGame],
  (game) => game?.wordId
);

/**
 * ------------------------
 * Pre-built hooks
 * ------------------------
 */

export const useGameStates = () =>
  useAppSelector(selectGameStates);

export const useCurrentGameId = () =>
  useAppSelector(selectCurrentGameId);

export const useCurrentGame = () =>
  useAppSelector(selectCurrentGame);

export const useGuesses = () =>
  useAppSelector(selectGuesses);

export const useCurrentGuess = () =>
  useAppSelector(selectCurrentGuess);

export const useGuessCount = () =>
  useAppSelector(selectGuessCount);

export const useColorCounts = () =>
  useAppSelector(selectColorCounts);

export const useWordFound = () =>
  useAppSelector(selectWordFound);

export const useWordId = () =>
  useAppSelector(selectWordId);

export const useLanguage = () =>
  useAppSelector(selectLanguage);
