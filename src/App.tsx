import Box from "@mui/material/Box/Box";
import Guesses from "./components/Guesses"
function App() {

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
      <Guesses/>
    </Box>
  );
}

export default App;
