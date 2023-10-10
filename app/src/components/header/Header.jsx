import {Box} from "@mui/material";
import PropTypes from "prop-types";
import Title from "../title/Title";


Header.propTypes = {
    position: PropTypes.oneOf(["left", "center", "right"]),
}

const PADDING = "20%";
const LEFT_WIDTH = {"left": PADDING, "center": "50%", "right": "100%"};
const RIGHT_WIDTH = {"left": "100%", "center": "50%", "right": PADDING};

// left | center | right
export default function Header({position}) {
    return (
        <Box sx={{
            height: "135px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#EE8B98",
        }}>
            <Box sx={{
                height: "8px",
                width: {
                    xs: LEFT_WIDTH["center"],
                    md: LEFT_WIDTH[position],
                },
                backgroundColor: "#EEE6E9",
            }}/>
            <Title/>
            <Box sx={{
                height: "8px",
                width: {
                    xs: RIGHT_WIDTH["center"],
                    md: RIGHT_WIDTH[position],
                },
                backgroundColor: "#EEE6E9",
            }}/>
        </Box>
    )
}
