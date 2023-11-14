import Box from "@mui/material/Box/Box";

interface TitleProps {
  title: string;
}
const Title = ({ title }: TitleProps) => {
  return (
    <Box
      sx={{
        color: "white",
        textAlign: "center",
        fontFamily: "monospace",
        fontSize: 32,
        fontWeight: "700",
        letterSpacing: ".1px",
      }}
    >
      {title}
    </Box>
  );
};

export default Title;
