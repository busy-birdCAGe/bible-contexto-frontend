import { createSlice } from '@reduxjs/toolkit'
import { Guess } from '../components/Guesses'
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

export interface GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  colorCounts?: ColorCounts;
  wordFound: boolean;
  wordId: string;
}

const initialState: RootState = {
    version: 1,
    currentGameId: '',
    language: languages.english,
    gameStates: {}
}

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
                state.gameStates[gameId] = {
                    guesses: [],
                    guessCount: 0,
                    wordFound: false,
                    wordId,
                };
            }
        },
        setLanguage(state, action) {
            state.language = action.payload.language
        }
    }
})

export const { 
    addGuess,
    incrementGuessCount,
    setColorCounts,
    setWordFound,
    setCurrentGame,
    setLanguage
} = rootSlice.actions

export default rootSlice.reducer;
