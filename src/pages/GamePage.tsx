import { useDispatch } from 'react-redux';
import Box from "@mui/material/Box/Box";
import Guesses from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import GameService from "../GameService";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";
import DropDownMenu from "../components/DropDownMenu";
import {
  stemWord,
  getWordIndex,
  normalizeWord,
  getPathToken,
  decodeGameToken,
  getGameName,
  getColorCounts
} from "../utils";
import ErrorMessage from "../components/ErrorMessage";
import { 
  addGuess,
  setColorCounts,
  setWordFound,
  setCurrentGame,
  incrementGuessCount,
} from "../state/reducer";
import { 
  useWordFound,
  useColorCounts,
  useGuesses,
  useWordId,
  useGuessCount,
  useCurrentGameId,
  useCurrentGuess,
  useLanguage
} from "../state/selectors";


const GamePage = () => {
  const dispatch = useDispatch();
  const language = useLanguage();
  const wordFound = useWordFound();
  const colorCounts = useColorCounts();
  const guesses = useGuesses();
  const currentGuess = useCurrentGuess();
  const guessCount = useGuessCount();
  const wordId = useWordId();
  const currentGameId = useCurrentGameId();
  const encodedToken = getPathToken();
  const gameToken = encodedToken ? decodeGameToken(encodedToken) : undefined;
  if (encodedToken && !gameToken) {
    location.href = window.location.origin;
  }
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const gameService = new GameService(language);

  useEffect(() => {
    gameService.todaysGameToken().then((todaysGameToken) => {
      const currentGameToken = gameToken || todaysGameToken;
      dispatch(setCurrentGame(currentGameToken));
    });
  }, []);

  useEffect(() => {
    if (wordFound && !colorCounts) {
      dispatch(setColorCounts({colorCounts: getColorCounts(guesses)}));
    }
  }, [wordFound]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGuess = async () => {
    const trimmedInput = inputValue.trim();
    setErrorMessage("");
    let stemmed_word = stemWord(trimmedInput);
    try {
      if (
        guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)
      ) {
        setErrorMessage(`${normalizeWord(trimmedInput)} was already guessed`);
        setInputValue("");
        return;
      }
      const isStopWord = await gameService.isStopWord(trimmedInput);
      if (isStopWord) {
        setErrorMessage(`${normalizeWord(trimmedInput)} is too common`);
        setInputValue("");
        return;
      }
      const isWord = await gameService.isWord(trimmedInput);
      if (!isWord) {
        setErrorMessage(
          `${normalizeWord(trimmedInput)} is not in the NIV Bible`
        );
        setInputValue("");
        return;
      }
      const wordList = await gameService.getWordList(wordId!);
      let index = getWordIndex(stemmed_word, wordList);
      let score = index + 1;
      let currentGuess = {
        score,
        word: normalizeWord(trimmedInput),
        stemmed_word,
      };
      dispatch(addGuess({guess: currentGuess}));
      if (!wordFound) {
        dispatch(incrementGuessCount());
      }
      if (currentGuess.score == 1 && !wordFound) {
        dispatch(setWordFound());
      }
      setInputValue("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Box
      sx={{
        mt: "20px",
        mx: "17px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <Title title="Bible Contexto" />
      {colorCounts && (
        <CongratsSection
          guessesType1={colorCounts.greenCount}
          guessesType2={colorCounts.yellowCount}
          guessesType3={colorCounts.redCount}
        />
      )}
      <Box sx={{ display: "flex", width: "100%" }}>
        <GameInfoHeader
          count={guessCount}
          gameName={getGameName(currentGameId)}
        />
        <DropDownMenu/>
      </Box>
      <GuessInput
        guess={inputValue}
        handleChange={handleChange}
        handleSubmit={handleGuess}
      />
      <ErrorMessage message={errorMessage} />
      <Guesses
        guesses={currentGuess ? [currentGuess] : []}
        currentGuess={currentGuess}
      />
      <br />
      <Guesses guesses={guesses} currentGuess={currentGuess} />
    </Box>
  );
};

export default GamePage;
