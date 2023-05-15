import { useContext } from "react"
import styles from "./Message.module.css"
import AppContext from "../../../store/AppContext"

function Message({children, me}){
    const ctx = useContext(AppContext)
    return(
        <div className={`${styles[`boxMessage${me}`]} ${styles.boxMessage}`}>
            <div className={`${styles[`message${me}__${ctx.theme}`]} ${styles.message}`}>
                {children}
            </div>
        </div>
    )
}

export default Message