import FilterModal from "../../components/ui/filters/FilterModal";
import {useContext, useState} from "react";
import { Button } from "@mui/material";
import AppContext from "../../store/AppContext";
import AppDropdown from "../../components/ui/drawer-menu/AppDropdown";
import GenericPage from "../page/GenericPage";
import styles from "./Test.module.css";

function Test() {
    const ctx = useContext(AppContext);
    const style = {
        display: "flex",
        justiyContent: "center",
        alignItems: "center",
        padding: "100px"
    }
    const [open, setOpen] = useState(false);

    const onModalOpen = () => setOpen(true);
    const onModalClose = (params) => {
        console.log("Params: ", params);
        setOpen(false);
    }

    return (
        <GenericPage className={styles.test} style={style}>
            <AppDropdown/>
            <Button onClick={onModalOpen}>Open Filter</Button>
            <FilterModal open={open} onClose={onModalClose}/>
        </GenericPage>
    );
}

export default Test;
