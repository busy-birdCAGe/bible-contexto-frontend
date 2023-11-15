import Box from "@mui/material/Box/Box";
import SectionHeader from "../components/SectionHeader";
import Guesses, { Guess } from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import WOTDService from "../services/WordOfTheDayService";
import GuessService from "../services/GuessService";
import { errorMessages } from "../constants";
import porterStemmer from "@stdlib/nlp-porter-stemmer";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection, { CongratsSectionProps } from "../components/CongratsSection";


const GamePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [gameInfo, setGameInfo] = useState<CongratsSectionProps>({gameId: undefined, numberOfAttempts: undefined});
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
    let stemmed_word = porterStemmer(inputValue);
    try {
      if (guesses.map((guess) => guess.word).includes(stemmed_word)) {
        throw Error(errorMessages.guessing.duplicate);
      }
      let score = GuessService.guess(stemmed_word);
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
      if (currentGuess.score == 1) {
        setGameInfo({gameId: 1, numberOfAttempts: guesses.length+1});
      }
      setInputValue("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        mt: "45px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title title="Contexto" />

      {!!gameInfo.numberOfAttempts && (
        <CongratsSection gameId={gameInfo.gameId} numberOfAttempts={gameInfo.numberOfAttempts} />
      )}
      {/* <Box component="form" onSubmit={handleSubmit}> */}
      <Box sx={{ display: "flex", width: "100%" }}>
        <GameInfoHeader title={"Game:"} count={1} />
        <GameInfoHeader title={"Guesses:"} count={guesses.length} />
      </Box>
      <GuessInput
        guess={inputValue}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      {/* </Box> */}
      {gameStarted && <SectionHeader title="Current" />}
      <Guesses guesses={current} />
      {gameStarted && <SectionHeader title="Previous" />}
      <Guesses guesses={guesses} />
    </Box>
  );
};

export default GamePage;
