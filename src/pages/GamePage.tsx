import Box from "@mui/material/Box/Box";
import Guesses, { Guess } from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import WOTDService from "../services/WordOfTheDayService";
import GuessService from "../services/GuessService";
import { errorMessages } from "../constants";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";

class GameState {
  current: Guess
  guesses: Guess[]
  guessCount: number
  wordFound: boolean

  constructor() {
    let state = JSON.parse(localStorage.getItem("state") || "{}");
    this.current = state.current;
    this.guesses = state.guesses || [];
    this.guessCount = state.guessCount || 0;
    this.wordFound = state.wordFound || false;
  }

  save() {
      localStorage.setItem("state",
        JSON.stringify({
          current: this.current,
          guesses: this.guesses,
          guessCount: this.guessCount,
          wordFound: this.wordFound,
        })
      );
  }
}

const GamePage = () => {
  let gameState = new GameState();
  const [inputValue, setInputValue] = useState("");
  const gameId = 1; //hardcoded for now
  const [current, setCurrent] = useState<Guess>(gameState.current);
  const [guesses, setGuesses] = useState<Guess[]>(gameState.guesses);
  const [guessCount, setGuessCount] = useState<number>(gameState.guessCount);
  const [wordFound, setWordFound] = useState<boolean>(gameState.wordFound);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    WOTDService.get().then((word) => {
      GuessService.init(word);
    });
  }, []);

  const normalize_word = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGuess = () => {
    setErrorMessage("");
    let stemmed_word = GuessService.stem_word(inputValue);
    try {
      if (guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)) {
        throw Error(errorMessages.guessing.duplicate);
      }
      let score = GuessService.guess(stemmed_word);
      let currentGuess = {
        score,
        word: normalize_word(inputValue),
        stemmed_word,
      };

      setCurrent(currentGuess);
      gameState.current = current;
      setGuesses((prevGuesses) => {
        let sortedGuesses = [...prevGuesses, currentGuess].sort(
          (a, b) => a.score - b.score
        );
        return sortedGuesses;
      });
      gameState.guesses = guesses;
      if (!wordFound) {
        setGuessCount(guessCount + 1);
        gameState.guessCount = guessCount;
      }
      if (currentGuess.score == 1) {
        setWordFound(true);
        gameState.wordFound = wordFound;
      }
      setInputValue("");
    } catch (error: any) {
      setErrorMessage(error.message);
      if (error.message == errorMessages.guessing.duplicate) {
        setInputValue("");
      }
    }
    gameState.save();
  };

  return (
    <Box
      sx={{
        mt: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title title="Bible Contexto" />

      {wordFound && (
        <CongratsSection gameId={gameId} numberOfAttempts={guessCount} />
      )}
      {/* <Box component="form" onSubmit={handleSubmit}> */}
      <Box sx={{ display: "flex", width: "100%" }}>
        <GameInfoHeader title={"Game:"} count={1} />
        <GameInfoHeader title={"Guesses:"} count={guessCount} />
      </Box>
      <GuessInput
        guess={inputValue}
        handleChange={handleChange}
        handleSubmit={handleGuess}
      />
      <GameInfoHeader title={errorMessage} />
      {/* </Box> */}
      <Guesses guesses={current ? [current] : []} currentGuess={current} />
      <br></br>
      <Guesses guesses={guesses} currentGuess={current} />
    </Box>
  );
};

export default GamePage;
