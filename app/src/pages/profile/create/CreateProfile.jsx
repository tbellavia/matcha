import React from "react";
import Header from "../../../components/header/Header";
import { Autocomplete, Box, Checkbox, Container, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import styles from "./CreateProfile.module.scss";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { cities } from "../../../utils/cities";
import ImageUpload from "../components/ImageUpload";
import FormControl from "@mui/material/FormControl";

export default function CreateProfile() {
  return (
    <React.Fragment>
      <Header position="center" />
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
            <ImageUpload />
          </Stack>

          <InputGroup>
            <TextField label="Prénom" variant="outlined" size="small" fullWidth />
            <TextField label="Nom" variant="outlined" size="small" fullWidth />
          </InputGroup>

          <InputGroup>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Date de naissance"
                slotProps={{ textField: { size: "small" } }}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
            <Autocomplete
              options={Object.keys(cities)}
              renderInput={(params) => <TextField {...params} label="Localisation" />}
              size="small"
              fullWidth
            />
          </InputGroup>

          <InputGroup >
            <FormControl fullWidth>
              <FormLabel id="gender-choice">Genre</FormLabel>
              <RadioGroup name="gender-choice">
                <FormControlLabel value="female" control={<Radio />} label="Femme" />
                <FormControlLabel value="male" control={<Radio />} label="Homme" />
                <FormControlLabel value="non-binary" control={<Radio />} label="Non Binaire" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel id="preference-choice" >Préférences</FormLabel>
              <RadioGroup name="preference-choice" >
                <FormControlLabel value="female" control={<Checkbox />} label="Femme" />
                <FormControlLabel value="male" control={<Checkbox />} label="Homme" />
                <FormControlLabel value="non-binary" control={<Checkbox />} label="Non Binaire" />
              </RadioGroup>
            </FormControl>
          </InputGroup>

        </Stack>
      </Container>
    </React.Fragment>
  )
}

function InputGroup({ children }) {
  return (
    <Stack
      direction={{ sm: "row", xs: "column" }}
      fullWidth
      justifyContent="space-between"
      gap={2}
    >
      {children}
    </Stack>
  )
}
