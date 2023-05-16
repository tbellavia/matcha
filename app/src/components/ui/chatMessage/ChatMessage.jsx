import styles from "./ChatMessage.module.css"
import Message from "./Message"
import { useRef } from "react";
import React , { useEffect } from "react";

function ChatMessage({me, allChat}){
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
        console.log("test")
        }
    }, [allChat]);

    return(
        <div className={styles.chatMessage} ref={chatRef} >
            {allChat.map((elem, index) =>
            <Message me={me == elem.user} key={index}>{elem.message}</Message>
            )}
        </div>
    )
}

export default ChatMessage