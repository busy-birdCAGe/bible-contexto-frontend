import Box from "@mui/material/Box/Box";

interface ErrorMessageProps {
  message: string;
}
const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <Box
      sx={{
        color: "white",
        textAlign: "left",
        fontWeight: "700",
        mx: "15px",
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box>{message}</Box>
    </Box>
  );
};

export default ErrorMessage;
