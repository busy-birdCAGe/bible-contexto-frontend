import Input from "@mui/material/Input";

interface GuessInputProps {
  guess: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  handleSubmit: () => void;

}

const GuessInput = ({guess, handleChange, handleSubmit}: GuessInputProps) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(); // Trigger submission on Enter key press
    }
  };

  return (

      <Input
        disableUnderline={true}
        placeholder={"Enter a word"}
        value={guess}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        sx={{
          pl: "10px",
          // width: "355px",

          width: "100%",
          height: "50px",
          bgcolor: "rgba(217, 217, 217, 1)",
          borderRadius: "10px",
          fontSize: 24,
          fontWeight: "700",
          mb: "10px"
        }}
      />

  );
};

export default GuessInput;
