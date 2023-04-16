import styles from "./Header.module.css";

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles["header__bar"]}></div>
            <h1>MATCHA</h1>
            <div className={styles["header__bar"]}></div>
        </header>
    );
}

export default Header;