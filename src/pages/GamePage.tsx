import Box from "@mui/material/Box/Box";
import Guesses, { Guess } from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import WOTDService from "../services/WordOfTheDayService";
import GuessService from "../services/GuessService";
import { errorMessages } from "../constants";
import { stem } from "stemr";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";

const GamePage = () => {
  const [inputValue, setInputValue] = useState("");
  const gameId = 1; //hardcoded for now
  const [current, setCurrent] = useState<Guess>();
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [guessCount, setGuessCount] = useState<number>(0);
  const [wordFound, setWordFound] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    WOTDService.get().then((word) => {
      GuessService.init(word);
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGuess = () => {
    setErrorMessage("");
    let stemmed_word = stem(inputValue);
    console.log(stemmed_word);
    try {
      if (guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)) {
        throw Error(errorMessages.guessing.duplicate);
      }
      let score = GuessService.guess(stemmed_word);
      let currentGuess = {
        score,
        word: inputValue,
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
      if (error.message == errorMessages.guessing.duplicate) {
        setInputValue("");
      }
    }
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
