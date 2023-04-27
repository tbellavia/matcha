import styles from "./Test.module.css";
import GenericPage from "../page/GenericPage";
import LocationInput from "../../components/ui/location/LocationInput";

function Test() {
    const style = {
        display: "flex",
        justiyContent: "center",
        alignItems: "center",
        padding: "100px"
    }

    const onClickHandler = () => {
        console.log("Clicked!");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Success!");
                console.log(position);
            },
            (error) => {
                console.log("Error getting geolocation!");
                console.log(error);
            }
        );
    }

    return (
        <GenericPage className={styles.test} style={style}>
            <LocationInput/>
        </GenericPage>
    );
}

export default Test;
