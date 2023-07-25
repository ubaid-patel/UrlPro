import { displayOneByOne, GetAuth } from "./AppConfig"
import { CreateLink } from "./ApiCalls";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteLink } from "./ApiCalls";
import UserLink from "./UserLink";
import { mainstore } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, updateAuth, updateLinks } from "./reducers/authSlice";
import { RefreshData } from "./ApiCalls";
import { useMediaQuery } from "react-responsive";
import UserLinkMobile from "./UserLinkMobile";
import styles from './css/linkManagement.module.css'
import Message from "./Message";

function LinksManagement() {
    const resultRef = useRef(null)
    const urlRef = useRef(null)
    const titleRef = useRef(null)
    const btnLoaderRef = useRef(null)
    const messageRef = useRef(null)

    //check device
    const isMobileDevice = useMediaQuery({ query: '(max-width:600px)' });

    const auth = useSelector(selectAuth);
    const alllinks = auth.links;
    const dispatch = useDispatch();

    const [messageType,setMessageType] = useState('SUCCESS');
    const [sortOption, setSortOption] = useState("date");
    const [sortType, setSortType] = useState("ascending");
    const[message,setMessage]=useState({type:"",content:"",visible:false})

    useEffect(() => {
        if (sortType !== 'descending' && document.getElementById(sortOption + "Arrow").classList.contains("upwardArrowRotate")) {
            setSortType("descending");
            dispatch(updateLinks(applySorting()))
        } else if (sortType == 'descending' && !document.getElementById(sortOption + "Arrow").classList.contains("upwardArrowRotate")) {
            dispatch(updateLinks(applySorting()))
            setSortType("ascending");
        }
    }, [sortOption])

    useEffect(() => {
        dispatch(updateLinks(applySorting()))
    }, [sortType])

    const applySorting = () => {
        const links = [...alllinks];
        switch (sortOption) {
            case 'date':
                switch (sortType) {
                    case 'descending':
                        links.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
                        break;
                    case 'ascending':
                        links.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
                        break;
                }
                break;
            case 'views':
                switch (sortType) {
                    case 'descending':
                        links.sort((a, b) => a.views - b.views)
                        break;
                    case 'ascending':
                        links.sort((a, b) => b.views - a.views)
                        break;
                }
                break;
        }
        return (links)
    }
    let Nav = useNavigate();

    function deleteLink(endpoint) {
        DeleteLink(endpoint).then(
            () => {
                let newlinks = alllinks.filter(link => link.endpoint !== endpoint)
                dispatch(updateLinks(newlinks))
            },
            (response) => {
                if (response.status === 401) {
                    Nav("/SessionExpired")
                }
            }
        )
    }

    function sortLinks(from) {
        if (sortOption == 'date' && from === "fromDate") {
            const toggled = document.getElementsByClassName("upwardArrow").item(0).classList.toggle("upwardArrowRotate");
            if (toggled == true) {
                setSortType("descending");
            } else {
                setSortType("ascending")
            }

        } else if (sortOption === 'views' && from === "fromViews") {

            const toggled = document.getElementsByClassName("upwardArrow").item(1).classList.toggle("upwardArrowRotate");
            if (toggled == true) {
                setSortType("descending");
            } else {
                setSortType("ascending")
            }
        }
    }

    function createlink() {
        const[title,url]=[titleRef.current.value,urlRef.current.value]
        const isPresent = alllinks.some(link=>link.title === title && link.url == url)

        const urlRegex = /^(?:(ftp|http|https):\/\/)?[^ "]+\.[^ "]{2,}\/?[^\s]*$/;
        if (urlRegex.test(urlRef.current.value)) {
            btnLoaderRef.current.style = "display:inline-block;"
            if(isPresent){
                setMessage({type:"SUCCESS",content:"Link already shortened!",visible:true}); 
                btnLoaderRef.current.style = "display:none;"
            }else{
                
                CreateLink(title,url).then(
                    (obj) => {
                        let linksCopy = [...alllinks];
                        linksCopy.unshift(obj);
                        dispatch(updateLinks(linksCopy));
                        setMessage({type:"SUCCESS",content:"Link shortned!",visible:true});
                        // messageRef.current.innerHtml ="s";
                    },
                    (response) => {
                        if (response.status === 401) {
                            Nav("/SessionExpired")
                        } else {
                            setMessage({type:"error",content:"Server down",visible:true});
                        }
                    }
                ).finally(
                    () => {
                        btnLoaderRef.current.style = "display:none;"
                    }
                )
            }
        } else {
            setMessage({type:"error",content:"Invalid Url!",visible:true});
        }
    }

    return (
        <>
            <div className="HomeCards" style={{ textAlign: "center", padding: "10px" }}>
                <div>
                    <h1 style={{ maxWidth: "none" }}>Create Links Instantly</h1>
                    <h3 style={{ maxWidth: "none" }}>
                        Log in to your account to save your URLs permanently and ensure that your
                        links always lead to the right place by editing their destination URLs.
                    </h3>
                    <div style={{ fontSize: "28px", marginBottom: "40px", boxShadow: "none", backgroundColor: "#ffffff00" }}>
                        <div className={styles.message}>
                            <Message message={message} setMessage={setMessage}/>
                        </div>
                        <input ref={titleRef} className={styles.inputText} placeholder="Url Title" /><br />
                        <input ref={urlRef}type="url" className={styles.inputText} placeholder="https://www.example.com" /><br />
                        <button className={styles.Button} onClick={createlink}>
                            Short URL
                            <div ref={btnLoaderRef} className={styles.smLoader}></div>
                        </button>
                    </div>
                </div>
            </div>
            <div className="HomeCards" style={{ padding: "10px" }}>
                <div className="HomeCardMenu">
                    <div className="HomeCardMenuFlex">
                        <img src="static/sync.svg" onClick={(e) => {
                            if (localStorage.Token) {
                                e.target.style = 'animation-play-state: running;';
                                RefreshData().then(
                                    (data) => {
                                        dispatch(updateAuth(data))
                                        localStorage.setItem("Token", data.token)
                                    },
                                    (message) => {
                                        Nav("/SessionExpired")
                                    }
                                ).finally(() => {
                                    e.target.style = 'animation-play-state: paused;'
                                })
                            }
                        }} className="sync" style={{ textAlign: "center" }}></img>
                        <h1 className="centerText HomecrdMnuHed" style={{ maxWidth: "none", display: "inline-block", textAlign: "center" }}>Shorted Urls</h1>
                    </div>
                </div>
                <div className="HomeCardMenuFlex">
                <div className="searchBar">
                        <img src="static/search.png" id="searchIcon"></img>
                        <input type="text" placeholder="search" />
                    </div>
                    <img src="static/sort.svg" className="sort" onClick={() => {
                        document.getElementsByClassName("sortOption").item(0).classList.toggle("showSortOption")
                        document.getElementsByClassName("sortOption").item(1).classList.toggle("showSortOption")
                    }} style={{ textAlign: "center" }}></img>
                    <div>
                    </div>
                    <div className="sortOptions">
                        <div className="sortOption">
                            <input type="radio" name="sort" onClick={() => { setSortOption("date") }} defaultChecked></input>
                            <span>Date</span>
                            <img src="static/upwardArrow.svg" className="upwardArrow" id="dateArrow" onClick={() => { sortLinks("fromDate") }} style={{ textAlign: "center" }}></img>
                        </div>
                        <div className="sortOption"> <input type="radio" name="sort" onClick={() => { setSortOption("views") }}></input>
                            <span>Views</span>
                            <img src="static/upwardArrow.svg" id="viewsArrow" className="upwardArrow" onClick={() => { sortLinks("fromViews") }} style={{ textAlign: "center" }}></img>
                        </div>
                    </div>

                </div>

                <table className="LinksTable">
                    <tbody>
                        {/** Rendering links based on device**/
                            (isMobileDevice) ? (alllinks.length > 0) ?
                                alllinks.map((link, index) => <UserLinkMobile key={link.endpoint} link={link} deleteLink={deleteLink}></UserLinkMobile>) :
                                <UserLinkMobile key={"0000"}
                                    link={{ endpoint: "KKAJ00", url: "https://example.com", title: "Title", views: 900 }}
                                    deleteLink={deleteLink}>
                                </UserLinkMobile> : (alllinks.length > 0) ?
                                alllinks.map((link, index) => <UserLink key={link.endpoint} link={link} deleteLink={deleteLink}></UserLink>) :
                                <UserLink key={"0000"}
                                    link={{ endpoint: "KKAJ00", url: "https://example.com", title: "Title", views: 900 }}
                                    deleteLink={deleteLink}>
                                </UserLink>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default LinksManagement;