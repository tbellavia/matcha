import style from "./Home.module.css";
import Page from "../page/Page";
import HomeBackground from "../../components/home/HomeBackground";
import Button from "../../components/ui/button/Button";

function Home() {
    return (
        <Page className={style.home}>
            <HomeBackground>
                <div className={style['button-box']}>
                    <Button variant="regular">connexion</Button>
                    <Button variant="regular">inscription</Button>
                </div>
            </HomeBackground>
        </Page>
    );
}

export default Home;