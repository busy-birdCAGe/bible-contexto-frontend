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
  guessesType1 = 5,
  guessesType2 = 8,
  guessesType3 = 15,
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
      {/* <Title title="Congrats!" size={24}/> */}
      <Box
        sx={{
          fontSize: 30,
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
        Congrats!
      </Box>

      <Box sx={{ fontSize: 20, fontWeight: "700", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", }}>
        <Box sx={{mb:"10px"}}>
          You got the word in {totalGuesses} guesses!
        </Box>
        <Box sx={{textAlign: "left"}}>
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
