import styles from "./Photo.module.css";

function Photo({data, size}){
    const taille = styles[`${size}__photo`]
    const classes = `${styles.photo} ${taille}`
    return (
        <img className={classes} src = {data}/>
    );
}

export default Photo;