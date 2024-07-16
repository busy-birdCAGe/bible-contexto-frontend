import Box from "@mui/material/Box/Box";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Guesses from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import GuessService from "../services/GuessService";
import { languages } from "../constants";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";
import HelpSection from "../components/HelpSection";
import {
  getQueryParams,
  createNewGame,
  updateDailyGames
} from "../utils";
import { State } from "../GameState";

const guessService = new GuessService();

const GamePage = () => {
  const language = languages.english;
  const queryParams = getQueryParams();
  const gameId = queryParams.gameId;
  const wordId = queryParams.wordId;
  let state = new State(gameId);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [helpVisible, setHelpVisible] = useState<boolean>(false);

  useEffect(() => {
    guessService.init(language).then(() => {
      state.gameStates = updateDailyGames(
        guessService.dailyGames,
        state.gameStates
      );
      state.dailyGames = guessService.dailyGames.map((g) => g.gameId);
      if (gameId && !state.gameStates[gameId]) {
        if (wordId) {
          state.gameStates = createNewGame(gameId, wordId, state.gameStates);
        } else {
          location.href = window.location.origin;
        }
      }
      const currentGameId = gameId || state.dailyGames.slice(-1)[0];
      state.setGameIdInUse(currentGameId);
      state.save();
      guessService.get_word_list(state.gameStates[currentGameId].wordOfTheDay);
    });
  }, []);

  useEffect(() => {
    if (state.wordFound && state.guessCount == state.guesses.length) {
      let greenCount = state.guesses.filter((obj) => obj.score < 301).length;
      let yellowCount = state.guesses.filter(
        (obj) => obj.score > 300 && obj.score < 1001
      ).length;
      let redCount = state.guesses.filter((obj) => obj.score > 1000).length;
      state.updateColorCounts({ greenCount, yellowCount, redCount });
    }
  }, [state.wordFound]);

  const normalize_word = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGuess = () => {
    setErrorMessage("");
    let stemmed_word = guessService.stem_word(inputValue);
    try {
      if (state.guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)) {
        setErrorMessage(`${normalize_word(inputValue)} was already guessed`);
        setInputValue("");
        return;
      }
      if (guessService.is_stop_word(inputValue)) {
        setErrorMessage(`${normalize_word(inputValue)} is too common`);
        setInputValue("");
        return;
      }
      if (!guessService.is_word(inputValue)) {
        setErrorMessage(
          `${normalize_word(inputValue)} is not in the NIV bible`
        );
        setInputValue("");
        return;
      }
      let score = guessService.guess(stemmed_word);
      let currentGuess = {
        score,
        word: normalize_word(inputValue),
        stemmed_word,
      };
      state.updateCurrent(currentGuess);
      state.addNewGuess(currentGuess);
      if (!state.wordFound) {
        state.incrementGuessCount();
      }
      if (currentGuess.score == 1) {
        state.markWordFound();
      }
      setInputValue("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const showHelp = () => {
    setHelpVisible(!helpVisible);
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
      <HelpSection visible={helpVisible} setVisibility={setHelpVisible} />

      {state.wordFound && (
        <CongratsSection
          guessesType1={state.colorCounts.greenCount}
          guessesType2={state.colorCounts.yellowCount}
          guessesType3={state.colorCounts.redCount}
        />
      )}
      <Box sx={{ display: "flex", width: "100%" }}>
        <GameInfoHeader title={"Guesses:"} count={state.guessCount} />
        <Box sx={{ display: "flex", marginLeft: "auto" }}>
          <IoMdInformationCircleOutline
            onClick={showHelp}
            style={{ color: "white", fontSize: "1.5em", margin: "auto 0.5rem" }}
          />
        </Box>
      </Box>
      <GuessInput
        guess={inputValue}
        handleChange={handleChange}
        handleSubmit={handleGuess}
      />
      {/* ToDo make space for error message so words dont get moved down*/}
      {/* {errorMessage ? (
        <GameInfoHeader title={errorMessage} />
      ) : (
        <Guesses guesses={current ? [current] : []} currentGuess={current} />
      )} */}
      <GameInfoHeader title={errorMessage} />
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
