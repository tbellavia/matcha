import styles from "./AddPhoto.module.css";
import style from "./Photo.module.css";
import { useState } from "react";
import React from "react";
import Icon from "../icons/Icon";
import { authorizedImageExtensionsString } from "../../../common/validation";

function AddPhoto({ 
    onChange = () => { },
    onBlur = () => { }
}) {
    const classes = `${styles.addPhoto}`
    const classe = `${style.medium__photo} ${style.photo}`
    const [selectedFile, setSelectedFile] = useState([])

    const onChangeHandle = ((e) => {
        const newSelectedFiles = [...selectedFile, e.target.files[0]];
        const filesToUpload = newSelectedFiles.map(file => new File([file], file.name, { type: file.type }));
        onChange(filesToUpload);
        onBlur(filesToUpload);
        setSelectedFile(newSelectedFiles);
        e.target.value = null
    })

    const onClickHandle = ((e) => {
        let index = parseInt(e.target.getAttribute('data-index'))
        var array = [...selectedFile]; // make a separate copy of the array
        if (index !== -1) {
            array.splice(index, 1);
            setSelectedFile(array);
        }
        images.splice(index, 1)
    })

    const onBlurHandle = () => {
        const filesToUpload = selectedFile.map(file => new File([file], file.name));
        onBlur(filesToUpload);
    }

    let images = []
    let inp = null

    if (selectedFile.length < 5) {
        inp = (
            <label className={classes}>
                <input type="file" onChange={onChangeHandle} accept={authorizedImageExtensionsString}/>
                <Icon className={`${styles.icon}`} variant="addCircle" />
            </label>
        )
    }


    for (var i = 0; i < selectedFile.length; i++) {
        images.push(
            <img
                key={i}
                data-index={i}
                className={classe}
                src={window.URL.createObjectURL(selectedFile[i])}
                alt=""
                onClick={onClickHandle}
            />
        )
    }

    return (
        <div className={`${styles.divAdd}`} onBlur={onBlurHandle}>
            <React.Fragment>{images}</React.Fragment>
            {inp}
        </div>
    );
}

export default AddPhoto;