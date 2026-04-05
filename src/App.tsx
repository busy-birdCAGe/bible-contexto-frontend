import Box from "@mui/material/Box/Box";
import GamePage from "./pages/GamePage";
import { Provider } from "react-redux";
import store from "./state/store";

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
