import { useEffect } from "react";

function useDebounce(fn, ms, deps = []) {
    useEffect(() => {
        const id = setTimeout(fn, ms);

        return () => {
            clearTimeout(id);
        }
    }, [fn, ms, ...deps]);
}

export default useDebounce;