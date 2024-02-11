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
        mt: "50px",
        backgroundColor: "rgb(50,50,50)",
        position: "absolute",
        display: visible ? "block" : "none",
        zIndex: "1",
        padding: "1rem 2.5rem",
        borderRadius: "1rem",
      }}
    >
      <IoClose
        onClick={hideHelp}
        style={{ color: "white", fontSize: "1.5em", alignItems: "end" }}
      />
      <Title title="How To Play" />
      <Box sx={{ color: "white", justifyItems: "left" }}>Every day a random word is chosen out of the NIV bible, and your goal is to guess it. Each of your guesses will be ranked against the word of the day by how often the word appears in similar contexts.</Box>
    </Box>
  );
};

export default HelpSection;
