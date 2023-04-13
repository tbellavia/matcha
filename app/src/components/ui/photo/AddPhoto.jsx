import styles from "./AddPhoto.module.css";
import style from "./Photo.module.css";
import { useState } from "react";
import React from "react";
import Icon from "../icons/Icon";

function AddPhoto() {
    const classes = `${styles.addPhoto}`
    const classe = `${style.medium__photo} ${style.photo}`
    const [selectedFile, setSelectedFile] = useState([])

    const onChangeHandle = ((e) => {
        console.log(e)
        setSelectedFile([...selectedFile, e.target.files[0]])
        e.target.value = null
    }
    )

    const onClickHandle = ((e) => {
        console.log(e.target.getAttribute('data-index'))
        let index = parseInt(e.target.getAttribute('data-index'))
        var array = [...selectedFile]; // make a separate copy of the array
        if (index !== -1) {
            array.splice(index, 1);
            setSelectedFile(array);
        }
        images.splice(index, 1)
    }
    )

    let images = []
    let inp = null

    if (selectedFile.length < 5) {
        inp = <label className={classes}>
            <input
                type="file"
                onChange={onChangeHandle} />
            <Icon className={`${styles.icon}`} variant="addCircle" />
        </label>
    }


    for (var i = 0; i < selectedFile.length; i++) {
        images.push(<img key={i} data-index={i}
            className={classe}
            src={window.URL.createObjectURL(selectedFile[i])}
            onClick={onClickHandle} />)
    }

    return (
        <div className={`${styles.divAdd}`}>
            <React.Fragment>{images}</React.Fragment>
            {inp}

        </div>
    );
}

export default AddPhoto;