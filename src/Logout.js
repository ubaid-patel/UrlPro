import { displayOneByOne, initState } from "./AppConfig"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAuth } from "./reducers/authSlice";
function LogoutUser(){
    let Nav = useNavigate();
    const dispatch = useDispatch();

    function deleteData(nav){
    // store.dispatch({type:"REFRESH",payload:{status:0,token:null,links:[]}})
    displayOneByOne("Logout Success","LogoutMsg",45,"failed").then(()=>{
        localStorage.removeItem("Token")
        setTimeout(()=>{
            nav("/")
            dispatch(updateAuth(initState()))
        },600)
    }).finally(()=>{
        setTimeout(()=>{},600)
    })
    }

    useEffect(()=>{
            let cont = document.getElementsByClassName("MainCont")[0] ;
            cont.classList.add("visible")
            deleteData(Nav)
        },[])
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