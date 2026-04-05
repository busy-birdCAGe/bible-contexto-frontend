import { storageKey } from "../constants";

// If the state structure changes, this should correct it in everyone's local storage.
// It should first detect a known old state (via state versions),
// then apply all necessary transformations to bring it up to the current version.
// If it detects an unknown state, it should reset to the initial state.

export function migrateState() {
    const stringState = localStorage.getItem(storageKey);
    if (!stringState) return;
    let state = JSON.parse(stringState);

    if (!state.version) { // This is version 0
        Object.keys(state.gameStates).forEach(gameId => {
            state.gameStates[gameId].wordId = state.gameStates[gameId].wordOfTheDay
            state.gameStates[gameId].wordOfTheDay = undefined;
        });

        state.currentGameId = state.lastGameId; // rename lastGameId to currentGameId
        state.lastGameId = undefined; // Remove this
        state.language = 'english'; // add default language
        state.version = 1;
    }

    localStorage.setItem(storageKey, JSON.stringify(state));
}
