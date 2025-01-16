import Box from "@mui/material/Box/Box";
import Title from "./Title";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import GameService from "../services/GameService";
import { GameToken } from "../utils";

interface PreviousGamesProps {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  gameService: GameService;
}

const PreviousGames = ({
  setVisibility,
  visible,
  gameService,
}: PreviousGamesProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dailyGames, setDailyGames] = useState<GameToken[]>([]);

  const hidePage = () => {
    setVisibility(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      hidePage();
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      const games = [...gameService.dailyGames].reverse();
      setDailyGames(games);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, gameService]);

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
        maxHeight: "50vh",
        overflowY: "auto",
        scrollbarColor: "rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.1)"
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
          onClick={hidePage}
          style={{ color: "white", fontSize: "1.5em", cursor: "pointer" }}
        />
      </Box>
      <Title title="Previous Games:" size={24} />
      <Box sx={{ marginTop: "10px" }}>
        {dailyGames.length > 0 ? (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {dailyGames.map((gameToken, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                }}
              >
                #{gameToken.gameId}
              </li>
            ))}
          </ul>
        ) : (
          <p>No games available</p>
        )}
      </Box>
    </Box>
  );
};

export default PreviousGames;
