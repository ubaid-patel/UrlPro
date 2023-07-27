import React, { useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Admin from "./Admin";
import LinksManagement from "./LinksManagement";
import { useSelector } from "react-redux";
import { selectAuth } from "../reducers/authSlice";
import styles from '../css/dashboard.module.css'

function DashBoard() {
    let navigate = useNavigate();
    const auth = useSelector(selectAuth);

    //reference for mainDiv for animation
    const maincomp = useRef(null)

    //the below code will perform userLoggenin checkup and some animations
    useEffect(() => {

        if (auth.isLoggedIn || auth.token) {
            maincomp.current.classList.add(styles.visible)
        } else {
            navigate("/")
        }
    }, []);


    //it will return of sum of all link views
    function countViews() {
        let views = 0
        let links = auth.links;
        for (let link of links) {
            views += link.views
        }
        return views
    }
    return (
        <React.Fragment>
            <div className={`${styles.statusBar} ${styles.statusBarRun}`}></div>
            <div className={styles.MainCont} ref={maincomp} key={"Dashboard"}>
                <h1>Hi {auth.name}</h1>
                <div className={`${styles.dash} ${styles.flex}`}>
                    <div className={styles.DashCards}>
                        <h1>Total Links</h1>
                        <h1>{auth.links.length}</h1>
                    </div>
                    <div className={styles.DashCards}>
                        <h1>Total Visits</h1><h1>{countViews()}</h1>
                    </div>
                </div>
                <LinksManagement />
                {
                    (auth.users && <Admin />)
                }
            </div>
        </React.Fragment>
    )
}
export default DashBoard;