import React, {useEffect, useMemo} from "react";
import {AutoHideAlert} from "../../../components/auto-hide-alert/AutoHideAlert";
import {encodePreferences, getFirstError, getUserLocation, getUserLocationFromLocalStorage} from "../../../utils/utils";
import Header from "../../../components/header/Header";
import {
    Autocomplete,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    TextField
} from "@mui/material";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {cities} from "../../../utils/cities";
import ImageUpload from "../components/ImageUpload";
import FormControl from "@mui/material/FormControl";
import TagsAutocomplete from "../components/TagsAutocomplete";
import {Controller, useForm} from "react-hook-form";
import {
    formValidateBirthdate,
    formValidateImages,
    formValidateLength,
    formValidateTags
} from "../../../common/validation";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {MyLocation} from "@mui/icons-material";
import {useQuery} from "react-query";
import APIUser from "../../../services/user";
import {useNavigate} from "react-router-dom";
import InputGroup from "../components/InputGroup";


const MIN_DESC_SIZE = 10;
const MAX_DESC_SIZE = 300;
const MAX_DATE = dayjs().subtract(18, 'year');

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
            "birthdate": MAX_DATE,
        }
    });
    getUserLocation();
    const error = getFirstError(errors);
    const api = useMemo(() => new APIUser(), []);
    const navigate = useNavigate();
    const {refetch} = useQuery({
        async queryFn() {
            const infos = getValues();

            await api.createProfile(
                infos.images,
                infos.firstname,
                infos.lastname,
                infos.birthdate,
                infos.location,
                infos.gender,
                // Transform to array
                encodePreferences(infos.preferences),
                infos.tags,
                infos.description,
            );
        },
        onSuccess() {
            navigate("/feed");
        },
        onError(err) {
            navigate("/error");
        },
        enabled: false,
    })

    const onSubmit = async () => {
        await refetch();
    }

    useEffect(() => {
        register("tags", {
            validate: formValidateTags
        })
        register("location", {
            required: true,
            setValueAs(value) {
                if (value.hasOwnProperty("lat") && value.hasOwnProperty("lng")) {
                    return value;
                }
                return cities[value]
            },
        })
        register("preferences", {
            required: true,
            value: {},
        })
        register("images", {
            required: true,
            validate(images) {
                return formValidateImages(images)
            }
        })
        register("birthdate", {
            required: true,
            validate(birthdate) {
                return formValidateBirthdate(birthdate);
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
        setValue("preferences", {
            ...watch("preferences"),
            [event.target.name]: event.target.checked,
        })
    }

    const onImageChange = (images) => {
        setValue("images", images);
    }

    const onBirthDateChange = (birthdate) => {
        setValue("birthdate", birthdate);
    }

    const onAutoLocationClicked = () => {
        const location = getUserLocationFromLocalStorage();

        setValue("location", location);
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

                        {/* First name & Last name */}
                        <InputGroup>
                            <TextField label="Prénom" variant="outlined" size="small"
                                       fullWidth {...register("firstname", {
                                required: true
                            })} />
                            <TextField label="Nom" variant="outlined" size="small" fullWidth {...register("lastname", {
                                required: true
                            })} />
                        </InputGroup>

                        {/* Birthdate and localisation */}
                        <InputGroup>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Date de naissance"
                                    value={watch('birthdate')}
                                    onChange={onBirthDateChange}
                                    slotProps={{textField: {size: "small"}}}
                                    sx={{width: "100%"}}
                                    maxDate={MAX_DATE}
                                />
                            </LocalizationProvider>

                            {/*
                                If user accept automatic location, it is registered in local storage and further
                                retrieval is made in local storage.
                            */}
                            <Autocomplete
                                options={Object.keys(cities)}
                                renderInput={(params) => <TextField {...params} label="Localisation"/>}
                                size="small"
                                fullWidth
                                onChange={(_, city) => onLocationChange(city)}
                            />
                            <IconButton onClick={onAutoLocationClicked}>
                                <MyLocation/>
                            </IconButton>
                        </InputGroup>

                        {/* Gender and preferences */}
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

                        {/* Tags */}
                        <TagsAutocomplete onChange={onTagsChange}/>

                        {/* Description */}
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

