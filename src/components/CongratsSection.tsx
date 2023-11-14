import Box from "@mui/material/Box/Box";

interface CongratsSectionProps {
  wordNumber: number;
  guessCount: number;
}
const CongratsSection = ({ wordNumber, guessCount }: CongratsSectionProps) => {
  return (
    <Box
      sx={{
        width: "300px",
        height: "200px",
        bgcolor: "rgba(34, 34, 34, 1)",
        textAlign: "center",
        color: "white",
        fontFamily: "monospace",
        border: "5px solid white ",
        borderRadius: "10px",
        my: "15px"
      }}
    >
      <Box
        sx={{
          //   textAlign: "center",
          //   ml: "20px",

          fontSize: 24,
          fontWeight: "700",
          //   letterSpacing: ".1px",
        }}
      >
        Congrats!
      </Box>

      <Box sx={{ fontSize: 20, fontWeight: "700" }}>
        <Box sx={{}}> You got word#{wordNumber}</Box>
        <Box sx={{}}> in {guessCount} guesses</Box>
      </Box>
    </Box>
  );
};

export default CongratsSection;
