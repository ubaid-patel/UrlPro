import "./css/settings.css"
import { useEffect } from "react";
import { SendFeedback } from "./ApiCalls";
import { displayOneByOne } from "./AppConfig";
function Feedback(){
    useEffect(()=>{
        let cont = document.getElementsByClassName("MainCont")[0] ;
        cont.classList.add("visible")
    })
    return(
        <>
        <div className="statusBar statusBarRun"></div>
        <div className="MainCont">
        <div className="settingsCard">
        <h1>Send Feedback</h1>
        <hr/>
        <p id="feedbackresult"></p>
        <h3>feedback</h3>
        <textarea id="feedbackdesc" rows={10} cols={175} placeholder="Feedback">
        </textarea>
        <button className="settingsBtn cng" onClick={
            ()=>{
                let desc = document.getElementById("feedbackdesc").value
                if(desc.length != 0){
                    SendFeedback(desc).then(
                        (response)=>{displayOneByOne(response.message,"feedbackresult",40,"success")},
                        (response)=>{displayOneByOne(response.message,"feedbackresult",40,"failed")},
                    )
                }else{
                    
                }
            }
        }>Send Feedback</button>
        </div>
        </div>
        </>
    )
}
export default Feedback