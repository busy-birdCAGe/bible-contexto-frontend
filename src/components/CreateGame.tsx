import Box from "@mui/material/Box";
import GameService from "../GameService";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useLanguage } from "../state/selectors";
import { Input, Button } from "@mui/material";
import { generateGameUrl } from "../utils"
import Title from "./Title";


interface CreateGameProps {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}

const initialState = { word: '', wordId: '', shareEnabled: false, info: '' }

const CreateGame = ({ setVisibility, visible }: CreateGameProps) => {
  const language = useLanguage();
  const gameService = new GameService(language);
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState(initialState);

  const hideCreateGame = () => {
    setState(initialState);
    setVisibility(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      hideCreateGame();
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  const shareGameUrl = async () => {
      const url = generateGameUrl(state.wordId);
      if (navigator.share) {
        navigator.share({
          title: 'Bible Contexto',
          text: `Guess the word I picked!\n\n${url}`,
        }).catch(_ => {
          setState(prev => ({ ...prev, info: 'Failed to share game' }));
        });
      } else {
        navigator.clipboard.writeText(url).catch(_ => {
          setState(prev => ({ ...prev, info: 'Failed to copy game URL' }));
        });
      }
  };

  const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key != "Enter" || !state.word.trim()) return;
    try {
      const id = await gameService.getWordId(state.word.trim());
      setState(prev => ({ ...prev, info: `'${state.word}' is available!`, wordId: id, shareEnabled: true }));
    } catch (e) {
      setState(prev => ({ ...prev, info: `'${state.word}' is not available`, shareEnabled: false }));
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        border: "1px solid white ",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgb(34, 34, 34, 1)",
        borderRadius: "12px",
        width: "80%",
        maxWidth: "355px",
        padding: "20px",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.8)",
        zIndex: 1,
        color: "white",
        display: visible ? "block" : "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <IoClose
          onClick={hideCreateGame}
          style={{ color: "white", fontSize: "1.5em", cursor: "pointer" }}
        />
      </Box>
      <Box 
        sx={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Title size={24} title="Create Game" />
        <Input
          disableUnderline={true}
          placeholder="Choose a word..."
          value={state.word}
          onChange={(e) => setState(prev => ({ ...prev, word: e.target.value }))}
          onKeyDown={handleSubmit}
          sx={{
            pl: "10px",
            width: "100%",
            height: "50px",
            bgcolor: "rgba(217, 217, 217, 1)",
            borderRadius: "10px",
            fontSize: 18,
            fontWeight: "700",
            my: "10px"
          }}
        />
        {state.info && (
          <Box
            sx={{
                color: "white",
                textAlign: "center",
                fontWeight: "700",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
          }}>
            {state.info}
          </Box>
        )}
        <Button
          variant="outlined"
          color="inherit"
          onClick={shareGameUrl}
          disabled={!state.shareEnabled}
          sx={{
            marginTop: "10px",
            "&.Mui-disabled": {
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          Share
        </Button>
      </Box>
    </Box>
  );
};

export default CreateGame;