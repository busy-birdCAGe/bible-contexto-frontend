import Box from "@mui/material/Box/Box";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Guesses, { Guess } from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import GuessService from "../services/GuessService";
import { gameStateKey, languages, emptyGameState } from "../constants";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";
import HelpSection from "../components/HelpSection";
import { getQueryParams, createNewGame, updateDailyGames } from "../utils";

export interface colorCounts {
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

export interface GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  colorCounts: colorCounts;
  wordFound: boolean;
  wordOfTheDay: string;
}

class State {
  gameStates: Record<string, GameState>;
  dailyGames: Array<string>;

  constructor() {
    let state = JSON.parse(localStorage.getItem(gameStateKey) || "{}");
    this.gameStates = state.gameStates || {};
    this.dailyGames = state.dailyGames || [];
  }

  save() {
    localStorage.setItem(
      gameStateKey,
      JSON.stringify({
        gameStates: this.gameStates,
        dailyGames: this.dailyGames,
      })
    );
  }
}

const guessService = new GuessService();

const GamePage = () => {
  const language = languages.english;
  let state = new State();
  const queryParams = getQueryParams();
  const gameId = queryParams.gameId;
  const wordId = queryParams.wordId;

  const latestDailyGame = state.gameStates[state.dailyGames.slice(-1)[0]];

  let currentGame =
    (!gameId && latestDailyGame) || state.gameStates[gameId] || emptyGameState;

  let gameIdInUse: string;

  const [inputValue, setInputValue] = useState("");
  const [current, setCurrent] = useState<Guess | undefined>(
    currentGame.current
  );
  const [guesses, setGuesses] = useState<Guess[]>(currentGame.guesses);
  const [guessCount, setGuessCount] = useState<number>(currentGame.guessCount);
  const [colorCounts, setColorCounts] = useState<colorCounts>(
    currentGame.colorCounts
  );
  const [wordFound, setWordFound] = useState<boolean>(currentGame.wordFound);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [helpVisible, setHelpVisible] = useState<boolean>(false);

  useEffect(() => {
    guessService.init(language).then(() => {
      state.gameStates = updateDailyGames(
        guessService.daily_games,
        state.gameStates
      );
      state.dailyGames = guessService.daily_games.map((g) => g.game_id);
      if (gameId && !state.gameStates[gameId]) {
        if (wordId) {
          state.gameStates = createNewGame(gameId, wordId, state.gameStates);
        }
        else {
          window.location.search = "";
          location.reload();
        }
      }
      gameIdInUse = gameId || state.dailyGames.slice(-1)[0];
      state.gameStates[gameIdInUse].current = current;
      state.gameStates[gameIdInUse].guesses = guesses;
      state.gameStates[gameIdInUse].guessCount = guessCount;
      state.gameStates[gameIdInUse].colorCounts = colorCounts;
      state.gameStates[gameIdInUse].wordFound = wordFound;
      state.save();
      guessService.get_word_list(state.gameStates[gameIdInUse].wordOfTheDay);
    });
  }, []);

  useEffect(() => {
    if (wordFound && guessCount == guesses.length) {
      let greenCount = guesses.filter((obj) => obj.score < 301).length;
      let yellowCount = guesses.filter(
        (obj) => obj.score > 300 && obj.score < 1001
      ).length;
      let redCount = guesses.filter((obj) => obj.score > 1000).length;
      setColorCounts({ greenCount, yellowCount, redCount });
      state.save();
    }
  }, [wordFound]);

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
      if (guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)) {
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
      setCurrent(currentGuess);
      setGuesses((prevGuesses) => {
        let sortedGuesses = [...prevGuesses, currentGuess].sort(
          (a, b) => a.score - b.score
        );
        return sortedGuesses;
      });
      if (!wordFound) {
        setGuessCount(guessCount + 1);
      }
      if (currentGuess.score == 1) {
        setWordFound(true);
      }
      setInputValue("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    state.save();
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

      {wordFound && (
        <CongratsSection
          guessesType1={colorCounts.greenCount}
          guessesType2={colorCounts.yellowCount}
          guessesType3={colorCounts.redCount}
        />
      )}
      <Box sx={{ display: "flex", width: "100%" }}>
        <GameInfoHeader title={"Guesses:"} count={guessCount} />
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
      <Guesses guesses={current ? [current] : []} currentGuess={current} />
      <br></br>
      <Guesses guesses={guesses} currentGuess={current} />
    </Box>
  );
};

export default GamePage;
