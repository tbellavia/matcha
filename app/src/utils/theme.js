export function changeBackground(theme){
    const body = document.querySelector("body");

    body.removeAttribute("class");
    body.classList.add(`background__${theme}`);
}