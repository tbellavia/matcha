import React, { useEffect, useRef, useState } from "react";
import styles from "./Autocomplete.module.css"

const Autocomplete = ({
    suggest,
    onChange,
    value,
    onSubmit,
    id
}) => {
    const [autocompleteList, setAutocplete] = useState([])
    const [active, setActive] = useState(-1);
    const [isShow, setIsShow] = useState(false);
    const currentElementRef = useRef();

    useEffect(() => {
        if (currentElementRef.current) {
            currentElementRef.current.scrollIntoView();
        }
    });

    const onChangeHandler = (event) => {
        const input = event.currentTarget.value;
        const newAutocompleteList = suggest.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
        );
        setActive(-1);
        setAutocplete(newAutocompleteList);
        setIsShow(true);
        onChange(event.target.value)
    };

    const onClickSuggestHandler = e => {
        setActive(-1);
        setAutocplete([]);
        setIsShow(false);
        onSubmit(e.currentTarget.innerText)
    };

    const onKeyDownHandler = e => {
        if (e.keyCode === 13) {
            setActive(-1);
            setIsShow(false);
            if (autocompleteList.length && active > -1) {
                onSubmit(autocompleteList[active])
            }
            else {
                onSubmit(value)
            }
        }
        else if (e.keyCode === 38) {
            return (active === 0) ? null : setActive(active - 1);
        }
        else if (e.keyCode === 40) {
            return (active - 1 === autocompleteList.length) ? null : setActive(active + 1);
        }
    };
    
    const renderAutocompleteList = () => {
        if (isShow && autocompleteList.length) {
            return (
                <ul className={styles.autocomplete} >
                    {autocompleteList.map((suggestion, index) => (
                        <li 
                            className={(index === active) ? styles.active : ""} 
                            key={index} 
                            onClick={onClickSuggestHandler}
                            ref={(index === active) ? currentElementRef : null}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            );
        }
    }

    const onClickHandler = e => {
        const newAutocompleteList = suggest.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
        setActive(-1);
        setAutocplete(newAutocompleteList);
        setIsShow(true);
    };

    return (
        <div className={styles['autocomplete-container']}>
            <input
                className={styles['autocomplete-input']}
                type="text"
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                onClick={onClickHandler}
                value={value}
                id={id}
            />
            {renderAutocompleteList()}
        </div>
    )
}

export default Autocomplete;