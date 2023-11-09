import Box from "@mui/material/Box/Box";
import SectionHeader from "../../components/SectionHeader";
import Guesses from "../../components/Guesses";
import mockGuessData from "../../mockGuessData.json";


const GamePage = () => {
  const current = [
    {
      number: 4000,
      word: "well"
    },
  ];

  return (
    <Box>
      <SectionHeader title="current" />
      <Guesses guesses={current} />
      <SectionHeader title="previous" />
      <Guesses guesses={mockGuessData}/>
    </Box>
  );
};

export default GamePage;
