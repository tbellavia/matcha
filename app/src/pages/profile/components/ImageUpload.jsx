import {Fab, Stack, TextField} from "@mui/material";
import {useState} from "react";
import AddIcon from "@mui/icons-material/Add";

export default function ImageUpload({ max = 5, onChange = () => {}, defaultImages = [] }) {
    const [images, setImages] = useState(defaultImages);
    console.log("Default images: ", defaultImages)
    const onFileChange = async (event) => {
        const file = event.target.files[0];

        if (images.length + 1 <= max) {
            setImages(prevImages => {
                const newImages = [...prevImages, file];

                onChange(newImages);

                return newImages;
            });
        }
    }

    const onImageClick = (event) => {
        const currIndex = parseInt(event.target.getAttribute("data-index"));
        const imagesCopy = [...images];

        if (currIndex !== -1) {
            imagesCopy.splice(currIndex, 1);
            setImages(imagesCopy);
        }
    }

    return (
        <Stack direction="row" spacing={2} flexWrap="wrap" marginTop={2}>
            {images.length < max &&
                <label
                    htmlFor="upload-image"
                    style={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <TextField
                        style={{display: "none"}}
                        name="upload-image"
                        id="upload-image"
                        type="file"
                        onChange={onFileChange}
                    />
                    <Fab color="primary" component="span">
                        <AddIcon/>
                    </Fab>
                </label>
            }

            {images.map((image, index) => {
                let src = image;

                if (typeof(image) !== "string") {
                    src = window.URL.createObjectURL(image);
                }
                return (
                    <img
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "11px",
                            objectFit: "cover"
                        }}
                        key={`${image.name}-${index}`}
                        src={src}
                        alt={image.name}
                        data-index={index}
                        onClick={onImageClick}
                    />
                )
            })}
        </Stack>
    )
}
