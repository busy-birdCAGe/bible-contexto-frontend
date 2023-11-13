import { Box } from "@mui/material";
import WordCard from "./WordCard";

export interface Guess {
  score: number;
  word: string;
}
interface GuessesProps {
  guesses: Guess[];
}

const Guesses = ({ guesses }: GuessesProps) => {
  return (
    <Box>
      {guesses.map((guess: Guess) => (
        <WordCard score={guess.score} word={guess.word} />
      ))}
    </Box>
  );
};

export default Guesses;
