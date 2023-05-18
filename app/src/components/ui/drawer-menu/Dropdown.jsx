import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Badge, IconButton, Typography } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import React, { useContext, useState } from 'react';
import AppContext from "../../../store/AppContext";


const boxStyle = {
  light: "var(--color-light-4)",
  dark: "var(--color-dark-10)",
  blind: "var(--color-light-4)",
}

const textColor = {
  light: "black",
  dark: "white",
  blind: "black",
}

const dividerColor = {
  light: "none",
  dark: "var(--color-dark-9)",
  blind: "none"
}

export default function Dropdown({ 
  items = [],
  side = "top"
}) {
  const [state, setState] = useState(false);
  const { theme } = useContext(AppContext);

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(prev => !prev);
  };

  const listItems = []

  // Generate dropdown with the items description array
  for (let i = 0; i < items.length; ++i) {
    for (const [label, { icon, onClick, notifs }] of Object.entries(items[i])) {
      listItems.push(
        <ListItem key={label} disablePadding onClick={onClick}>
          <ListItemButton>
            <ListItemIcon> 
                <Badge badgeContent={notifs} color='primary'>
                  {icon}
                </Badge>
            </ListItemIcon>

            <ListItemText>
                <Typography sx={{ color: textColor[theme] }}>
                  {label}
                </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      )
    }
    // Insert divider in between each element
    if (i + 1 !== items.length) {
      listItems.push(<Divider key={i} sx={{bgcolor: dividerColor[theme]}}/>)
    }
  }

  return (
    <div>
      <React.Fragment key={side}>
        <IconButton aria-label="menu" size="large" onClick={toggleDrawer}>
          <MenuIcon fontSize="large" sx={{ color: "var(--color-light-8)" }}/>
        </IconButton>

        <Drawer anchor={side} open={state} onClose={toggleDrawer}>
          <Box
            sx={{ width: side, bgcolor: boxStyle[theme] }}
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <List>
              {listItems}
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}

