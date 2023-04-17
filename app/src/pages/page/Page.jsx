import React from "react";
import ThemeSelector from "../../components/ui/theme/ThemeSelector";

function Page({ children, className, style }) {
    return (
        <div className={className} style={style}>
            {children}
            <ThemeSelector/>
        </div>
    );
}

export default Page;