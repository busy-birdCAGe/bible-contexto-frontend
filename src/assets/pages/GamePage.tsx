import Box from "@mui/material/Box/Box";
import SectionHeader from "../../components/SectionHeader";
import Guesses from "../../components/Guesses";
import mockGuessData from "../../mockGuessData.json";
import Title from "../../components/Title";

const GamePage = () => {
  const current = [
    {
      number: 4000,
      word: "well",
    },
  ];

  return (
    <Box sx={{ mt: "45px" }}>
      <Title title="Bible Contexto" />
      <SectionHeader title="current" />
      <Guesses guesses={current} />
      <SectionHeader title="previous" />
      <Guesses guesses={mockGuessData} />
    </Box>
  );
};

export default GamePage;
