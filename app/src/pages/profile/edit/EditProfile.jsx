import APIUser from "../../../services/user";
import React, {useEffect, useMemo} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
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
import ImageUpload from "../components/ImageUpload";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {cities} from "../../../utils/cities";
import {MyLocation} from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import {Controller, useForm} from "react-hook-form";
import TagsAutocomplete from "../components/TagsAutocomplete";
import {
    formValidateBirthdate,
    formValidateImages,
    formValidateLength,
    formValidateTags
} from "../../../common/validation";
import {AutoHideAlert} from "../../../components/auto-hide-alert/AutoHideAlert";
import {
    encodeGender,
    encodePreferences,
    getFirstError,
    getUserLocation,
    getUserLocationFromLocalStorage,
    tagsToList
} from "../../../utils/utils";
import {useQuery} from "react-query";
import dayjs from "dayjs";
import InputGroup from "../components/InputGroup";

const MIN_DESC_SIZE = 10;
const MAX_DESC_SIZE = 300;
const MAX_DATE = dayjs().subtract(18, 'year');

export default function EditProfile() {
    const profile = useLoaderData();
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
            "firstname": profile.first_name,
            "lastname": profile.last_name,
            "birthdate": dayjs(profile.birth),
            "description": profile.biograpy,
            "gender": "female",
        }
    });
    getUserLocation();
    const error = getFirstError(errors);
    const api = useMemo(() => new APIUser(), []);
    const navigate = useNavigate();
    const {refetch} = useQuery({
        async queryFn() {
            const infos = getValues();

            await api.updateProfile(
                infos.images,
                infos.firstname,
                infos.lastname,
                infos.birthdate,
                infos.location,
                encodeGender(infos.gender),
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
    const photos = useMemo(() => {
        let photos = [
            profile.photo1,
            profile.photo2,
            profile.photo3,
            profile.photo4,
            profile.photo5,
        ];

        return photos.filter(photo => photo !== null);
    }, [profile.photo1, profile.photo2, profile.photo3, profile.photo4, profile.photo5]);

    const onSubmit = async () => {
        await refetch();
    }

    useEffect(() => {
        register("tags", {
            value: tagsToList(profile.tags),
            validate: formValidateTags,
        })
        register("location", {
            value: {
              lat: profile.latitude,
              lng: profile.longitude,
            },
            setValueAs(value) {
                if (value.hasOwnProperty("lat") && value.hasOwnProperty("lng")) {
                    return value;
                }
                return cities[value]
            },
        })
        register("preferences", {
            value: {},
        })
        register("images", {
            value: photos,
            validate(images) {
                return formValidateImages(images)
            }
        })
        register("birthdate", {
            validate(birthdate) {
                return formValidateBirthdate(birthdate);
            }
        })
    }, [photos]);

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
                            <ImageUpload onChange={onImageChange} defaultImages={photos}/>
                        </Stack>

                        {/* First name & Last name */}
                        <InputGroup>
                            <TextField
                                label="Prénom"
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...register("firstname", {required: true})}
                            />
                            <TextField
                                label="Nom"
                                variant="outlined"
                                size="small"
                                fullWidth {...register("lastname", {required: true})}
                            />
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
                        <TagsAutocomplete
                            onChange={onTagsChange}
                            defaultValue={tagsToList(profile.tags)}
                        />

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

export async function loadProfile() {
    const api = new APIUser();

    const response = await api.getProfile();
    console.log(response.data);
    return response.data;
    // return {
    //     "id": 15,
    //     "first_name": "Tony",
    //     "last_name": "Bellavia",
    //     "birth": "2006-02-27T00:00:00.000Z",
    //     "genre": 2,
    //     "preference": 6,
    //     "biograpy": "erwfoijeqwpfoijqwepofij",
    //     "tags": "bouffe",
    //     "latitude": 48.8566,
    //     "longitude": 2.3522,
    //     "rating": null,
    //     "photo1": "https://ft-matcha.s3.fr-par.scw.cloud/30e855ee-cc0b-4624-9f92-c67318482db4",
    //     "photo2": "https://ft-matcha.s3.fr-par.scw.cloud/10130259-dd9f-46c9-bd7b-c6bc7e7ee72c",
    //     "photo3": "https://ft-matcha.s3.fr-par.scw.cloud/83e000d7-6195-4436-9121-b496e3546080",
    //     "photo4": "https://ft-matcha.s3.fr-par.scw.cloud/c65249fa-1240-4b28-b8ed-e723aab4c709",
    //     "photo5": null,
    //     "agemin": 18,
    //     "agemax": 150,
    //     "distmax": 1000,
    //     "minrating": 0,
    //     "filtertags": "",
    //     "tri": 0,
    // }
}
