import {useParams} from "react-router-dom";
import {useEffect} from "react";
import useFetch from "../../hooks/use-fetch";

function GenericProfile({}) {
    const { id } = useParams();
    const fetch = useFetch();

    useEffect(() => {
        async function fetchProfile() {
            const uri = `/api/user/profile/${id}`;
            const response = await fetch(uri);

            console.log(response?.data);
        }
        fetchProfile().then();
    });

    return (
        <h1>Rendering page with id {id}</h1>
    )
}

export default GenericProfile;