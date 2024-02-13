import { Box } from "@mui/material";

interface WordCardProps {
  score: number;
  word: string;
  highlighted?: boolean;
}

const WordCard = ({ score, word, highlighted }: WordCardProps) => {
  let color: string;
  let percentage: number = 100 * 1.001 * Math.pow(0.9989, score);

  if (score <= 300) {
    color = "0, 206, 209 ";
  } else if (score <= 1000) {
    color = "255, 20, 147";
  } else {
    color = "153, 50, 204";
  }

  return (
    <Box
      sx={{
        width: "355px",
        height: "38px",
        // bgcolor: "rgba(60, 59, 59, 1)",
        // bgcolor: "rgba(21, 32, 43, 1)",
        // rgba(30, 42, 51, 1) nice background with the #15202b
        backgroundImage: `linear-gradient(to right, rgba(${color}, 1) 2.5%, rgba(${color}, .9) 2.5% ${percentage}%, rgba(60, 59, 59, 1) ${percentage}%)`,
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        fontSize: 18,
        fontFamily: "monospace",
        mt: "6px",
        color: "white",
        border: highlighted ? "2px solid white ": "",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "270px",
          justifyContent: "left",
          ml: "10px",
          fontWeight: "700",
        }}
      >
        {word}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "86px",
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
