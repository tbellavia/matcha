import styles from "./Carousel.module.css"
import { useState } from "react";
import React from "react";
import Photo from "./Photo";

function Carousel({ tabPhotos }) {
    const [checkedPhotos, setcheckedPhotos] = useState(0)

    const onChangeHandle = ((e) => {
        setcheckedPhotos(parseInt(e.target.id))
    })

    let inputs = []
    let inputs2 = []
    for (var i = 0; i < tabPhotos.length; i++) {
        inputs.push(
            <React.Fragment key={i}>
                <input type="radio" className={`${styles.inputCarousel}`} name="a" id={`${i}`} checked={checkedPhotos === i} onChange={onChangeHandle} />
                <label className={`${styles.labelCarousel}`} htmlFor={`${i}`} ></label>
                <div className={`${styles.ci}`}>
                    <img src={tabPhotos[i]} alt="Snow on leafs" />
                </div>
            </React.Fragment>
        )

        inputs2.push(
            <Photo key={i} data={tabPhotos[i]} size="large" />
        )
    }

    return (
        <div>
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