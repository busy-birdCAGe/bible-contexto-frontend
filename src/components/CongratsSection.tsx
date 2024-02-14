import Box from "@mui/material/Box/Box";

export interface CongratsSectionProps {
  numberOfAttempts?: number;
  guessesType1?: number;
  guessesType2?: number;
  guessesType3?: number;
}

type CalculateRoundedPercentageThreshold = (
  guesses: number,
  totalGuesses: number,
  maxEmojis: number
) => number;

const CongratsSection = ({
  guessesType1 = 0,
  guessesType2 = 0,
  guessesType3 = 0,
}: CongratsSectionProps) => {

const totalGuesses = guessesType1 + guessesType2 + guessesType3;

const calculateRoundedPercentageThreshold: CalculateRoundedPercentageThreshold = (
  guesses,
  totalGuesses,
  maxEmojis
) => {
  const percentage = (guesses / totalGuesses) * 10;
  const roundedPercentage = Math.round(percentage);
  return roundedPercentage <= maxEmojis ? roundedPercentage : maxEmojis;
};

const maxEmojis = 6; 
const emojiThresholdType1 = calculateRoundedPercentageThreshold(guessesType1, totalGuesses, maxEmojis);
const emojiThresholdType2 = calculateRoundedPercentageThreshold(guessesType2, totalGuesses, maxEmojis);
const emojiThresholdType3 = calculateRoundedPercentageThreshold(guessesType3, totalGuesses, maxEmojis);


const emojisType1 = Array.from({ length: Math.min(guessesType1, emojiThresholdType1) }, () => "🟩");
const emojisType2 = Array.from({ length: Math.min(guessesType2, emojiThresholdType2) }, () => "🟨");
const emojisType3 = Array.from({ length: Math.min(guessesType3, emojiThresholdType3) }, () => "🟥");
  return (
    <Box
    sx={{
      width: "300px",
      minHeight: "260px",

      bgcolor: "rgba(34, 34, 34, 1)",
      textAlign: "center",
      color: "white",
      border: "1px solid white",
      borderRadius: "12px",
      my: "15px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        fontSize: "28px", 
        fontWeight: "700",
        marginBottom: "10px", 
      }}
    >
      Congrats!
    </Box>
  
    <Box
      sx={{
        fontSize: "18px", 
        fontWeight: "500",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        mb: "15px",
      }}
    >
      <Box sx={{textAlign: "center" }}>
        You got the word in
      </Box>
      <Box sx={{ mb: "10px", textAlign: "center" }}>
        {totalGuesses} guesses!
      </Box>
      <Box>
        <Box>
          {emojisType1} {guessesType1}
        </Box>
        <Box>
          {emojisType2} {guessesType2}
        </Box>
        <Box>
          {emojisType3} {guessesType3}
        </Box>
      </Box>
    </Box>
  </Box>
  );
};

export default CongratsSection;
