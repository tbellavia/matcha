import React, { useContext } from 'react';
import Label from '../../label/Label';
import { Slider } from '@mui/material';
import styles from "./DoubleSlider.module.scss";
import _ from 'lodash';
import AppContext from '../../../../store/AppContext';

const DoubleSlider = ({ 
    value, 
    onChange = () => {}, 
    label, 
    min, 
    max, 
    suffix = ""
}) => 
{
    if (!_.isArray(value)) {
        throw new Error(`DoubleSlider: value must be an array.`);
    }
    if (value.length !== 2){
        throw new Error(`DoubleSlider: value must contain two values but ${value.length} given`);
    }
    const { theme } = useContext(AppContext);

    const handleSliderChange = (event) => {
        onChange(event.target.value);
    }

    return (
        <div className={styles['double-slider']}>
            <Label label={label} />
            <Slider 
                value={value} 
                onChange={handleSliderChange}
                min={min}
                max={max}
                sx={{ color: `var(--color-${theme}-9)` }}
            />
            <div>
                <span className={styles[`label-${theme}`]}>
                    {`${value[0]} ${suffix}`}
                </span>
                <span className={styles[`label-${theme}`]}>
                    {`${value[1]} ${suffix}`}
                </span>
            </div>
        </div>
    )
}

export default DoubleSlider