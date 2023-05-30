export function getItemOrDefault(key, defaultValue) {
    const item = localStorage.getItem(key);

    if (item === undefined){
        return defaultValue;
    }
    return item;
}