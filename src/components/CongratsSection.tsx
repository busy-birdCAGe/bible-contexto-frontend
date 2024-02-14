import Box from "@mui/material/Box/Box";

export interface CongratsSectionProps {
  numberOfAttempts?: number;
}
const CongratsSection = ({
  numberOfAttempts,
}: CongratsSectionProps) => {
  return (
    <Box
      sx={{
        width: "300px",
        minHeight: "150px",
        bgcolor: "rgba(34, 34, 34, 1)",
        textAlign: "center",
        color: "white",
        border: "3px solid white ",
        borderRadius: "10px",
        my: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          fontSize: 30,
          fontWeight: "700",
        }}
      >
        Congrats!
      </Box>

      <Box sx={{ fontSize: 20, fontWeight: "700" }}>
        <Box sx={{}}>You got the word in {numberOfAttempts} guesses!</Box>
      </Box>
    </Box>
  );
};

export default CongratsSection;
