import React from 'react';
import { displayOneByOne, GetAuth } from "./AppConfig"
import { useEffect,useRef } from "react"
import { changeName, changePassword, deleteAccount } from "./ApiCalls"
import { useNavigate } from "react-router-dom"
import styles from './css/settings.module.css'
function Settings() {
    useEffect(() => {
        MainContRef.current.classList.add(styles.visible)
    })
    const nav = useNavigate();
    const MainContRef = useRef(null),
    nameMessageRef = useRef(null),
    passMessageRef = useRef(null),
    deleteMessageRef = useRef(null),
    cPassRef = useRef(null),
    nPassRef = useRef(null),
    newNameRef = useRef(null),
    passwordToDelete = useRef(null);

    function handleChangePass(event){
        let newpass = nPassRef.current;
        let oldpass = cPassRef.current;
        event.target.setAttribute("disabled", true)
        newpass.setAttribute("disabled", true)
        oldpass.setAttribute("disabled", true)
        changePassword(oldpass.value, newpass.value).then(
            (response) => { displayOneByOne(response.message,passMessageRef, 40, "success") },
            (response) => {
                if (response.status === 401) {
                    nav("/SessionExpired")
                } else {
                    displayOneByOne(response.message,passMessageRef, 40, "failed")
                }
            }
        ).finally(() => {
            event.target.removeAttribute("disabled")
            oldpass.removeAttribute("disabled")
            newpass.removeAttribute("disabled")
        })
    }

    const handleChangeName =  (event) => {
        let name = newNameRef.current;
        name.setAttribute("disabled", true)
        event.target.setAttribute("disabled", true)
        changeName(name.value).then(
            (response) => {
                let auth = GetAuth();
                auth.name = name.value;
                localStorage.setItem("Auth", JSON.stringify(auth))
                displayOneByOne(response.message, nameMessageRef, 40, "success")
            },
            (response) => {
                if (response.status === 401) {
                    nav("/SessionExpired")
                } else {
                    displayOneByOne(response.message, nameMessageRef, 40, "failed")
                }
            }
        ).finally(() => {
            name.removeAttribute("disabled")
            event.target.removeAttribute("disabled")
        })
    }

    const handleDeleteAcc = (event) => {
        let pass = passwordToDelete.current;
        pass.setAttribute("disabled", true)
        event.target.setAttribute("disabled", true)
        deleteAccount(pass.value).then(
            (response) => {
                displayOneByOne(response.message, deleteMessageRef, 40, "success").then(() => {
                    nav("/Logout")
                })
            },
            (response) => {
                if (response.status === 401) {
                    nav("/SessionExpired")
                } else {
                    console.log(response)
                    displayOneByOne(response.message, deleteMessageRef, 40, "failed")
                }
            }
        ).finally(() => {
            pass.removeAttribute("disabled")
            event.target.removeAttribute("disabled")
        })
    }
    return (
        <React.Fragment>
            <div className={`${styles.statusBar} ${styles.statusBarRun}`}></div>
            <div ref={MainContRef}>
                <div className={styles.settingsCard}>
                    <h1>Settings</h1>
                    <hr />

                    <h3>Change Password</h3>
                    <p ref={passMessageRef}></p>
                    <input type="password" selected ref={cPassRef} placeholder="Current Password"></input>
                    <input type="password" ref={nPassRef} placeholder="New Password" className={styles.secinp}></input><br />
                    <button className={`${styles.settingsBtn} ${styles.cng}`} onClick={handleChangePass}>Change Password</button>
                    <h3>Change Name</h3>
                    <p ref={nameMessageRef}></p>
                    <input type="text" ref={newNameRef} placeholder="New name"></input>
                    <button  className={`${styles.settingsBtn} ${styles.cng}`}  onClick={handleChangeName}>Change Name</button>
                    <h3>Delete Account</h3>
                    <p ref={deleteMessageRef}></p>
                    <input type="password" ref={passwordToDelete} placeholder="Password"></input>
                    <button className={`${styles.settingsBtn} ${styles.del}`} onClick={handleDeleteAcc}>Delete Account</button>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Settings