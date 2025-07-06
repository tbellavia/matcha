import styles from "./Photo.module.css";

const sizes = ['little', 'medium', 'feedSize', 'large'];

function Photo({ data, size = 'medium', onClick=()=>{}, color="light"}){

    if (!sizes.includes(size))
        throw new Error(`Photo: invalid size '${size}'`);

    const taille = styles[`${size}__photo`];
    const classes = `${styles.photo} ${taille} ${styles[`${color}__color`]}`;

    return (
        <img alt="" className={classes} src = {data} onClick={onClick}/>
    );
}

export default Photo;