import { displayOneByOne, initState } from "../AppConfig"
import { useNavigate } from 'react-router-dom';
import React,{ useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateAuth } from "../reducers/authSlice";
import styles from '../css/login.module.css'
function LogoutUser(){
    let nav = useNavigate();
    const dispatch = useDispatch();
    const LogoutMsg = useRef(null);
    const MainContRef = useRef(null);

    useEffect(()=>{
            MainContRef.current.classList.add(styles.showMainCont)
            localStorage.removeItem("Token")
            dispatch(updateAuth(initState()))
            displayOneByOne("Logout Success",LogoutMsg,45,"failed").then(()=>{
                setTimeout(()=>{
                    nav("/")
                },600)
            })
        },[])
    return(
    <React.Fragment>
    <div className={`${styles.statusBar} ${styles.statusBarRun}`}></div>
    <div className={styles.MainCont} ref={MainContRef}>
    <h1 id={styles.LogoutMsg} ref={LogoutMsg}></h1>    
    </div>
    </React.Fragment>
    )
}
export default LogoutUser