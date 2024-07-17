import Box from "@mui/material/Box/Box";

interface GameInfoHeaderProps {
  count: number;
  gameName: string;
}
const GameInfoHeader = ({ count, gameName }: GameInfoHeaderProps) => {
  return (
    <Box
      sx={{
        color: "white",
        textAlign: "left",
        fontWeight: "700",
        mx: "15px",
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mr: "15px" }}>
        <Box>Game: </Box>
        <Box sx={{ fontSize: 24, fontWeight: "900" }}>{gameName}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box>Guesses: </Box>
        <Box sx={{ fontSize: 24, fontWeight: "900" }}>{count}</Box>
      </Box>
    </Box>
  );
};

export default GameInfoHeader;
