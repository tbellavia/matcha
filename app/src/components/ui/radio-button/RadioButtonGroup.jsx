import RadioButton from "./RadioButton"

function RadioButtonGroup({ values }) {
    return (
        <div id="group1">
            <RadioButton name="group1" value="femme"/>
            <RadioButton name="group1" value="homme"/>
        </div>
    )
}

export default RadioButtonGroup