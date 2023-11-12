import Box from "@mui/material/Box/Box";
import SectionHeader from "../components/SectionHeader";
import Guesses, { Guess } from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import WOTDService from "../services/WordOfTheDayService";
import GuessService from "../services/GuessService";
import { errorMessages } from "../constants";

const GamePage = () => {

  const [inputValue, setInputValue] = useState("");
  const [current, setCurrent] = useState<Guess[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  useEffect(() => {
    WOTDService.get().then((word) => {
      GuessService.init(word);
    });
  }, []);

  let gameStarted = current.length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    try {
      if (guesses.map((guess) => guess.word).includes(inputValue)) {
        throw Error(errorMessages.guessing.duplicate);
      }
      let score = GuessService.guess(inputValue);
      let currentGuess = {
        score: score,
        word: inputValue,
      };
      setCurrent([currentGuess]);
      setGuesses((prevGuesses) => {
        let sortedGuesses = [...prevGuesses, currentGuess].sort(
          (a, b) => a.score - b.score
        );
        return sortedGuesses;
      });
      setInputValue("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Box sx={{ mt: "45px" }}>
      <Title title="Bible Contexto" />
      {/* <Box component="form" onSubmit={handleSubmit}> */}
      <GuessInput
        guess={inputValue}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      {/* </Box> */}
      {gameStarted && <SectionHeader title="current" />}
      <Guesses guesses={current} />
      {gameStarted && <SectionHeader title="previous" />}
      <Guesses guesses={guesses} />
    </Box>
  );
};

export default GamePage;