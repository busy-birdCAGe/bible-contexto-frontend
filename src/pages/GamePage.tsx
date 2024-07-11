import Box from "@mui/material/Box/Box";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Guesses, { Guess } from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import GuessService from "../services/GuessService";
import { gameStateKey, languages } from "../constants";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";
import HelpSection from "../components/HelpSection";

export interface colorCounts {
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

interface GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  colorCounts: colorCounts;
  wordFound: boolean;
  wordOfTheDay: string;
}

class State {
  currentGame: GameState;
  pastGames: Array<GameState>;
  sharedGames: Array<GameState>;

  constructor() {
    let state = JSON.parse(localStorage.getItem(gameStateKey) || "{}");
    this.currentGame = {
      current: state?.currentGame?.current,
      guesses: state?.currentGame?.guesses || [],
      guessCount: state?.currentGame?.guessCount || 0,
      colorCounts: { ...state?.currentGame?.colorCounts } || {
        greenCount: 0,
        yellowCount: 0,
        redCount: 0,
      },
      wordFound: state?.currentGame?.wordFound || false,
      wordOfTheDay: state?.currentGame?.wordOfTheDay || "",
    };
    this.pastGames = state.pastGames || [];
    this.sharedGames = state.sharedGames || [];
  }

  save() {
    localStorage.setItem(
      gameStateKey,
      JSON.stringify({
        currentGame: this.currentGame,
        pastGames: this.pastGames,
        sharedGames: this.sharedGames
      })
    );
  }
}

const guessService = new GuessService();

const GamePage = () => {
  const language = languages.english;
  let state = new State();
  const [inputValue, setInputValue] = useState("");
  const [current, setCurrent] = useState<Guess | undefined>(state.currentGame.current);
  const [guesses, setGuesses] = useState<Guess[]>(state.currentGame.guesses);
  const [guessCount, setGuessCount] = useState<number>(
    state.currentGame.guessCount
  );
  const [colorCounts, setColorCounts] = useState<colorCounts>(
    state.currentGame.colorCounts
  );
  const [wordFound, setWordFound] = useState<boolean>(
    state.currentGame.wordFound
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  state.currentGame.current = current;
  state.currentGame.guesses = guesses;
  state.currentGame.guessCount = guessCount;
  state.currentGame.colorCounts = colorCounts;
  state.currentGame.wordFound = wordFound;
  state.save();

  useEffect(() => {
    guessService.init(language).then(() => {
      if (state.currentGame.wordOfTheDay != guessService.word) {
        if (state.currentGame.wordOfTheDay) {
          state.pastGames.push(JSON.parse(JSON.stringify(state.currentGame)));
        }
        setCurrent(undefined);
        setGuesses([]);
        setGuessCount(0);
        setColorCounts({ greenCount: 0, yellowCount: 0, redCount: 0 });
        setWordFound(false);
        state.currentGame.wordOfTheDay = guessService.word!;
        state.save();
      }
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
        setErrorMessage(
          `${normalize_word(inputValue)} is too common`
        );
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
