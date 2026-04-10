import Box from "@mui/material/Box/Box";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import HelpSection from "./HelpSection";
import PreviousGames from "./PreviousGames";
import CreateGame from "./CreateGame";
import Hint from "./Hint";


interface DropDownItemProps {
  text: string;
  handler: Function;
  closeHandler: Function;
}

const DropDownItem = ({text, handler, closeHandler}: DropDownItemProps) => {
  return (
      <MenuItem
        onClick={() => {
          closeHandler();
          handler();
        }}
        sx={{
          fontSize: "15px",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {text}
      </MenuItem>
  );
};

const DropDownMenu = () => {
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [previousGamesVisible, setPreviousGamesVisible] =
    useState<boolean>(false);
  const [createGameVisible, setCreateGameVisible] = useState<boolean>(false);
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | SVGElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showHelp = () => {
    setHelpVisible(true);
  };

  const showPreviousGames = () => {
    setPreviousGamesVisible(true);
  };

  const showCreateGame = () => {
    setCreateGameVisible(true);
  }

  const showHint = () => {
    setHintVisible(true);
  }

  return (
      <Box
        sx={{
          display: "flex",
          marginLeft: "auto",
          margin: "auto 0.5rem",
        }}
      >
        <HelpSection visible={helpVisible} setVisibility={setHelpVisible} />
        <Hint visible={hintVisible} setVisibility={setHintVisible} />
        <PreviousGames
          visible={previousGamesVisible}
          setVisibility={setPreviousGamesVisible}
        />
        <CreateGame visible={createGameVisible} setVisibility={setCreateGameVisible} />
        <IoMenu
          onClick={handleClick}
          style={{ color: "white", fontSize: "1.5em", cursor: "pointer" }}
          data-testid="dropdown-menu-button"
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
            text="Hint"
            handler={showHint}
            closeHandler={handleClose}
          ></DropDownItem>
          <DropDownItem
            text="Previous Games"
            handler={showPreviousGames}
            closeHandler={handleClose}
          ></DropDownItem>
          <DropDownItem
            text="Create Game"
            handler={showCreateGame}
            closeHandler={handleClose}
          ></DropDownItem>
        </Menu>
      </Box>
  );
};

export default DropDownMenu;