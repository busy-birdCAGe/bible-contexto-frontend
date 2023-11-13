import Box from "@mui/material/Box/Box";
import GamePage from "./pages/GamePage";
function App() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "#000000",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "auto",
      }}
    >
      <GamePage />
    </Box>
  );
}

export default App;
