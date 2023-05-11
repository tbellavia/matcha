import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import AppContext from "../store/AppContext";

export default async function useFetch(url, verb, payload){
    const navigate = useNavigate()
    const ctx = useContext(AppContext);
    if(!payload){
        payload = {}
    }
    if(!payload.headers){
        payload.headers = {}
    }
    payload.headers.Authorization = `Bearer ${ctx.token}`
    try {
        switch (verb){
            case "GET":
                return await axios.get(url, payload)
            case "POST":
                return await axios.post(url, payload)
            case "PUT":
                return await axios.put(url, payload)
            case "DELETE":
                return await axios.delete(url,payload)
            default:
                throw new Error("unknown http verb")
        }
    }
    catch (e){
        if(e.response.status === 401){
            navigate("/login")
        }
    }
        
}