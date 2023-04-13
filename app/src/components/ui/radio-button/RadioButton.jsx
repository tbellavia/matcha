function RadioButton({ name, value }) {
    return (
        <div>
            <input id={value} type="radio" name={name} value={value} />
            <label htmlFor={value}>{ value }</label>
        </div>
    );
}

export default RadioButton;