import Header from "../header/Header";

function PageHeader({ children, className, style }) {
    return (
        <>
            <Header/>
            <div className={className} style={style}>
                {children}
            </div>
        </>
    );
}

export default PageHeader;