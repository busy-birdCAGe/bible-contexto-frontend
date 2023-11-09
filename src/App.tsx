import Box from "@mui/material/Box/Box";
import GamePage from "./assets/pages/GamePage";
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
      <GamePage />
    </Box>
  );
}

export default App;
