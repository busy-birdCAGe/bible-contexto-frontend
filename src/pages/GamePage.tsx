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

class GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  colorCounts: colorCounts;
  wordFound: boolean;
  wordOfTheDay: string;

  constructor() {
    let state = JSON.parse(localStorage.getItem(gameStateKey) || "{}");
    this.current = state.current;
    this.guesses = state.guesses || [];
    this.guessCount = state.guessCount || 0;
    this.colorCounts = { ...state.colorCounts } || {
      greenCount: 0,
      yellowCount: 0,
      redCount: 0,
    };
    this.wordFound = state.wordFound || false;
    this.wordOfTheDay = state.wordOfTheDay || "";
  }

  save() {
    localStorage.setItem(
      gameStateKey,
      JSON.stringify({
        current: this.current,
        guesses: this.guesses,
        guessCount: this.guessCount,
        colorCounts: this.colorCounts,
        wordFound: this.wordFound,
        wordOfTheDay: this.wordOfTheDay,
      })
    );
  }
}

const guessService = new GuessService();

const GamePage = () => {
  const language = languages.english;
  let gameState = new GameState();
  const [inputValue, setInputValue] = useState("");
  const [current, setCurrent] = useState<Guess | undefined>(gameState.current);
  const [guesses, setGuesses] = useState<Guess[]>(gameState.guesses);
  const [guessCount, setGuessCount] = useState<number>(gameState.guessCount);
  const [colorCounts, setColorCounts] = useState<colorCounts>(
    gameState.colorCounts
  );
  const [wordFound, setWordFound] = useState<boolean>(gameState.wordFound);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  gameState.current = current;
  gameState.guesses = guesses;
  gameState.guessCount = guessCount;
  gameState.colorCounts = colorCounts;
  gameState.wordFound = wordFound;
  gameState.save();

  useEffect(() => {
    guessService.init(language).then(() => {
      if (gameState.wordOfTheDay != guessService.word) {
        setCurrent(undefined);
        setGuesses([]);
        setGuessCount(0);
        setColorCounts({ greenCount: 0, yellowCount: 0, redCount: 0 });
        setWordFound(false);
        gameState.wordOfTheDay = guessService.word!;
        gameState.save();
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
      gameState.save();
    }
  }, [wordFound]);

  const normalize_word = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };


  const handleGuess = () => {
    const trimmedInput = inputValue.trim();
    setErrorMessage("");
    let stemmed_word = guessService.stem_word(trimmedInput);
    try {
      if (guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)) {
        setErrorMessage(`${normalize_word(trimmedInput)} was already guessed`);
        setInputValue("");
        return;
      }
      if (guessService.is_stop_word(trimmedInput)) {
        setErrorMessage(
          `${normalize_word(trimmedInput)} is too common`
        );
        setInputValue("");
        return;
      }
      if (!guessService.is_word(trimmedInput)) {
        setErrorMessage(
          `${normalize_word(trimmedInput)} is not in the NIV bible`
        );
        setInputValue("");
        return;
      }
      let score = guessService.guess(stemmed_word);
      let currentGuess = {
        score,
        word: normalize_word(trimmedInput),
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
    gameState.save();
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
          guessesType1={gameState.colorCounts.greenCount}
          guessesType2={gameState.colorCounts.yellowCount}
          guessesType3={gameState.colorCounts.redCount}
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
