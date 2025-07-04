import React from "react";
import { QueryBuilder, Favorite, HeartBroken } from "@mui/icons-material";

const iconColor = "var(--color-light-8)";

const loveIcons = [<QueryBuilder sx={{ color: iconColor }} />, <Favorite sx={{ color: iconColor }} />, <HeartBroken sx={{ color: iconColor }} />]

function LoveState({ love }) {
    return (
        <React.Fragment>
            {(love[0] != 0 || love[1] != 0) && loveIcons[love[0]]}
            {(love[0] != 0 || love[1] != 0) && loveIcons[love[1]]}
        </React.Fragment>
    );
}

export default LoveState;