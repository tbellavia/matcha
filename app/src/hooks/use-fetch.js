import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import AppContext from "../store/AppContext";
import { ERROR_BAD_TOKEN, ERROR_NEED_TOKEN, ERROR_PROFILE } from "../common/messages";

const baseURL = "http://localhost:3000";
export default function useFetch(unauthorizedFallback = "/"){
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
            if(e.response && e.response.status === 401){
                return navigate(unauthorizedFallback);
            }
            if(e.response && (e.response.data.message === ERROR_BAD_TOKEN  || e.response.data.message === ERROR_NEED_TOKEN)){
                return navigate(unauthorizedFallback);
            }
            if(e.response && (e.response.data.message === ERROR_PROFILE)){
                return navigate("/profile/create");
            }
        }
    }
}