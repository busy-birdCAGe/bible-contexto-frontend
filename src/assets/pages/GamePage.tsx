import Box from "@mui/material/Box/Box";
import SectionHeader from "../../components/SectionHeader";
import Guesses from "../../components/Guesses";
import mockGuessData from "../../mockGuessData.json";
import Title from "../../components/Title";
import GuessInput from "../../components/GuessInput";
import { useState } from "react";

const GamePage = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Guess was:", inputValue);

    // Add your further submission logic here
    setInputValue("");
  };

  const current = [
    {
      number: 4000,
      word: "well",
    },
  ];

  return (
    <Box sx={{ mt: "45px" }}>
      <Title title="Bible Contexto" />
      {/* <Box component="form" onSubmit={handleSubmit}> */}
        <GuessInput guess={inputValue} handleChange={handleChange}  handleSubmit={handleSubmit}  />
      {/* </Box> */}
      <SectionHeader title="current" />
      <Guesses guesses={current} />
      <SectionHeader title="previous" />
      <Guesses guesses={mockGuessData} />
    </Box>
  );
};

export default GamePage;
