import { useEffect,useRef } from "react";
import React from "react";
import { sendFeedback } from "../ApiCalls";
import { displayOneByOne } from "../AppConfig";
import { useNavigate } from "react-router-dom";
import styles from '../css/sendfeedback.module.css'
function SendFeedback(){
    const messageRef = useRef(null),
    MainContRef = useRef(null),
    feedbackRef = useRef(null);
    useEffect(()=>{
       MainContRef.current.classList.add(styles.showMainCont)
    })
    const nav = useNavigate();
    return(
        <React.Fragment>
        <div className={styles.MainCont} ref={MainContRef}>
        <div className={styles.settingsCard}>
        <h1>Send Feedback</h1>
        <hr/>
        <p ref={messageRef}></p>
        <h3>feedback</h3>
        <textarea ref={feedbackRef} rows={10} cols={175} placeholder="Feedback">
        </textarea>
        <button className={`${styles.settingsBtn} ${styles.cng}`} onClick={
            ()=>{
                let desc = feedbackRef.current.value
                if(desc.length != 0){
                    sendFeedback(desc).then(
                        (response)=>{displayOneByOne(response.message,messageRef,40,"success")},
                        (response)=>{
                            if(response.status === 401){
                                nav("/SessionExpired")
                            }else{
                            displayOneByOne(response.message,messageRef,40,"failed")}
                        },
                    )
                }else{
                    
                }
            }
        }>Send Feedback</button>
        </div>
        </div>
        </React.Fragment>
    )
}
export default SendFeedback