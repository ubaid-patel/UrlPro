import { useNavigate } from "react-router-dom";
import { DeleteLink, saveChanges } from "./ApiCalls";
function UserLink({link,deleteLink}){
    const nav = useNavigate();
    var isCopied = false;
    function copyLink(endpoint){
        var input = document.createElement('input');
        input.setAttribute('value', window.location.origin+"/"+endpoint);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
    return(
        <>
        <div className={"userLink Desktop "}>
        <table>
            <tbody>
            <tr style={{position:"relative"}}>
                <td colSpan={4}
                    style={{ textAlign: "right", position: "absolute", top: "-73px", right: "5px" }}>
                <div  className={"moreOptions "+link.endpoint}>
                    <ul>
                    <li onClick={()=>{
                        document.getElementById("inputTitle"+link.endpoint).removeAttribute("disabled");
                        document.getElementById("inputUrl"+link.endpoint).removeAttribute("disabled");

                        let moreopts = document.getElementsByClassName(link.endpoint);
                        for(let i = 0; i < moreopts.length; i++){
                            moreopts[i].classList.toggle("showOpts")
                        }
                        
                        let btns = document.getElementsByClassName("menu"+link.endpoint);
                        for(let i = 0;i< btns.length;i++){
                           btns[i].classList.toggle("hide") 
                        }
                        let editbtns = document.getElementsByClassName("edit"+link.endpoint);
                        for(let i = 0;i< btns.length;i++){
                            editbtns[i].classList.toggle("hide") 
                        }
                    }}>Edit</li>
                    <li onClick={()=>{
                        deleteLink(link.endpoint)
                    }}>Delete</li>
                    <li onClick={
                        ()=>{
                            document.getElementsByClassName("card"+link.endpoint)[0].classList.toggle("infoCardAminate")
                        }
                    }>Info</li>
                    </ul>
                </div>
                </td>
            </tr>
            <tr>
                <td>
                <input type={"text"} id={"inputTitle"+link.endpoint} defaultValue={link.title} disabled />
                </td> 
                <td> 
                <input type={"text"} id={"inputUrl"+link.endpoint} defaultValue={link.url} disabled/>
                </td>
                <td>
                <button
                    className={"actbtn menu"+link.endpoint}
                    onClick={(e) => {
                        copyLink(link.endpoint)
                    let copyElement = document.getElementsByClassName("copy"+link.endpoint).item(0);
                    if (isCopied) {
                        copyElement.src = "/static/mcopy.png";
                        isCopied = false;
                    } else {
                        copyElement.src = "/static/tick.png";
                        isCopied = true;
                        setTimeout(() => {
                        copyElement.src = "/static/mcopy.png";
                        isCopied = false;
                        }, 3000);
                    }
                    }}
                >
                    <img src="/static/mcopy.png" className={"copy"+link.endpoint} />
                </button>
                <button className={"editbtn actbtn hide edit"+link.endpoint} onClick={()=>{
                    document.getElementById("inputTitle"+link.endpoint).setAttribute("disabled",true)
                    document.getElementById("inputUrl"+link.endpoint).setAttribute("disabled",true)
                     let btns = document.getElementsByClassName("menu"+link.endpoint);
                     for(let i = 0;i< btns.length;i++){
                        btns[i].classList.toggle("hide") 
                     }
                     let editbtns = document.getElementsByClassName("edit"+link.endpoint);
                     for(let i = 0;i< btns.length;i++){
                         editbtns[i].classList.toggle("hide") 
                     }
                }}>
                            <img src="/static/cancel.png" />
                    </button>
                </td>
                <td>
                <button className={"actbtn menu"+link.endpoint} onClick={()=>{
                        let moreopts = document.getElementsByClassName(link.endpoint);
                        for(let i = 0; i < moreopts.length; i++){
                            moreopts[i].classList.toggle("showOpts");
                        }
                    }}>
                    <img src="/static/expand.png" />
                </button>
                    <button className={"savebtn actbtn hide edit"+link.endpoint} onClick={()=>{
                        let title = document.getElementById("inputTitle"+link.endpoint).value;
                        let url = document.getElementById("inputUrl"+link.endpoint).value;
                        saveChanges(link.endpoint,title,url).then(
                            (response)=>{
                                document.getElementById("inputTitle"+link.endpoint).setAttribute("disabled",true)
                                document.getElementById("inputUrl"+link.endpoint).setAttribute("disabled",true)
                                let btns = document.getElementsByClassName("menu"+link.endpoint);
                                for(let i = 0;i< btns.length;i++){
                                    btns[i].classList.toggle("hide") 
                                }
                                let editbtns = document.getElementsByClassName("edit"+link.endpoint);
                                for(let i = 0;i< btns.length;i++){
                                    editbtns[i].classList.toggle("hide") 
                                }},
                            (response)=>{
                                if(response.status === 401){
                                    nav("/SessionExpired")
                                }else{
                                    console.log(response)
                                }
                            }
                        )
                    }}>
                            <img src="/static/save.png" />
                    </button>
                </td>
            </tr>
            <tr>
            </tr>
            </tbody>
        </table>
        <div className={"infoCard card"+link.endpoint}>
            <button className={"editbtn actbtn infoclose"} onClick={
                        ()=>{
                            document.getElementsByClassName("card"+link.endpoint)[0].classList.toggle("infoCardAminate")
                        }
                    }>
                <img src="/static/cancel.png"/>
            </button>
                <h3>Url Title:</h3>
                {link.title}
                <h3>Url:</h3>
                {window.location.origin+"/"+link.endpoint}
                <h3>Redirect Url:</h3>
                {link.url}
                <h3>Visits:</h3>
                {link.views}
            </div>
        </div>

        <div className="userLink Mobile">
        <table>
            <tbody>
                <tr>
                    <td style={{ position: "relative" }} colSpan={2}>
                        <input type={"text"} defaultValue={link.title} id={"mobInputTitle"+link.endpoint} disabled/>
                    </td>
                </tr>
                <tr style={{ position: "relative" }}>
                <td colSpan={2}>
                    <input type="text" defaultValue={link.url} id={"mobInputUrl"+link.endpoint} disabled/>
                </td>
                </tr>
                <tr style={{ position: "relative" }}>
                <td
                    colSpan={2}
                    style={{ textAlign: "right", position: "absolute", top: "-73px", right: "20px" }}
                >
                    <div className={"moreOptions "+link.endpoint}>
                    <ul>
                    <li onClick={()=>{
                        document.getElementById("mobInputTitle"+link.endpoint).removeAttribute("disabled");
                        document.getElementById("mobInputUrl"+link.endpoint).removeAttribute("disabled");

                        let moreopts = document.getElementsByClassName(link.endpoint);
                        for(let i = 0; i < moreopts.length; i++){
                            moreopts[i].classList.toggle("showOpts")
                        }
                        
                        let btns = document.getElementsByClassName("menu"+link.endpoint);
                        for(let i = 0;i< btns.length;i++){
                           btns[i].classList.toggle("hide") 
                        }
                        let editbtns = document.getElementsByClassName("edit"+link.endpoint);
                        for(let i = 0;i< btns.length;i++){
                            editbtns[i].classList.toggle("hide") 
                        }
                    }}>Edit</li>
                    <li onClick={()=>{
                        deleteLink(link.endpoint)
                    }}>Delete</li>
                    <li onClick={
                        ()=>{
                            document.getElementsByClassName("mobileCard"+link.endpoint)[0].classList.toggle("infoCardAminate")
                        }
                    }>Info</li>
                    </ul>
                    </div>
                </td>
                </tr>
                 <tr>
                    <td>
                        <button
                            className={"actbtn menu"+link.endpoint}
                            onClick={(e) => {
                                copyLink(link.endpoint)
                                let copyElement = document.getElementsByClassName("Mobcopy"+link.endpoint)[0];
                                if (isCopied) {
                                    copyElement.src = "/static/mcopy.png";
                                    isCopied = false;
                                } else {
                                    copyElement.src = "/static/tick.png";
                                    isCopied = true;
                                    setTimeout(() => {
                                    copyElement.src = "/static/mcopy.png";
                                    isCopied = false;
                                    }, 3000);
                                }
                                }}
                        >
                            <img src="/static/mcopy.png" className={"Mobcopy"+link.endpoint} id="Mcopy" />
                        </button>
                        <button className={"editbtn actbtn hide edit"+link.endpoint} onClick={()=>{
                    document.getElementById("mobInputTitle"+link.endpoint).setAttribute("disabled",true)
                    document.getElementById("mobInputUrl"+link.endpoint).setAttribute("disabled",true)
                     let btns = document.getElementsByClassName("menu"+link.endpoint);
                     for(let i = 0;i< btns.length;i++){
                        btns[i].classList.toggle("hide") 
                     }
                     let editbtns = document.getElementsByClassName("edit"+link.endpoint);
                     for(let i = 0;i< btns.length;i++){
                         editbtns[i].classList.toggle("hide") 
                     }
                }}>
                            <img src="/static/cancel.png" />
                    </button>
                    </td>
                    <td>
                        <button className={"actbtn menu"+link.endpoint} onClick={()=>{
                                let moreopts = document.getElementsByClassName(link.endpoint);
                                for(let i = 0; i < moreopts.length; i++){
                                    moreopts[i].classList.toggle("showOpts");
                                }
                            }}>
                            <img src="/static/expand.png"/>
                        </button>
                    <button className={"savebtn actbtn hide edit"+link.endpoint} onClick={()=>{
                        let title = document.getElementById("mobInputTitle"+link.endpoint).value;
                        let url = document.getElementById("mobInputUrl"+link.endpoint).value;
                        saveChanges(link.endpoint,title,url).then(
                            (value)=>{
                    document.getElementById("mobInputTitle"+link.endpoint).setAttribute("disabled",true)
                    document.getElementById("mobInputUrl"+link.endpoint).setAttribute("disabled",true)
                     let btns = document.getElementsByClassName("menu"+link.endpoint);
                     for(let i = 0;i< btns.length;i++){
                        btns[i].classList.toggle("hide") 
                     }
                     let editbtns = document.getElementsByClassName("edit"+link.endpoint);
                     for(let i = 0;i< btns.length;i++){
                         editbtns[i].classList.toggle("hide") 
                     }
                            },
                            (status,message)=>{
                                if( status === 401){
                                   nav("/SessionExpired") 
                                }else{
                                    console.log(message)
                                }
                            }
                        )
                    }}>
                            <img src="/static/save.png" />
                    </button>
                    </td>
                 </tr>
            </tbody>
        </table>
        <div className={"infoCard mobileCard"+link.endpoint}>
            <button className={"editbtn actbtn infoclose"} onClick={
                        ()=>{
                            document.getElementsByClassName("mobileCard"+link.endpoint)[0].classList.toggle("infoCardAminate")
                        }
                    }>
                <img src="/static/cancel.png"/>
            </button>
                <h3>Url Title:</h3>
                <p>{link.title}</p>
                <h3>Url:</h3>
                {window.location.origin+"/"+link.endpoint}
                <h3>Redirect Url:</h3>
                {link.url}
                <h3>Visits:</h3>
                {link.views}
            </div>
        </div>
        </>
    )
}
export default UserLink;