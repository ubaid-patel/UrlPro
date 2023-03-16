import { displayOneByOne } from "./AppConfig"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
function LogoutUser(){
    useEffect(()=>{
        let cont = document.getElementsByClassName("MainCont")[0] ;
        cont.classList.add("visible")
    })
    const [iter,setIter]=useState(0)
    let Nav = useNavigate();
    function deleteData(nav){
    displayOneByOne("Logout Success","LogoutMsg",45,"failed").then(()=>{
        localStorage.setItem("Auth",JSON.stringify({status:0,token:"token",links:[]}))
        setTimeout(()=>{nav("/")},600)
    })
    }
    useEffect(()=>{
        if(iter === 1){
            deleteData(Nav)
        }
        setIter(iter+1)
    },[iter])
    return(
    <>
    <div className="statusBar statusBarRun"></div>
    <div className="MainCont">
    <h1 id="LogoutMsg" style={{textAlign:"center",marginTop:"250px"}}></h1>    
    </div>
    </>
    )
}
export default LogoutUser