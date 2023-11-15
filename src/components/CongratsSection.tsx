import Box from "@mui/material/Box/Box";

export interface CongratsSectionProps {
  gameId?: number;
  numberOfAttempts?: number;
}
const CongratsSection = ({
  gameId,
  numberOfAttempts,
}: CongratsSectionProps) => {
  return (
    <Box
      sx={{
        width: "300px",
        minHeight: "200px",
        bgcolor: "rgba(34, 34, 34, 1)",
        textAlign: "center",
        color: "white",
        fontFamily: "monospace",
        border: "3px solid white ",
        borderRadius: "10px",
        my: "15px",
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
        <Box sx={{}}> You got word #{gameId}</Box>
        <Box sx={{}}> in {numberOfAttempts} guesses</Box>
      </Box>
    </Box>
  );
};

export default CongratsSection;
