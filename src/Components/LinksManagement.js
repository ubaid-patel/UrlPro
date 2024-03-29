import { CreateLink, DeleteLink, RefreshData } from "../ApiCalls";
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLink from "./UserLink";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, updateAuth, updateLinks } from "../reducers/authSlice";
import { useMediaQuery } from "react-responsive";
import UserLinkMobile from "./UserLinkMobile";
import styles from '../css/linkManagement.module.css'
import Message from "./Message";
import { initState } from "../AppConfig";

const applySorting = (links,sortOption,sortType) => {
    switch (sortOption) {
        case 'date':
            switch (sortType) {
                case 'descending':
                    links.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
                    break;
                case 'ascending':
                    links.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
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

function LinksManagement() {
    const urlRef = useRef(null)
    const titleRef = useRef(null)
    const btnLoaderRef = useRef(null)
    const messageRef = useRef(null),
        dateArrowRef = useRef(null),
        searchInpRef = useRef(null),
        viewsArrowRef = useRef(null),
        dateOptRef = useRef(null),
        sortOptsRef = useRef(null),
        sortContRef = useRef(null),
        viewsOptRef = useRef(null);
    
    //Message dialoge state
    const [message, setMessage] = useState({ type: "", content: "", visible: false })

    //check device
    const isMobileDevice = useMediaQuery({ query: '(max-width:600px)' });
    
    //Gets auth and dispatch
    const auth = useSelector(selectAuth);
    const dispatch = useDispatch();

    //Copys links from auth to sort and search
    const [alllinks, setAllLinks] = useState(applySorting([...auth.links],'date','ascending'));
    const [sortOption, setSortOption] = useState("date");
    const [sortType, setSortType] = useState("ascending");
    
    
    function getSortType() {
        let elem;
        if (sortOption === 'date') {
            elem = dateArrowRef.current;
        } else {
            elem = viewsArrowRef.current;
        }
        if (elem.classList.contains(styles.downArrowRotate)) {
            return ('descending')
        } else {
            return ('ascending')
        }
    }
    useEffect(() => {
        if(alllinks.length>1){
            console.log(alllinks)
            if (getSortType() === sortType) {
                setAllLinks(applySorting([...auth.links],sortOption,sortType))
            } else {
                setSortType(getSortType());
            }
        }
    }, [sortOption])

    useEffect(() => {
        if(alllinks.length>1){
            console.log(alllinks)
            setAllLinks(applySorting([...auth.links],sortOption,sortType))
        }
    }, [sortType])

    useEffect(() => {
        if(auth.links.length>1){
            setAllLinks(applySorting([...auth.links],sortOption,sortType))
        }
        if(!localStorage.Token){
            localStorage.Links = JSON.stringify(auth.links)
        }
    }, [auth])

    useEffect(()=>{
        setAllLinks(applySorting([...auth.links],sortOption,sortType))
    },[auth.links])
    function PerformSearch(event) {
        let word = event.target.value.trim().toLowerCase();
        let links = [...auth.links]
        setAllLinks(links.filter((obj) => obj.title.toLowerCase().includes(word) || obj.url.toLowerCase().includes(word)))
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
            const toggled = dateArrowRef.current.classList.toggle(styles.downArrowRotate);
            if (toggled == true) {
                setSortType("descending");
            } else {
                setSortType("ascending")
            }

        } else if (sortOption === 'views' && from === "fromViews") {

            const toggled = viewsArrowRef.current.classList.toggle(styles.downArrowRotate);
            if (toggled == true) {
                setSortType("descending");
            } else {
                setSortType("ascending")
            }
        }
    }

    function createlink() {
        const [title, url] = [titleRef.current.value, urlRef.current.value]
        const isPresent = alllinks.some(link => link.title === title && link.url == url)

        const urlRegex = /^(?:(ftp|http|https):\/\/)?[^ "]+\.[^ "]{2,}\/?[^\s]*$/;
        if (title.trim() !== '') {
            if (urlRegex.test(urlRef.current.value)) {
                btnLoaderRef.current.style = "display:inline-block;"
                if (isPresent) {
                    setMessage({ type: "SUCCESS", content: "Link already shortened!", visible: true });
                    btnLoaderRef.current.style = "display:none;"
                } else {

                    CreateLink(title, url).then(
                        (obj) => {
                            let linksCopy = [...alllinks];
                            linksCopy.push(obj);
                            dispatch(updateLinks(linksCopy));
                            setMessage({ type: "SUCCESS", content: "Link shortned!", visible: true });
                            // messageRef.current.innerHtml ="s";
                        },
                        (response) => {
                            if (response.status === 401) {
                                Nav("/SessionExpired")
                            } else {
                                setMessage({ type: "error", content: "Something went wrong", visible: true });
                            }
                        }
                    ).finally(
                        () => {
                            btnLoaderRef.current.style = "display:none;"
                        }
                    )
                }
            } else {
                setMessage({ type: "error", content: "Invalid Url!", visible: true });
            }
        } else {
            setMessage({ type: "error", content: "Invalid title!", visible: true });
        }
    }

    const SyncData = (e) => {
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
    }
    function toggleShowOpts() {
        if(sortOptsRef.current.classList.contains(styles.showSortOptions)){
            setTimeout(()=>{
                sortContRef.current.classList.remove(styles.visible)
            },500)
        }else{
            sortContRef.current.classList.add(styles.visible)
        }
        sortOptsRef.current.classList.toggle(styles.showSortOptions)
    }

    return (
        <React.Fragment>
            {/* Card of Create Links Form */}
            <div className={styles.HomeCards}>
                <div className={styles.forms}>
                    <h1>Create Links Instantly</h1>
                    {(!auth.token ?
                        <p>
                            Log in to your account to save your URLs permanently and ensure that your links always lead to
                            the right place by editing their destination URLs.
                        </p> : <React.Fragment></React.Fragment>)}

                    <div className={styles.message} ref={messageRef}>
                        <Message message={message} setMessage={setMessage} />
                    </div>
                    <input ref={titleRef} name="title" className={styles.inputText} placeholder="Url Title" /><br />
                    <input ref={urlRef} name="url" className={styles.inputText} placeholder="https://www.example.com" /><br />
                    <button className={styles.Button} onClick={createlink}>
                        Short URL
                        <div ref={btnLoaderRef} className={styles.smLoader}></div>
                    </button>
                </div>
            </div>

            {/* Card That Displays Links and all Options related to it like sort and search */}
            <div className={styles.HomeCards}>
                <div className={styles.HomeCardMenuFlex}>
                    <img src="static/sync.svg" onClick={SyncData} className={styles.sync}></img>
                    <h1 className={styles.HomecrdMnuHed}>Shorted links</h1>
                </div>
                <div className={styles.HomeCardMenuFlex}>
                    <div className={styles.searchBar}>
                        <img src="static/search.png" id={styles.searchIcon}></img>
                        <input type="text" ref={searchInpRef} placeholder="search" onChange={PerformSearch} />
                    </div>
                    <img src="static/sort.svg" className={styles.sort} onClick={toggleShowOpts} />
                    <div className={styles.sortCont} ref={sortContRef}>
                        <div className={styles.sortOptions} ref={sortOptsRef}>
                        <div className={styles.sortOption} ref={dateOptRef}>
                            <input type="radio" name="sort" onClick={() => { setSortOption("date") }} defaultChecked />
                            <span>Date</span>
                            <img src="static/upwardArrow.svg" className={styles.upwardArrow} ref={dateArrowRef} onClick={() => { sortLinks("fromDate") }}></img>
                        </div>
                        <div className={styles.sortOption} ref={viewsOptRef}>
                            <input type="radio" name="sort" onClick={() => { setSortOption("views") }} />
                            <span>Views</span>
                            <img src="static/upwardArrow.svg" ref={viewsArrowRef} className={styles.upwardArrow} onClick={() => { sortLinks("fromViews") }} />
                        </div>
                        </div>
                    </div>
                </div>

                <table className={styles.LinksTable}>
                    <tbody>
                             {/** Rendering links based on device and links length and search active**/
                            (alllinks.length === 0) ?
                            (searchInpRef.current == null || searchInpRef.current.value.trim() == '') ?
                                (isMobileDevice)
                                    ? <UserLinkMobile key={'EXMPL'} link={initState().links[0]} deleteLink={deleteLink}></UserLinkMobile>
                                    : <UserLink key={'EXMPL'} link={initState().links[0]} deleteLink={deleteLink}></UserLink>
                                : <tr><td colSpan={2}><h3>No Links Found</h3></td></tr>
                            : (isMobileDevice) ?
                                alllinks.map((link, index) => <UserLinkMobile key={link.endpoint} link={link} deleteLink={deleteLink}></UserLinkMobile>)
                                : alllinks.map((link, index) => <UserLink key={link.endpoint} link={link} deleteLink={deleteLink}></UserLink>)
                }
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}
export default LinksManagement;