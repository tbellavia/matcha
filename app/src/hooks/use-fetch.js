import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import AppContext from "../store/AppContext";
import { ERROR_BAD_TOKEN, ERROR_NEED_TOKEN, ERROR_PROFILE } from "../common/messages";

const baseURL = "http://localhost:3000";
export default function useFetch(unauthorizedFallback = "/login"){
    const { token } = useContext(AppContext);
    const navigate = useNavigate();
    const client = axios.create({
        baseURL: baseURL,
        headers: { 'Authorization' : `Bearer ${token}` }
    });

    return async (uri, method = "GET", data = {}) => {
        try {
            return await client.request({
                url: uri,
                method,
                data,
            });
        }
        catch (e){
            console.log("here")
            if(e.response && e.response.status === 401){
                console.log("here1")
                return navigate(unauthorizedFallback);
            }
            if(e.response && (e.response.data.message === ERROR_BAD_TOKEN  || e.response.data.message === ERROR_NEED_TOKEN)){
                console.log("here2", e.response.data.message)
                return navigate(unauthorizedFallback);
            }
            if(e.response && (e.response.data.message === ERROR_PROFILE)){
                console.log("here3")
                return navigate("profile/create");
            }
        }
    }
}