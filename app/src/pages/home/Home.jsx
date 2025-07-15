import style from "./Home.module.css";
import GenericPage from "../page/GenericPage";
import HomeBackground from "../../components/home/HomeBackground";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router-dom";
import AppContext from "../../store/AppContext";
import { useContext, useEffect } from "react";
import { hasCreatedProfile, isValideToken } from "../../common/utils";

function Home() {
    const navigate = useNavigate();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        navigate(e.target.attributes.action.nodeValue)
    }

    const ctx = useContext(AppContext);


    useEffect(() => {
        if (ctx.token && isValideToken(ctx.token)) {
            if (!hasCreatedProfile(ctx.token)){
                navigate("/profile/create")
            }
            else{
                navigate("/feed")
            }
        }
        // eslint-disable-next-line
      }, [])

    return (
        <GenericPage className={style.home}>
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
        </GenericPage>
    );
}

export default Home;