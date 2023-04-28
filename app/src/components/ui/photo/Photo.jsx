import styles from "./Photo.module.css";

const sizes = ['little', 'medium', 'large'];

function Photo({ data, size = 'medium' }){
    if (!sizes.includes(size))
        throw new Error(`Photo: invalid size '${size}'`);

    const taille = styles[`${size}__photo`];
    const classes = `${styles.photo} ${taille}`;

    return (
        <img className={classes} src = {data}/>
    );
}

export default Photo;