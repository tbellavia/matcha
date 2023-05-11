import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import AppContext from "../store/AppContext";

export default function useFetch(){
    const ctx = useContext(AppContext);
    const navigate = useNavigate()

    return async (uri, verb, payload) => {
        const url = `http://localhost:3000${uri}`
    
        if(!payload){
            payload = {}
        }
        if(!payload.headers){
            payload.headers = {}
        }
        payload.headers.Authorization = `Bearer ${ctx.token}`
        console.log(url);
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
            console.log(e);
            if(e.response.status === 401){
                navigate("/login")
            }
        }
    }
}