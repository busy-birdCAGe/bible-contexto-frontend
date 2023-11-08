// import { useState } from "react";
import Box from "@mui/material/Box/Box";
import WordCard from "./components/WordCard";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "#000000",
        minHeight: "100vh",
      }}
    >
      <WordCard number={100} word={"apple"}/>
    </Box>
  );
}

export default App;
