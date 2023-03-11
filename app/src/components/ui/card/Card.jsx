function Card({ className, style, children }) {
    return (
        <div className={`${className} round`} style={style}>
            {children}
        </div>
    );
}

export default Card;