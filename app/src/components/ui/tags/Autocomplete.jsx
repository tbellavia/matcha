import React, { useState } from "react";
import styles from "./Autocomplete.module.css"

const Autocomplete =  (props) => {
    const {suggest, setInput, input, valideValue} = props;
    const [autocompleteList, setAutocplete] = useState([])
    const [active, setActive] = useState(-1);
    const [isShow, setIsShow] = useState(false);

    const onChange = (event) => {
        const input = event.currentTarget.value;
        const newAutocompleteList = suggest.filter(
        suggestion =>
            suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
        );
        setActive(-1);
        setAutocplete(newAutocompleteList);
        setIsShow(true);
        setInput(event.target.value)
        console.log(event.target.value)
    };
    const onClickSuggest = e => {
        setActive(-1);
        setAutocplete([]);
        setIsShow(false);
        valideValue(e.currentTarget.innerText)
    };
    const onKeyDown = e => {
        if (e.keyCode === 13) {
            setActive(-1);
            setIsShow(false);
            if(autocompleteList.length && active > -1){
                valideValue(autocompleteList[active])}
            else{
                valideValue(input)
            }
        }
        else if (e.keyCode === 38) {
            return (active === 0) ? null : setActive(active - 1);
        }
        else if (e.keyCode === 40) {
            return (active - 1 === autocompleteList.length) ? null : setActive(active + 1);
        }
    };
    const renderAutocomplete = () => {
        if (isShow) {
            if (autocompleteList.length) {
                return (
                <ul className={styles.autocomplete} >
                    {autocompleteList.map((suggestion, index) => {
                    let className;
                    if (index === active) {
                        className= styles.active;
                    }
                    return (
                        <li className={className} key={suggestion} onClick={onClickSuggest}>
                        {suggestion}
                        </li>
                    );
                    })}
                </ul>
                );
            } 
        }
        return <></>;
    }
    const onClick = e => {
        const newAutocompleteList = suggest.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
            );
        setActive(-1);
        setAutocplete(newAutocompleteList);
        setIsShow(true);
    };

    return (
    <>
        <input
            type="text"
            onChange={onChange}
            onKeyDown={onKeyDown}
            onClick={onClick}
            value={input}
            
        />
        {renderAutocomplete()}
    </>)
}

export default Autocomplete;