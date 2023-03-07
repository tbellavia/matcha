import { useContext } from "react";
import Button from "../components/ui/button/Button";
import style from "./Home.module.css";
import AppContext from "../store/AppContext";

function Home() {
    const ctx = useContext(AppContext);

    const onThemeChange = ({target}) => {
        ctx.setTheme(target.value);
    }

    return (
        <div className={style.home}>
            <select 
                name="theme"
                id="theme"
                className={style.theme}
                onChange={onThemeChange}
            >
                <option value="light">light</option>
                <option value="dark">dark</option>
                <option value="blind">blind</option>
            </select>
            <Button variant="regular">regular</Button>
            <Button variant="validation">validation</Button>
            <Button variant="action-regular">action regular</Button>
            <Button variant="action-danger">action danger</Button>
        </div>
    );
}

export default Home;