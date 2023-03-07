import Button from "../components/ui/button/Button";
import style from "./Home.module.css";

function Home() {
    return (
        <div className={style.home}>
            <Button variant="regular">inscription</Button>
            <Button variant="validation">valider</Button>
            <Button variant="action-regular">nop</Button>
            <Button variant="action-danger">okay</Button>
        </div>
    );
}

export default Home;