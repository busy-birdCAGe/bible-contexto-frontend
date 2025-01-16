import Box from "@mui/material/Box/Box";
import Guesses from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import gameService from "../services/GameService";
import { languages } from "../constants";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";
import DropDownMenu from "../components/DropDownMenu";
import {
  stemWord,
  getWordIndex,
  normalizeWord,
  getPathToken,
  decodeGameToken,
  getGameName,
  getColorCounts
} from "../utils";
import { State } from "../GameState";
import ErrorMessage from "../components/ErrorMessage";

const GamePage = () => {
  const language = languages.english;
  const encodedToken = getPathToken();
  const gameToken = encodedToken ? decodeGameToken(encodedToken) : undefined;
  if (encodedToken && !gameToken) {
    location.href = window.location.origin;
  }
  const state = new State(gameToken);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    gameService.init(language).then(() => {
      let todaysDailyGame = gameService.todaysGameToken();
      state.updateLastGameId(todaysDailyGame.gameId);
      const currentGame = gameToken || todaysDailyGame;
      gameService
        .getWordList(currentGame.wordId)
        .then(() => {
          state.updateGameInUse(currentGame);
        })
        .catch(() => {
          location.href = window.location.origin;
        });
    });
  }, []);

  useEffect(() => {
    if (state.wordFound && !state.colorCounts) {
      let colorCounts = getColorCounts(state.guesses);
      state.updateColorCounts(colorCounts);
    }
  }, [state.wordFound]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGuess = () => {
    const trimmedInput = inputValue.trim();
    setErrorMessage("");
    let stemmed_word = stemWord(trimmedInput);
    try {
      if (
        state.guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)
      ) {
        setErrorMessage(`${normalizeWord(trimmedInput)} was already guessed`);
        setInputValue("");
        return;
      }
      if (gameService.isStopWord(trimmedInput)) {
        setErrorMessage(`${normalizeWord(trimmedInput)} is too common`);
        setInputValue("");
        return;
      }
      if (!gameService.isWord(trimmedInput)) {
        setErrorMessage(
          `${normalizeWord(trimmedInput)} is not in the NIV bible`
        );
        setInputValue("");
        return;
      }
      let index = getWordIndex(stemmed_word, gameService.wordList || []);
      let score = index + 1;
      let currentGuess = {
        score,
        word: normalizeWord(trimmedInput),
        stemmed_word,
      };
      state.updateCurrent(currentGuess);
      state.addNewGuess(currentGuess);
      if (!state.wordFound) {
        state.incrementGuessCount();
      }
      if (currentGuess.score == 1 && !state.wordFound) {
        state.markWordFound();
      }
      setInputValue("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Box
      sx={{
        mt: "20px",
        mx: "17px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <Title title="Bible Contexto" />
      {state.colorCounts && (
        <CongratsSection
          guessesType1={state.colorCounts.greenCount}
          guessesType2={state.colorCounts.yellowCount}
          guessesType3={state.colorCounts.redCount}
        />
      )}
      <Box sx={{ display: "flex", width: "100%" }}>
        <GameInfoHeader
          count={state.guessCount}
          gameName={getGameName(state.gameIdInUse)}
        />
        <DropDownMenu></DropDownMenu>
      </Box>
      <GuessInput
        guess={inputValue}
        handleChange={handleChange}
        handleSubmit={handleGuess}
      />
      <ErrorMessage message={errorMessage} />
      <Guesses
        guesses={state.current ? [state.current] : []}
        currentGuess={state.current}
      />
      <br></br>
      <Guesses guesses={state.guesses} currentGuess={state.current} />
    </Box>
  );
};

export default GamePage;
