import { createSlice } from '@reduxjs/toolkit'
import { languages } from '../constants';

// If breaking changes are made, create a migration in migrations.tsx
export interface RootState {
    version: number;
    currentGameId: string;
    language: string;
    gameStates: Record<string, GameState>;
}

export interface ColorCounts {
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

export interface Guess {
  score: number;
  word: string;
  stemmed_word: string;
}

export interface GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  colorCounts?: ColorCounts;
  wordFound: boolean;
  wordId: string;
  hint?: string;
}

const initialState: RootState = {
    version: 1,
    currentGameId: '',
    language: languages.english,
    gameStates: {}
}

const createInitialGameState = (wordId: string): GameState => ({
    guesses: [],
    guessCount: 0,
    wordFound: false,
    wordId,
})

const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        addGuess(state, action) {
            state.gameStates[state.currentGameId].guesses.push(action.payload.guess)
            state.gameStates[state.currentGameId].guesses.sort((a: Guess, b: Guess) => a.score - b.score);
            state.gameStates[state.currentGameId].current = action.payload.guess
        },
        incrementGuessCount(state) {
            state.gameStates[state.currentGameId].guessCount += 1;
        },
        setColorCounts(state, action) {
            state.gameStates[state.currentGameId].colorCounts = action.payload.colorCounts
        },
        setWordFound(state) {
            state.gameStates[state.currentGameId].wordFound = true;
        },
        setCurrentGame(state, action) {
            const { gameId, wordId } = action.payload;
            state.currentGameId = gameId
            if (!state.gameStates[gameId]) {
                state.gameStates[gameId] = createInitialGameState(wordId);
            }
        },
        setLanguage(state, action) {
            state.language = action.payload.language
        },
        setHint(state, action) {
            state.gameStates[state.currentGameId].hint = action.payload.hint;
        }
    }
})

export const { 
    addGuess,
    incrementGuessCount,
    setColorCounts,
    setWordFound,
    setCurrentGame,
    setLanguage,
    setHint,
} = rootSlice.actions

export default rootSlice.reducer;
