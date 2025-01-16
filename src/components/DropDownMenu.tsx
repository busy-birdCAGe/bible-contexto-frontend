import Box from "@mui/material/Box/Box";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import HelpSection from "./HelpSection";



interface DropDownItemProps {
  text: string;
  handler: Function;
  closeHandler: Function;
}

const DropDownItem = (props: DropDownItemProps) => {
  return (
    <MenuItem
      onClick={() => {
        props.closeHandler();
        props.handler();
      }}
      sx={{
        fontSize: "15px",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      {props.text}
    </MenuItem>
  );
};

const DropDownMenu = () => {
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showHelp = () => {
    setHelpVisible(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        marginLeft: "auto",
        margin: "auto 0.5rem",
      }}
    >
      <HelpSection visible={helpVisible} setVisibility={setHelpVisible} />
      <IoMenu
        onClick={handleClick}
        style={{ color: "white", fontSize: "1.5em", cursor: "pointer" }}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "rgb(34, 34, 34, 1)",
            color: "white",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.8)",
            borderRadius: "12px",
          },
        }}
      >
        <DropDownItem
          text="Help"
          handler={showHelp}
          closeHandler={handleClose}
        ></DropDownItem>
        <DropDownItem
          text="Previous Games"
          handler={showHelp}
          closeHandler={handleClose}
        ></DropDownItem>
      </Menu>
    </Box>
  );
};

export default DropDownMenu;