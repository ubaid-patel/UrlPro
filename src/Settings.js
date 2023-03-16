import "./css/settings.css"
import { displayOneByOne, GetAuth } from "./AppConfig"
import { useEffect } from "react"
import { changeName, changePassword, deleteAccount } from "./ApiCalls"
import { useNavigate } from "react-router-dom"
function Settings(){
    useEffect(()=>{
        let cont = document.getElementsByClassName("MainCont")[0] ;
        cont.classList.add("visible")
    })
    const nav = useNavigate();
    return(
        <>
        <div className="statusBar statusBarRun"></div>
        <div className="MainCont">
        <div className="settingsCard">
            <h1>Settings</h1>
            <hr/>

            <h3>Change Password</h3>
            <p id="cngpassResult"></p>
            <input type="password" selected id="cpass" placeholder="Current Password"></input>
            <input type="password" id="npass" placeholder="New Password" className="secinp"></input><br/>
            <button className="settingsBtn cng" onClick={
                (e)=>{
                    let newpass = document.getElementById("npass");
                    let oldpass = document.getElementById("cpass");
                    e.target.setAttribute("disabled",true)
                    newpass.setAttribute("disabled",true)
                    oldpass.setAttribute("disabled",true)
                    changePassword(oldpass.value,newpass.value).then(
                        (response)=>{displayOneByOne(response.message,"cngpassResult",40,"success")},
                        (response)=>{displayOneByOne(response.message,"cngpassResult",40,"failed")}
                    ).finally(()=>{
                        e.target.removeAttribute("disabled")
                        oldpass.removeAttribute("disabled")
                        newpass.removeAttribute("disabled")
                    })
                }
            }>Change Password</button>

            <h3>Change Name</h3>
            <p id="cngnameResult"></p>
            <input type="text" id="newname" placeholder="New name"></input>
            <button className="settingsBtn cng" onClick={
                (e)=>{
                    let name = document.getElementById("newname");
                    name.setAttribute("disabled",true)
                    e.target.setAttribute("disabled",true)
                    changeName(name.value).then(
                        (response)=>{
                            let auth = GetAuth();
                            auth.name = name.value;
                            localStorage.setItem("Auth",JSON.stringify(auth))
                            displayOneByOne(response.message,"cngnameResult",40,"success")},
                        (response)=>{displayOneByOne(response.message,"cngnameResult",40,"failed")}
                    ).finally(()=>{
                        name.removeAttribute("disabled")
                        e.target.removeAttribute("disabled")
                    })
                }
            }>Change Name</button>

            <h3>Delete Account</h3>
            <p id="delacResult"></p>
            <input type="password" id="passInp" placeholder="Password"></input>
            <button className="settingsBtn del" onClick={
                (e)=>{
                    let pass = document.getElementById("passInp");
                    pass.setAttribute("disabled",true)
                    e.target.setAttribute("disabled",true)
                    deleteAccount(pass.value).then(
                        (response)=>{displayOneByOne(response.message,"delacResult",40,"success").then(()=>{
                            nav("/Logout")
                        })},
                        (response)=>{displayOneByOne(response.message,"delacResult",40,"failed")}
                    ).finally(()=>{
                        pass.removeAttribute("disabled")
                        e.target.removeAttribute("disabled")
                    })
                }
            }>Delete Account</button>
        </div>
        </div>
        </>
    )
}
export default Settings