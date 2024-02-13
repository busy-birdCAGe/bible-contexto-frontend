import Box from "@mui/material/Box/Box";

interface TitleProps {
  title: string;
  size?: number;
}
const Title = ({ title, size = 32 }: TitleProps) => {
  return (
    <Box
      sx={{
        color: "white",
        textAlign: "center",
        fontFamily: "monospace",
        fontSize: size,
        fontWeight: "700",
        letterSpacing: ".1px",
      }}
    >
      {title}
    </Box>
  );
};

export default Title;
