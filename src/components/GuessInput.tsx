import Input from "@mui/material/Input";

interface GuessInputProps {
  guess?: string;
}

const GuessInput = ({ guess }: GuessInputProps) => {
  return (
    <Input
    disableUnderline={true}
    placeholder={"Enter a word"}
      sx={{
        pl:"10px",
        width: "355px",
        height: "50px",
        // color: "white",
        bgcolor: "rgba(217, 217, 217, 1)",
        borderRadius: "10px",
        fontFamily: "monospace",
        fontSize: 24,
        fontWeight: "700",
      }}
    />
  );
};

export default GuessInput;
