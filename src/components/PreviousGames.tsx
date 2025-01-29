import Box from "@mui/material/Box/Box";
import Title from "./Title";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { GameService } from "../services/GameService";
import { GameToken } from "../utils";
import { State } from "../GameState";

interface PreviousGamesProps {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  gameService: GameService;
  state: State;
}

const PreviousGames = ({
  setVisibility,
  visible,
  gameService,
  state,
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

  const handleItemClick = (gameToken: GameToken) => {
    state.updateGameInUse(gameToken);
    hidePage();
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
      }}
    >
      <Box
        sx={{
          position: "sticky",
          backgroundColor: "rgb(34, 34, 34, 1)",
          zIndex: 2,
          paddingBottom: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IoClose
            onClick={hidePage}
            style={{ color: "white", fontSize: "1.5em", cursor: "pointer" }}
          />
        </Box>
        <Title title="Previous Games:" size={24} />
      </Box>
      <Box
        sx={{
          maxHeight: "50vh",
          overflowY: "auto",
          scrollbarColor: "rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.1)",
        }}
      >
        {dailyGames.length > 0 ? (
          <ul
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              margin: 0,
              listStyle: "none",
            }}
          >
            {dailyGames.map((gameToken, index) => {
              const date = new Date();
              date.setDate(date.getDate() - index);
              const formattedDate = `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`;

              return (
                <li
                  key={index}
                  style={{
                    marginBottom: index === dailyGames.length - 1 ? 0 : "8px",
                    padding: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => handleItemClick(gameToken)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255, 255, 255, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                  }}
                >
                  #{gameToken.gameId} ({formattedDate})
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No games available</p>
        )}
      </Box>
    </Box>
  );
};

export default PreviousGames;
