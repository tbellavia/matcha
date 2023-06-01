import React, { useContext } from 'react'
import Label from '../../label/Label'
import { Slider } from '@mui/material'
import styles from "./SingleSlider.module.scss";
import AppContext from '../../../../store/AppContext';

const SlingleSlider = ({ 
    onChange, label, suffix = "",
    // Slider parameters
    ...sliderProps
}) => {
    const { theme } = useContext(AppContext);
    const handleSliderChange = (event) => {
        onChange(event.target.value);
    }

    return (
        <div className={styles['single-slider']}>
            <Label label={label} />
            <div>
                <Slider onChange={handleSliderChange} {...sliderProps} sx={{ color: `var(--color-${theme}-9)` }}/>
                <span className={styles[`label-${theme}`]}>
                    {`${sliderProps.value} ${suffix}`}
                </span>
            </div>
        </div>
    )
}

export default SlingleSlider