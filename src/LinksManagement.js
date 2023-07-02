import { displayOneByOne, GetAuth } from "./AppConfig"
import { CreateLink } from "./ApiCalls";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteLink } from "./ApiCalls";
import UserLink from "./UserLink";

function LinksManagement() {
    const [alllinks, setLinks] = useState([]);
    let Nav = useNavigate();
    useEffect(() => {
        let cont = document.getElementsByClassName("MainCont")[0];
        cont.classList.add("visible")
    })
    const [num, refresh] = useState(0);
    let links = GetAuth().links;
    useEffect(() => {
        setLinks(GetAuth().links)
    }, [num])
    function deleteLink(endpoint) {
        if (window.confirm("Delete link for : " + alllinks.filter(link => link.endpoint === endpoint)[0].url)) {
            DeleteLink(endpoint).then(
                () => {
                    let newAuth = GetAuth()
                    newAuth.links = alllinks.filter(link => link.endpoint !== endpoint)
                    console.log(newAuth)
                    localStorage.setItem("Auth", JSON.stringify(newAuth))
                    setLinks(alllinks.filter(link => link.endpoint !== endpoint))
                },
                (response)=>{
                    if(response.status === 401){
                        Nav("/SessionExpired")
                    }
                }
            )
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
                                        let newAuth = GetAuth();
                                        newAuth.links.push(obj);
                                        localStorage.setItem("Auth", JSON.stringify(newAuth))
                                        setLinks([obj,...alllinks]);
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
                <h1 className="centerText" style={{ maxWidth: "none",display:"inline-block",textAlign:"center" }}>Shorted Urls</h1>
                <img src="static/sync.svg" style={{textAlign:"center"}}></img>

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