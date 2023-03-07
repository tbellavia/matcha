function Card(props) {
    return (
        <div className="round">
            {props.children}
        </div>
    );
}

export default Card;