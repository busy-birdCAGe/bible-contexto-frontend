import Box from "@mui/material/Box/Box";
import Input from "@mui/material/Input";
import { useState } from "react";

const GuessInput = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Guess was:", inputValue);

    // Add your further submission logic here
    setInputValue("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Input
        disableUnderline={true}
        placeholder={"Enter a word"}
        value={inputValue}
        onChange={handleChange}
        sx={{
          pl: "10px",
          width: "355px",
          height: "50px",
          bgcolor: "rgba(217, 217, 217, 1)",
          borderRadius: "10px",
          fontFamily: "monospace",
          fontSize: 24,
          fontWeight: "700",
        }}
      />
    </Box>
  );
};

export default GuessInput;
