import Box from "@mui/material/Box/Box";
import SectionHeader from "../../components/SectionHeader";
import Guesses, { Guess } from "../../components/Guesses";
import Title from "../../components/Title";
import GuessInput from "../../components/GuessInput";
import { useState } from "react";

const GamePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [current, setCurrent] = useState<Guess[]>([]);

  const [guesses, setGuesses] = useState<Guess[]>([]);
  let gameStarted = current.length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Guess was:", inputValue);
    let currentGuess = {
      number: Math.floor(Math.random() * 3000),
      word: inputValue,
    };

    setCurrent([currentGuess]);

    setGuesses((prevGuesses) => {
      let sortedGuesses = [...prevGuesses, currentGuess].sort(
        (a, b) => a.number - b.number
      );

      return sortedGuesses;
    });
    // console.log(guesses, currentGuess);

    setInputValue("");
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
