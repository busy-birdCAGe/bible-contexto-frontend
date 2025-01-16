import Box from "@mui/material/Box/Box";
import Title from "../components/Title";
import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";


interface HelpSectionProps {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}
const HelpSection = ({ setVisibility, visible }: HelpSectionProps) => {
  const hideHelp = () => {
    setVisibility(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        border: "1px solid white ",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgb(34, 34, 34, 1)",
        borderRadius: "12px",
        width: "80%",
        maxWidth: "355px",
        padding: "20px",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.8)", // Increase opacity for better visibility
        zIndex: 1,
        color: "white",
        display: visible ? "block" : "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <IoClose
          onClick={hideHelp}
          style={{ color: "white", fontSize: "1.5em", cursor: "pointer" }}
        />
      </Box>
      <Title title="How To Play:" size={24} />
      <Box sx={{ textAlign: "left", my: "12px", fontSize: "15px"}}>
        Every day a random word is chosen out of the NIV Bible, and your goal is to guess it.
      </Box>
      <Box sx={{ textAlign: "left", marginBottom: "12px", fontSize: "15px" }}>
        Each of your guesses will be ranked against the word of the day by how often the word appears in similar contexts.
      </Box>
      <Box sx={{ color: "white", textAlign: "left", marginBottom: "20px", fontSize: "15px" }}>
          Words with lower scores are closer to the word of the day, which has a
          score of 1.
      </Box>
      
    </Box>
  );
};

export default HelpSection;