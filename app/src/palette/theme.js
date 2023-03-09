const Theme = {
    LIGHT: "light",
    DARK: "dark",
    COLOR_BLIND: "blind",
    changeBackground: function(theme) {
        const body = document.querySelector("body");

        body.removeAttribute("class");
        body.classList.add(`background__${theme}`);
    },
    getStoredThemeOrDefault: function() {
        return localStorage.getItem("theme") || this.LIGHT;
    },
    saveThemeInLocalStorage: function(theme) {
        localStorage.setItem("theme", theme);
    }
};

export default Theme;