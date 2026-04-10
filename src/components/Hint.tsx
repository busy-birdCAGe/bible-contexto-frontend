import Box from "@mui/material/Box";
import GameService from "../GameService";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { IoClose } from "react-icons/io5";
import { useLanguage, useHint, useWordId, useGuesses } from "../state/selectors";
import { setHint } from "../state/reducer";
import Title from "./Title";

interface HintProps {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}

const Hint = ({ setVisibility, visible }: HintProps) => {
  const dispatch = useDispatch();
  const language = useLanguage();
  const wordId = useWordId();
  const guesses = useGuesses();
  const hint = useHint();
  const gameService = new GameService(language);
  const ref = useRef<HTMLDivElement | null>(null);

  const hideHint = () => setVisibility(false);

  const handleConfirm = () => {
    gameService.getHintWord(wordId!, guesses).then((hint) => {
      dispatch(setHint({ hint }));
    });
  };

  useEffect(() => {
    if (!visible) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) hideHint();
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        border: "1px solid white",
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <IoClose onClick={hideHint} style={{ color: "white", fontSize: "1.5em", cursor: "pointer" }} />
      </Box>
      <Box sx={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Title size={24} title="Hint" />
        {hint ? (
          <Box sx={{ textAlign: "left", my: "12px", fontSize: "18px" }}>{hint}</Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", mt: "12px" }}>
            <Box sx={{ textAlign: "center", fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
              Are you sure you want to use your hint?
            </Box>
            <Box sx={{ display: "flex", gap: "12px" }}>
              <Box onClick={handleConfirm} sx={{ cursor: "pointer", padding: "8px 20px", borderRadius: "8px", backgroundColor: "white", color: "black", fontWeight: "bold", fontSize: "14px" }}>
                Yes
              </Box>
              <Box onClick={hideHint} sx={{ cursor: "pointer", padding: "8px 20px", borderRadius: "8px", border: "1px solid white", fontSize: "14px" }}>
                No
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Hint;