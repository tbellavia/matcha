import { useEffect } from "react";

function useDebounce(fn, ms, deps = []) {
    useEffect(() => {
        const id = setTimeout(fn, ms);

        return () => {
            clearTimeout(id);
        }
    }, deps);
}

export default useDebounce;