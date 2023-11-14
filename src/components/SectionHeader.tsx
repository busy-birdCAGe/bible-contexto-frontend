import Box from "@mui/material/Box/Box";

interface SectionHeaderProps {
  title: string;
}
const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <Box
      sx={{
        color: "white",
        textAlign: "left",
        ml: "20px",
        fontFamily: "monospace",
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: ".1px",
        width:"100%"
      }}
    >
        {title}
    </Box>
  );
};

export default SectionHeader
