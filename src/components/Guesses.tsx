import { Box } from "@mui/material"
import WordCard from "./WordCard";
import mockGuessData from "../mockGuessData.json"

interface GuessesProps {
    guesses?: Array<{number: number, word:string}>;
}

const Guesses = (_guesses: GuessesProps) => (
    <Box>
        {mockGuessData.map((guess) => (
             <WordCard number={guess.number} word={guess.word}/>
        ))}
    </Box>
)

export default Guesses;