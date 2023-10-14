import React from "react";
import Header from "../../../components/header/Header";
import {Autocomplete, Box, Container, Stack, TextField} from "@mui/material";
import styles from "./CreateProfile.module.scss";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {cities} from "../../../utils/cities";


export default function CreateProfile() {
    return (
        <React.Fragment>
            <Header position="center"/>
            <Container sx={{
                height: 300,
                maxWidth: {
                    sm: "80%",
                    md: 635
                },
                display: "flex",
                flexDirection: "column"
            }}>
                <Stack gap={3}>
                    <Stack
                        direction="row"
                        width="100%"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap={1}
                    >
                        <Box className={styles['image-container']}/>
                        <Box className={styles['image-container']}/>
                        <Box className={styles['image-container']}/>
                        <Box className={styles['image-container']}/>
                        <Box className={styles['image-container']}/>
                    </Stack>

                    <InputGroup>
                        <TextField label="Prénom" variant="outlined" size="small" fullWidth/>
                        <TextField label="Nom" variant="outlined" size="small" fullWidth/>
                    </InputGroup>

                    <InputGroup>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Date de naissance"
                                slotProps={{textField: {size: "small"}}}
                                sx={{width: "100%"}}
                            />
                        </LocalizationProvider>
                        <Autocomplete
                            options={Object.keys(cities)}
                            renderInput={(params) => <TextField {...params} label="Localisation"/>}
                            size="small"
                            fullWidth
                        />
                    </InputGroup>
                </Stack>
            </Container>
        </React.Fragment>
    )
}

function InputGroup({children}) {
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
