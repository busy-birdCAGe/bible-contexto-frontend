import { Box } from "@mui/material";
import WordCard from "./WordCard";

export interface Guess {
  score: number;
  word: string;
  stemmed_word: string;
}
interface GuessesProps {
  currentGuess?: Guess; 
  guesses: Guess[];
}

const Guesses = ({ guesses, currentGuess }: GuessesProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent:"center", width: "100%"}}>
      {guesses.map((guess: Guess) => (
        <WordCard
          score={guess.score}
          word={guess.word}
          highlighted={currentGuess? guess.word == currentGuess.word : false}
        />
      ))}
    </Box>
  );
};

export default Guesses;
