import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../store/AppContext";

export default function useLogin() {
    const navigate = useNavigate();
    const ctx = useContext(AppContext);

    return async (mail, password) => {
        const response = await axios.post("http://localhost:3000/api/user/login", {
            usermail: mail,
            passWord: password
        });

        const data = response?.data;
        
        ctx.setIsLoggedIn(true);
        ctx.setUserID(data.id_user);
        if (data.profile_created){
            navigate("/feed");
        } else {
            navigate("/profile/create");
        }
    }
}