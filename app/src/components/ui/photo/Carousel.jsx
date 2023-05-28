import styles from "./Carousel.module.css"
import { useState } from "react";
import React from "react";
import Photo from "./Photo";
import { base64ToFile } from "../../../common/utils";

function Carousel({ tabPhotos }) {
    const [checkedPhotos, setcheckedPhotos] = useState(0)
    const filteredPhotos = tabPhotos.filter(item => item !== null);

    const onChangeHandle = ((e) => {
        setcheckedPhotos(parseInt(e.target.id))
    })

    let inputs = []
    let inputs2 = []
    for (var i = 0; i < filteredPhotos.length; i++) {
        inputs.push(
            <React.Fragment key={i}>
                <input type="radio" className={`${styles.inputCarousel}`} name="a" id={`${i}`} checked={checkedPhotos === i} onChange={onChangeHandle} />
                <label className={`${styles.labelCarousel}`} htmlFor={`${i}`} ></label>
                <div className={`${styles.ci}`}>
                    <Photo key={i} data={base64ToFile(filteredPhotos[i])} size="large" />
                </div>
            </React.Fragment>
        )

        inputs2.push(
            <Photo key={i} data={base64ToFile(filteredPhotos[i])} size="large" />
        )
    }

    return (
        <div className={styles['carousel-container']}>
            <div className={`${styles["carousel"]}`}>
                {inputs}
            </div>
            <div className={`${styles["scroll"]}`}>
                {inputs2}
            </div>
        </div>
    )
}

export default Carousel;