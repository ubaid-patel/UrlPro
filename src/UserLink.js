import { useNavigate } from "react-router-dom";
import { DeleteLink, saveChanges } from "./ApiCalls";
import { useEffect, useRef, useState } from "react";
import React from "react";
import styles from "./css/userLinkDesktop.module.css"
import { convertDateToIST } from "./AppConfig";
function UserLink({ link, deleteLink }) {
    const nav = useNavigate();

    //Refs for storing dom nodes
    const copyBtnRef = useRef(null);
    const titleRef = useRef(null);
    const linkRef = useRef(null);
    const moreOptsRef = useRef(null);
    const infoRef = useRef(null);
    const messageRef = useRef(null)

    //Logic and state for Delete Confirmation
    const [isDelete, setDelete] = useState(false);
    useEffect(() => {
        if (isDelete) {

        }
    }, [isDelete])

    //logic and state that makes link and title editable
    const previousValues = useRef([]);
    const [isEditable, setEditable] = useState(false);
    useEffect(() => {
        if (isEditable) {
            titleRef.current.removeAttribute("disabled");
            linkRef.current.removeAttribute("disabled");
            previousValues.current.push(titleRef.current.value)
            previousValues.current.push(linkRef.current.value)
        } else {
            titleRef.current.setAttribute("disabled", true)
            linkRef.current.setAttribute("disabled", true)
        }
    }, [isEditable])

    //logic and state for showing and hiding moreOptions
    const [isMoreOptsVisible, setMoreOptsVisible] = useState(false);
    useEffect(() => {
        if (isMoreOptsVisible) {
            moreOptsRef.current.classList.add(styles.expandOpts)
        } else {
            moreOptsRef.current.classList.remove(styles.expandOpts)
        }
    }, [isMoreOptsVisible])

    function AnimateCopyButton() {
        new Promise((resolve) => {
            copyBtnRef.current.src = "static/tick.png";
            copyBtnRef.current.setAttribute("disabled", "true");
            setTimeout(resolve, 3000)
        }).then(
            () => {
                copyBtnRef.current.src = "static/mcopy.png";
                copyBtnRef.current.removeAttribute("disabled")
            }
        )
    }

    function copyLink() {
        AnimateCopyButton();
        var input = document.createElement('input');
        input.setAttribute('value', window.location.origin + "/" + link.endpoint);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }

    return (
        <React.Fragment>
            {/* Table Row that includes links and button */}
            <tr>
                <td className={styles.td}>
                    <input className={styles.input} type={"text"} ref={titleRef} defaultValue={link.title} disabled />
                </td>
                {/* urlInput,Errormessage  */}
                <td className={styles.td} style={{ position: "relative" }}>
                    {/* Error message */}
                    <div className={styles.errorMessage} ref={messageRef} onClick={() => {
                        messageRef.current.classList.remove(styles.expandMessage)
                    }}>
                        Invalid url. <img src="static/close.svg" onClick={() => {
                            messageRef.current.classList.remove(styles.expandMessage)
                        }} />
                    </div>
                    <input className={styles.input} type={"text"} ref={linkRef} defaultValue={link.url} disabled />
                </td>
                {(isEditable) ?
                    // Cancel and save Button 
                    <React.Fragment>
                        <td>
                            <button className={`${styles.actbtn} ${styles.cancelbtn}`} onClick={() => {
                                //Restoring previous values
                                linkRef.current.value = previousValues.current.pop();
                                titleRef.current.value = previousValues.current.pop();
                                setEditable(false);
                                //disableing moreopts here because it is available when isEditable=false
                                setMoreOptsVisible(false);
                            }}>
                                <img src="/static/cancel.png" />
                            </button>
                            <button className={`${styles.actbtn} ${styles.savebtn}`} onClick={() => {
                                const urlRegex = /^(ftp|http|https):\/\/[^ "]+\.[^ "]{2,}\/?[^\s]*$/;
                                if (urlRegex.test(linkRef.current.value)) {
                                    saveChanges(link.endpoint, titleRef.current.value, linkRef.current.value).then(
                                        (response) => {
                                            setEditable(false)
                                            //disableing moreopts here because it is available when isEditable=false
                                            setMoreOptsVisible(false);
                                        },
                                        (response) => {
                                            nav("/SessionExpired")
                                        }
                                    )
                                } else {
                                    messageRef.current.classList.add(styles.expandMessage)
                                }

                            }}>
                                <img src="/static/save.png" />
                            </button>
                        </td>
                    </React.Fragment>
                    :
                    // Copy Button,Expand Button,More Options,Delete Confirm
                    <React.Fragment>
                        <td style={{ position: "relative" }}>
                            <button className={styles.actbtn} onClick={copyLink}>
                                <img src="/static/mcopy.png" ref={copyBtnRef} className={"copy" + link.endpoint} />
                            </button>

                            <button className={styles.actbtn} onClick={() => {
                                (isMoreOptsVisible ? setMoreOptsVisible(false) : setMoreOptsVisible(true))
                            }}>
                                <img src="/static/expand.png" />
                            </button>


                            <div className={styles.moreOptions} ref={moreOptsRef}>

                                {(isDelete ?
                                    <ul className={styles.deleteConfirm}>
                                        <li>..Delete?</li>
                                        <li>
                                            <button className={styles.done} onClick={() => { deleteLink(link.endpoint) }}>
                                                <img src="static/done.svg"></img>
                                            </button>
                                            <button className={styles.cancel} onClick={() => {
                                                // Here Promise is used to first tooggle down confim and then set Isdelete false
                                                new Promise(
                                                    (resolve, reject) => {
                                                        setMoreOptsVisible(false)
                                                        setTimeout(resolve, 500)
                                                    }
                                                ).then(
                                                    () => {
                                                        setDelete(false)
                                                    }
                                                )

                                            }}>
                                                <img src="static/cancel.png"></img>
                                            </button>
                                        </li>
                                    </ul>

                                    :

                                    <ul>
                                        <li onClick={() => { setEditable(true) }}>Edit</li>
                                        <li onClick={() => {
                                            // deleteLink(link.endpoint) 
                                            setDelete(true)
                                        }}>Delete</li>
                                        <li onClick={() => {
                                            setMoreOptsVisible(false);
                                            infoRef.current.classList.toggle(styles.infoCardAnimate)
                                        }
                                        }>Info</li>
                                    </ul>
                                )}
                            </div>
                        </td>
                    </React.Fragment>
                }
            </tr>
            {/* Table Row that includes infoMation */}
            <tr>
                <td colSpan={3}>
                    <div ref={infoRef} className={styles.infoCard}>
                        <button className={`${styles.cancelbtn} ${styles.actbtn} ${styles.infoclose}`} onClick={
                            () => {
                                infoRef.current.classList.toggle(styles.infoCardAnimate)
                            }
                        }>
                            <img src="/static/cancel.png" />
                        </button>
                        <h3>Title:</h3>{link.title}<br />
                        <h3>Link:</h3>{window.location.origin + "/" + link.endpoint}<br />
                        <h3>Redirect Url:</h3>{link.url}<br />
                        <h3>Visits:</h3>{link.views}<br />
                        <h3>Created on:</h3>{convertDateToIST(link.createdOn)}
                    </div>
                </td>
            </tr>
        </React.Fragment>
    )
}
export default UserLink;