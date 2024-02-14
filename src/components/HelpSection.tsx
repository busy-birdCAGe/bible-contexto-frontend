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
        display: visible ? "flex" : "none",
        flexDirection: "column",
        zIndex: "1",
        justifyItems: "center",
        border: "1px solid white ",
        borderRadius: "10px",
        width: "355px",
        // fontFamily: "monospace",
        fontWeight: "500",
        fontSize: 18
      }}
    >
      <Box sx={{marginLeft: "auto", pr: "10px", pt: "10px", lineHeight: ".5"}}
>
        <IoClose
          onClick={hideHelp}
          style={{ color: "white", fontSize: "1.5em", marginRight: "auto", width: "100%"}}
        />
      </Box>
      <Box sx = {{px: "15px", pb:"10px"}}>
        <Title title="How To Play:" size={24} />
        <Box sx={{ color: "white", textAlign: "left", my: "8px"  }}>Every day a random word is chosen out of the NIV bible, and your goal is to guess it.</Box>
        <Box sx={{ color: "white", textAlign: "left"  }}>Each of your guesses will be ranked against the word of the day by how often the word appears in similar contexts.</Box>
      </Box>
    
      </Box>
  );
};

export default HelpSection;
