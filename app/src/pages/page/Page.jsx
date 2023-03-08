import React from "react";
import ThemeSelector from "../../components/ui/theme/ThemeSelector";

function Page({ children, className }) {
    return (
        <div className={className}>
            {children}
            <ThemeSelector/>
        </div>
    );
}

export default Page;