import Box from "@mui/material/Box/Box";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Guesses, { Guess } from "../components/Guesses";
import Title from "../components/Title";
import GuessInput from "../components/GuessInput";
import { useState, useEffect } from "react";
import WOTDService from "../services/WordOfTheDayService";
import GuessService from "../services/GuessService";
import { errorMessages } from "../constants";
import GameInfoHeader from "../components/GameInfoHeader";
import CongratsSection from "../components/CongratsSection";
import HelpSection from "../components/HelpSection";

class GameState {
  current?: Guess;
  guesses: Guess[];
  guessCount: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  wordFound: boolean;
  wordOfTheDay: string;

  constructor() {
    let state = JSON.parse(localStorage.getItem("state") || "{}");
    this.current = state.current;
    this.guesses = state.guesses || [];
    this.guessCount = state.guessCount || 0;
    this.greenCount = state.greenCount || 0;
    this.yellowCount = state.yellowCount || 0;
    this.redCount = state.redCount || 0;
    this.wordFound = state.wordFound || false;
    this.wordOfTheDay = state.wordOfTheDay || "";
  }

  save() {
    localStorage.setItem(
      "state",
      JSON.stringify({
        current: this.current,
        guesses: this.guesses,
        guessCount: this.guessCount,
        greenCount: this.greenCount,
        yellowCount: this.yellowCount,
        redCount: this.redCount,
        wordFound: this.wordFound,
        wordOfTheDay: this.wordOfTheDay,
      })
    );
  }
}

const GamePage = () => {
  let gameState = new GameState();
  const [inputValue, setInputValue] = useState("");
  const [current, setCurrent] = useState<Guess | undefined>(gameState.current);
  const [guesses, setGuesses] = useState<Guess[]>(gameState.guesses);
  const [guessCount, setGuessCount] = useState<number>(gameState.guessCount);
  const [greenCount, setGreenCount] = useState<number>(gameState.greenCount);
  const [yellowCount, setYellowCount] = useState<number>(gameState.yellowCount);
  const [redCount, setRedCount] = useState<number>(gameState.redCount);


  const [wordFound, setWordFound] = useState<boolean>(gameState.wordFound);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  gameState.current = current;
  gameState.guesses = guesses;
  gameState.guessCount = guessCount;
  gameState.greenCount = greenCount;
  gameState.yellowCount = yellowCount;
  gameState.redCount = redCount;
  gameState.wordFound = wordFound;
  gameState.save();

  useEffect(() => {
    WOTDService.get().then((word) => {
      GuessService.init(word);
      if (gameState.wordOfTheDay != word) {
        setCurrent(undefined);
        setGuesses([]);
        setGuessCount(0);
        setWordFound(false);
        gameState.wordOfTheDay = word;
        gameState.save();
      }
    });
  }, []);

  const normalize_word = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGuess = () => {
    setErrorMessage("");
    let stemmed_word = GuessService.stem_word(inputValue);
    try {
      if (guesses.map((guess) => guess.stemmed_word).includes(stemmed_word)) {
        throw Error(errorMessages.guessing.duplicate);
      }
      let score = GuessService.guess(stemmed_word);
      let currentGuess = {
        score,
        word: normalize_word(inputValue),
        stemmed_word,
      };


      setCurrent(currentGuess);
      setGuesses((prevGuesses) => {
        let sortedGuesses = [...prevGuesses, currentGuess].sort(
          (a, b) => a.score - b.score
        );
        return sortedGuesses;
      });
      if (!wordFound) {
        setGuessCount(guessCount + 1); 
        if (score <= 300) {
          setGreenCount(greenCount+1)
        } else if (score <= 1000) {
          setYellowCount(yellowCount+1)
        } else {
          setRedCount(redCount+1)
        }
      }
      if (currentGuess.score == 1) {
        setWordFound(true);
      }
      setInputValue("");
    } catch (error: any) {
      setErrorMessage(error.message);
      if(error.message.includes("already")) {
        setErrorMessage(`${normalize_word(inputValue)} was already guessed`)
      }
      if (error.message.includes("used")) {
        setInputValue("");
      }
    }
    gameState.save();
  };

  const showHelp = () => {
    setHelpVisible(!helpVisible);
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
      <HelpSection visible={helpVisible} setVisibility={setHelpVisible}/>

      {wordFound && <CongratsSection guessesType1={greenCount} guessesType2={yellowCount} guessesType3={redCount}/>}
      <Box sx={{ display: "flex", width: "100%" }}>
        <GameInfoHeader title={"Guesses:"} count={guessCount} />
        <Box sx={{ display: "flex", marginLeft: "auto"}}>
          <IoMdInformationCircleOutline
            onClick={showHelp}
            style={{ color: "white", fontSize: "1.5em", margin: "auto 0.5rem" }}
            />
        </Box>
        
      </Box>
      <GuessInput
        guess={inputValue}
        handleChange={handleChange}
        handleSubmit={handleGuess}
      />
      {/* ToDo make space for error message so words dont get moved down*/}
      {/* {errorMessage ? (
        <GameInfoHeader title={errorMessage} />
      ) : (
        <Guesses guesses={current ? [current] : []} currentGuess={current} />
      )} */}
      <GameInfoHeader title={errorMessage} />
      <Guesses guesses={current ? [current] : []} currentGuess={current} />
      <br></br>
      <Guesses guesses={guesses} currentGuess={current} />
    </Box>
  );
};

export default GamePage;
