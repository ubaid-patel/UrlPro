import { displayOneByOne, GetAuth } from "./AppConfig"
import { CreateLink } from "./ApiCalls";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteLink } from "./ApiCalls";
import UserLink from "./UserLink";
import { mainstore } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, updateAuth, updateLinks } from "./reducers/authSlice";
import { RefreshData } from "./ApiCalls";


function LinksManagement() {
    const auth = useSelector(selectAuth);
    const alllinks = auth.links;
    const dispatch = useDispatch();
    const [sortOption, setSortOption] = useState("date");
    const [sortType, setSortType] = useState("ascending");
    useEffect(() => {
        if (sortType !== 'descending' && document.getElementById(sortOption + "Arrow").classList.contains("upwardArrowRotate")) {
            setSortType("descending");
            dispatch(updateLinks(applySorting()))
        } else if (sortType == 'descending' && !document.getElementById(sortOption + "Arrow").classList.contains("upwardArrowRotate")) {
            dispatch(updateLinks(applySorting()))
            setSortType("ascending");
        }
    }, [sortOption])

    useEffect(()=>{
       dispatch(updateLinks(applySorting()))
    },[sortType])

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
        return(links)
    }
    let Nav = useNavigate();

    function deleteLink(endpoint) {
        if (window.confirm("Delete link for : " + alllinks.filter(link => link.endpoint === endpoint)[0].url)) {
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
                        <p id="result"></p>
                        <form method="post" name="short" onSubmit={(e) => {
                            e.preventDefault()
                            let data = new FormData(e.target)
                            const urlRegex = /^(ftp|http|https):\/\/[^ "]+\.[^ "]{2,}\/?[^\s]*$/;
                            if (urlRegex.test(data.get("url"))) {
                                document.getElementById("btnloader").style = "display:inline-block;"
                                CreateLink(data).then(
                                    (obj) => {
                                        let linksCopy = [...alllinks];
                                        linksCopy.unshift(obj);
                                        dispatch(updateLinks(linksCopy));
                                        displayOneByOne("Success", "result", 40, "success")
                                    },
                                    (response) => {
                                        if (response.status === 401) {
                                            Nav("/SessionExpired")
                                        } else {
                                            displayOneByOne(response.message, "result", 40, "failed")
                                        }
                                    }
                                ).finally(
                                    () => {
                                        document.getElementById("btnloader").style = "display:none;"
                                    }
                                )
                            } else {
                                displayOneByOne("Invalid url", "result", 40, "failed")
                            }
                        }}>
                            <input type="text" name="title" required className="inputText" placeholder="Url Title"></input><br />
                            <input type="url" name="url" required className="inputText" placeholder="https://www.example.com" /><br />
                            <button type="submit" style={{ margin: "auto", marginBottom: "40px", marginTop: "30px", display: "flex", alignItems: "center", backgroundColor: "#bfbfcb70" }} className="Button">Short URL <div id="btnloader" className="smLoader smaller-cut hide"></div></button>
                        </form>
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
                    <img src="static/sort.svg" className="sort" onClick={() => {
                        document.getElementsByClassName("sortOption").item(0).classList.toggle("showSortOption")
                        document.getElementsByClassName("sortOption").item(1).classList.toggle("showSortOption")
                    }} style={{ textAlign: "center" }}></img>
                    <div className="searchBar">
                        <img src="static/search.png" id="searchIcon"></img>
                        <input type="text" placeholder="search" />
                    </div>
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

               
                    {
                        (alllinks.length > 0) ?
                            alllinks.map((link, index) => {
                                // console.log(`Link ${link.title}: ${link.url}`);
                                return <UserLink key={link.endpoint} link={link} deleteLink={deleteLink}></UserLink>
                            }) : <UserLink key={"0000"} link={{ endpoint: "KKAJ00", url: "https://example.com", title: "Title", views: 900 }} deleteLink={deleteLink}></UserLink>
                    }
            </div>
        </>
    )
}
export default LinksManagement;