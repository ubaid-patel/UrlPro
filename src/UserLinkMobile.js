import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveChanges } from "./ApiCalls";
import React from "react";
import styles from './css/userlinkMobile.module.css'
import Message from "./Message";
const UserLinkMobile = ({ link, deleteLink }) => {
    const nav = useNavigate();

    const copyBtnRef = useRef(null);
    const titleRef = useRef(null);
    const linkRef = useRef(null);
    const moreOptsRef = useRef(null);
    const infoRef = useRef(null);
    const messageRef = useRef(null);
    const [message,setMessage] = useState({visible:false,content:"",type:'success'})

    //logic and state that makes link and title editable
    const [isEditable, setEditable] = useState(false);
    const previousValues = useRef([]);
    useEffect(() => {
        if (isEditable) {
            titleRef.current.removeAttribute("disabled");
            linkRef.current.removeAttribute("disabled");
            previousValues.current.push(titleRef.current.value);
            previousValues.current.push(linkRef.current.value);
            setMoreOptsVisible(false)
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
            moreOptsRef.current.classList.remove(styles.expandOpts);
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
    //Confirm delete state and logic
    const [isConfirmDelete, setConfirmDelete] = useState(false);
    useEffect(() => {
        if (isMoreOptsVisible) {
            moreOptsRef.current.classList.add(styles.expandOpts)
        }
    }, [isConfirmDelete,isMoreOptsVisible])

    //Copy link using dom and execCommand
    function copyLink() {
        AnimateCopyButton();
        var input = document.createElement('input');
        input.setAttribute('value', window.location.origin + "/" + link.endpoint);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
    const handleSave = () => {
        let title = titleRef.current.value;
        let url = linkRef.current.value;
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+\.[^ "]{2,}\/?[^\s]*$/;
        if(!title.trim() == ''){
            if (urlRegex.test(url)) {
                saveChanges(link.endpoint, title, url).then(
                    (value) => {
                        setEditable(false)
                    },
                    (status, message) => {
                        if (status === 401) {
                            nav("/SessionExpired")
                        } else {
                            console.log(message)
                        }
                    }
                )
            } else {
                setMessage({visible:true,content:"Invalid Url",type:"error"})
            }
        }
        else{
            setMessage({visible:true,content:"Invalid title",type:"error"})
        }
    }
    return (
        <React.Fragment>
            {/* title input */}
            <tr>
                <td colSpan={2}>
                    <input type={"text"} className={styles.input} defaultValue={link.title} ref={titleRef} disabled />
                </td>
            </tr>
            {/* Error message Link inpiut */}
            <tr>
                <td colSpan={2} style={{ position: 'relative' }}>
                    {/* Error message */}
                    <div className={styles.errorMessage} ref={messageRef}>
                        <Message message={message} setMessage={setMessage}></Message>
                    </div>
                    <input type="text" className={styles.input} defaultValue={link.url} ref={linkRef} disabled />
                </td>
            </tr>
             {/*Cancel btn,Copy Btn, ConfirmDelete,MoreOptions,Save btn,expand,btn */}
            <tr>
                <td>
                    {(isEditable ?
                        <button className={`${styles.actbtn} ${styles.cancelbtn}`} onClick={() => {
                            //Restore previous values
                            linkRef.current.value = previousValues.current.pop();
                            titleRef.current.value = previousValues.current.pop();
                            setEditable(false)
                        }}>
                            <img src="/static/cancel.png" />
                        </button> :
                        <button onClick={copyLink} className={styles.actbtn}>
                            <img src="/static/mcopy.png" ref={copyBtnRef} />
                        </button>)}
                </td>
                <td style={{ position: "relative" }}>
                    {(isConfirmDelete ?
                        <div ref={moreOptsRef} className={styles.confirmDelete}>
                            <ul>
                                <li>..Delete?</li>
                                <li>
                                    <button className={styles.done} onClick={() => { deleteLink(link.endpoint) }}>
                                        <img src="static/done.svg"></img>
                                    </button>
                                    <button className={styles.cancel} onClick={() => {
                                        //    usingPrmise to hide confirmDelete and Moreoptions sequentially
                                        new Promise((resolve, reject) => {
                                            setMoreOptsVisible(false)
                                            setTimeout(resolve, 400)
                                        }).then(() => {
                                            setConfirmDelete(false)
                                        })
                                    }}>
                                        <img src="static/cancel.png"></img>
                                    </button>
                                </li>
                            </ul>
                        </div> :
                        <div ref={moreOptsRef} className={styles.moreOptions}>
                            <ul>
                                <li onClick={() => { setEditable(true) }}>Edit</li>
                                <li onClick={() => { setConfirmDelete(true); }}>Delete</li>
                                <li onClick={() => { setMoreOptsVisible(false); infoRef.current.classList.toggle(styles.infoCardAnimate) }}>Info</li>
                            </ul>
                        </div>)}
                    {(isEditable ?
                        <button className={`${styles.actbtn} ${styles.savebtn}`} onClick={handleSave}>
                            <img src="/static/save.png" />
                        </button> :
                        <button onClick={() => { (isMoreOptsVisible ? setMoreOptsVisible(false) : setMoreOptsVisible(true)) }} className={styles.actbtn}>
                            <img src="/static/expand.png" />
                        </button>
                    )}
                </td>
            </tr>

            {/** Table row for Info card**/}
            <tr>
                <td colSpan={2}>
                    <div className={styles.infoCard} ref={infoRef}>
                        <button className={styles.infoClose} onClick={
                            () => { infoRef.current.classList.toggle(styles.infoCardAnimate) }
                        }>
                            <img src="/static/cancel.png" />
                        </button>
                        <h3>Title:</h3>
                        {link.title}<br />
                        <h3>Link:</h3>
                        {window.location.origin + "/" + link.endpoint}<br />
                        <h3>Redirect Url:</h3>
                        {link.url}<br />
                        <h3>Visits:</h3>
                        {link.views}<br />
                        <h3>Created on:</h3>
                        {link.createdOn}
                    </div >
                </td>
            </tr>
        </React.Fragment >
    )
}
export default UserLinkMobile