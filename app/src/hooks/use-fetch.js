import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import AppContext from "../store/AppContext";

export default function useFetch(unauthorizedFallback = "/login"){
    const { token } = useContext(AppContext);
    const navigate = useNavigate();
    const client = axios.create({
        baseURL: "http://localhost:3000",
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
            throw e;
        }
    }
}