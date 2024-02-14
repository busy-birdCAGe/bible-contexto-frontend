import Box from "@mui/material/Box/Box";

interface GameInfoHeaderProps {
  title: string;
  count?: number;
}
const GameInfoHeader = ({ title, count }: GameInfoHeaderProps) => {
  return (
    <Box
      sx={{
        color: "white",
        // fontFamily: "monospace",
        textAlign: "left",
        fontWeight: "700",
        ml: "10px",
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        width: count ? "auto" : "100%"
      }}
    >
      <Box>{title}</Box>
      <Box sx={{fontSize: 24, fontWeight: "900"}}> {count}</Box>
    </Box>
  );
};

export default GameInfoHeader;
