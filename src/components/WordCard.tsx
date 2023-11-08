import { Box, Typography } from "@mui/material";

interface WordCardProps {
  number: number;
  word: string;
}

const WordCard = ({ number, word }: WordCardProps) => {
  return (
    <Box
      sx={{
        width: "355px",
        height: "70px",
        bgcolor: "#FFFFFF",
        backgroundImage:
          "linear-gradient(to right, rgba(5, 255, 0, 1) 5%, rgba(5, 255, 0, 0.2) 5% 50%, rgba(0, 0, 0, 0) 50%)",
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        fontSize: 24,
        fontFamily: "monospace"
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "235px",
          justifyContent: "left",
          ml: "40px",
          fontWeight:"700"
        }}
      >
        {word}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "121px",
          justifyContent: "center",
        }}
      >
        {number}
      </Box>
      {/* <Typography sx={{width: "235px", textAlign: "center", bgcolor: "#000000"}}>{word}</Typography> */}
      {/* <Typography sx={{ textAlign: "right", justifyContent: "center", bgcolor:"#eeeeee", display: "flex"}}>{number}</Typography> */}
    </Box>
  );
};

export default WordCard;
