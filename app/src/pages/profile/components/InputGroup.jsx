import {Stack} from "@mui/material";
import React from "react";

export default function InputGroup({children}) {
    return (
        <Stack
            direction={{sm: "row", xs: "column"}}
            width="100%"
            justifyContent="space-between"
            gap={2}
        >
            {children}
        </Stack>
    )
}