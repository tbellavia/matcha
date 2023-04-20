import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../../store/AppContext";
import styles from "./Autocomplete.module.css"

const Autocomplete = ({
    suggest,
    onChange,
    value,
    onSubmit,
    id,
    placeholder,
    onBlur = () => { }
}) => {
    const [autocompleteList, setAutocplete] = useState([])
    const [active, setActive] = useState(-1);
    const [isShow, setIsShow] = useState(false);
    const currentElementRef = useRef();
    const { theme } = useContext(AppContext);

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
        switch (e.keyCode) {
            // Enter
            case 13:
                setActive(-1);
                setIsShow(false);
                if (autocompleteList.length && active > -1)
                    onSubmit(autocompleteList[active])
                else
                    onSubmit(value)
                break;
            // Up Arrow
            case 38:
                return (active === 0) ? null : setActive(active - 1);
            // Down Arrow
            case 40:
                return (active - 1 === autocompleteList.length) ? null : setActive(active + 1);
            // Escape
            case 27:
                setIsShow(false);
                break;
            default:
                break;
        }
    };
    
    const renderAutocompleteList = () => {
        if (isShow && autocompleteList.length) {
            const themeClass = styles[`autocomplete-li__${theme}`];

            return (
                <ul className={styles.autocomplete}>
                    {autocompleteList.map((suggestion, index) => {
                        const activeClass = (index === active) ? styles.active : "";
                        return (
                            <li 
                                className={`${activeClass} ${themeClass}`} 
                                key={index} 
                                onClick={onClickSuggestHandler}
                                ref={(index === active) ? currentElementRef : null}
                            >
                                {suggestion}
                            </li>
                        )
                    })}
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

    const onBlurHandle = (e) => {
        onBlur(e.target.value);
        setTimeout(() => {
            setIsShow(false);
        }, 200);
    }

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
                placeholder={placeholder}
                onBlur={onBlurHandle}
                autoComplete="off"
            />
            {renderAutocompleteList()}
        </div>
    )
}

export default Autocomplete;