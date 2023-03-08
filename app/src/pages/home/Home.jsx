import style from "./Home.module.css";
import Page from "../page/Page";
import HomeBackground from "../../components/home/HomeBackground";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        navigate(e.target.attributes.action.nodeValue)
    }

    return (
        <Page className={style.home}>
            <HomeBackground>
                <div className={style['button-box']}>
                    <form action="/login" onSubmit={onSubmitHandler}>
                        <Button variant="regular" type="submit">connexion</Button>
                    </form>
                    <form action="/signup" onSubmit={onSubmitHandler}>
                        <Button variant="regular" type="submit">inscription</Button>
                    </form>
                </div>
            </HomeBackground>
        </Page>
    );
}

export default Home;