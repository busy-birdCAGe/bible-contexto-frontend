import { Box } from "@mui/material";

interface WordCardProps {
  score: number;
  word: string;
}

const WordCard = ({ score, word }: WordCardProps) => {
  let color: string;
  let percentage: number = 100 * 1.001 * Math.pow(0.9989, score);

  if (score <= 300) {
    color = "5, 255";
  } else if (score <= 1000) {
    color = "255, 245";
  } else {
    color = "255, 0";
  }

  return (
    <Box
      sx={{
        width: "355px",
        height: "38px",
        bgcolor: "rgba(60, 59, 59, 1)",
        backgroundImage: `linear-gradient(to right, rgba(${color}, 0, 1) 2.5%, rgba(${color}, 0, 0.8) 2.5% ${percentage}%, rgba(60, 59, 59, 1) ${percentage}%)`,
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        fontSize: 18,
        fontFamily: "monospace",
        mt: "6px",
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "235px",
          justifyContent: "left",
          ml: "40px",
          fontWeight: "700",
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
        {score}
      </Box>
      {/* <Typography sx={{width: "235px", textAlign: "center", bgcolor: "#000000"}}>{word}</Typography> */}
      {/* <Typography sx={{ textAlign: "right", justifyContent: "center", bgcolor:"#eeeeee", display: "flex"}}>{score}</Typography> */}
    </Box>
  );
};

export default WordCard;
