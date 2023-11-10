import { Box } from "@mui/material";
import WordCard from "./WordCard";

export interface Guess {
  number: number;
  word: string;
}
interface GuessesProps {
  guesses: Guess[];
}

const Guesses = ({ guesses }: GuessesProps) => {
  return (
    <Box>
      {guesses.map((guess: Guess) => (
        <WordCard number={guess.number} word={guess.word} />
      ))}
    </Box>
  );
};

export default Guesses;
