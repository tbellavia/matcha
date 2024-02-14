import React, {useEffect} from "react";
import {AutoHideAlert} from "../../../components/auto-hide-alert/AutoHideAlert";
import {getFirstError} from "../../../utils/utils";
import Header from "../../../components/header/Header";
import {
    Autocomplete,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField
} from "@mui/material";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {cities} from "../../../utils/cities";
import ImageUpload from "../components/ImageUpload";
import FormControl from "@mui/material/FormControl";
import TagsAutocomplete from "../components/TagsAutocomplete";
import {Controller, useForm} from "react-hook-form";
import {formValidateImages, formValidateLength, formValidateTags} from "../../../common/validation";
import dayjs from "dayjs";

const MIN_DESC_SIZE = 10;
const MAX_DESC_SIZE = 300;
const MIN_DATE = dayjs().subtract(18, 'year');

export default function CreateProfile() {
    const {
        register,
        watch,
        handleSubmit,
        formState: {errors},
        getValues,
        setValue,
        control
    } = useForm({
        defaultValues: {
            // Default values are necessary avoid trigger MUI warning of controlling components
            "tags": [],
            "description": "",
            "gender": "female",
            "images": [],
        }
    });
    const error = getFirstError(errors);

    console.log(errors)

    const getPosition = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const normalizedPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
                setValue("location", normalizedPosition);
            },
            (error) => {
                console.log(error)
            }
        )
    }

    const onSubmit = () => {
        console.log("On Submit")
        console.log("=================")
        console.log(getValues());
    }

    useEffect(() => {
        register("tags", {
            validate: formValidateTags
        })
        register("location", {
            required: true,
            setValueAs(value) {
                return cities[value]
            },
        })
        register("preferences", {required: true, value: {}})
        register("images", {
            required: true,
            validate(images) {
                return formValidateImages(images)
            }
        })
    });

    const onTagsChange = (tags) => {
        setValue("tags", tags);
    }

    const onLocationChange = (city) => {
        setValue("location", city);
    }

    const onPreferencesChange = (event) => {
        console.log("Name:", event.target.name)
        setValue("preferences", {
            ...watch("preferences"),
            [event.target.name]: event.target.checked,
        })
    }

    const onImageChange = (images) => {
        console.log(images);
        setValue("images", images);
    }

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
                <Button variant="outlined" onClick={getPosition}>Get position</Button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap={3}>
                        <Stack
                            direction="row"
                            width="100%"
                            justifyContent="space-between"
                            flexWrap="wrap"
                            gap={1}
                        >
                            <ImageUpload onChange={onImageChange}/>
                        </Stack>

                        <InputGroup>
                            <TextField label="Prénom" variant="outlined" size="small"
                                       fullWidth {...register("firstname", {
                                required: true
                            })} />
                            <TextField label="Nom" variant="outlined" size="small" fullWidth {...register("lastname", {
                                required: true
                            })} />
                        </InputGroup>

                        <InputGroup>
                            <Controller
                                control={control}
                                name="birthdate"
                                render={({onChange, value}) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            label="Date de naissance"
                                            value={value}
                                            onChange={onChange}
                                            slotProps={{textField: {size: "small"}}}
                                            sx={{width: "100%"}}
                                            minDate={MIN_DATE}
                                        />
                                    </LocalizationProvider>
                                )}
                            />

                            <Autocomplete
                                options={Object.keys(cities)}
                                renderInput={(params) => <TextField {...params} label="Localisation"/>}
                                size="small"
                                fullWidth
                                onChange={(_, city) => onLocationChange(city)}
                            />
                        </InputGroup>

                        <InputGroup>
                            <FormControl fullWidth>
                                <FormLabel id="gender-choice">Genre</FormLabel>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({field}) => (
                                        <RadioGroup {...field}>
                                            <FormControlLabel value="female" control={<Radio/>} label="Femme"/>
                                            <FormControlLabel value="male" control={<Radio/>} label="Homme"/>
                                            <FormControlLabel value="non-binary" control={<Radio/>}
                                                              label="Non Binaire"/>
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <FormLabel id="preference-choice">Préférences</FormLabel>
                                <RadioGroup>
                                    <FormControlLabel
                                        value="female"
                                        control={
                                            <Checkbox onChange={onPreferencesChange} name="female"/>
                                        }
                                        label="Femme"
                                    />
                                    <FormControlLabel
                                        value="male"
                                        control={
                                            <Checkbox onChange={onPreferencesChange} name="male"/>
                                        }
                                        label="Homme"
                                    />
                                    <FormControlLabel
                                        value="non-binary"
                                        control={
                                            <Checkbox onChange={onPreferencesChange} name="non-binary"/>
                                        }
                                        label="Non Binaire"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </InputGroup>

                        <TagsAutocomplete onChange={onTagsChange}/>

                        <TextField
                            label="Description"
                            placeholder="Décrivez vous en quelques phrases"
                            multiline
                            inputProps={{maxLength: MAX_DESC_SIZE}}
                            helperText={`${watch("description").length}/${MAX_DESC_SIZE}`}
                            {...register("description", {
                                value: "",
                                required: true,
                                validate: formValidateLength(MIN_DESC_SIZE, MAX_DESC_SIZE),
                            })}
                        />

                        <Button variant="outlined" sx={{marginBottom: "20px"}} type="submit">
                            Valider
                        </Button>
                    </Stack>

                    {error && <AutoHideAlert duration={5000} message={error}/>}
                </form>
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
