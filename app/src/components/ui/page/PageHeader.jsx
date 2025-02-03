import React from "react";
// import ThemeSelector from "../theme/ThemeSelector";
import Header from "../header/Header";

function PageHeader({ children, className, style }) {
    return (
        <>
            <Header/>
            <div className={className} style={style}>
                {children}
                {/* <ThemeSelector/> */}
            </div>
        </>
    );
}

export default PageHeader;