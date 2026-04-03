import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer'
import { storageKey } from '../constants';
import { migrateState } from './migrations';


const loadState = () => {
    migrateState();
    const serialized = localStorage.getItem(storageKey);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState()
})

store.subscribe(() => {
    localStorage.setItem(storageKey, JSON.stringify(store.getState()));
});

export default store
