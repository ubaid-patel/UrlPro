import { displayOneByOne, GetAuth } from "./AppConfig"
import { CreateLink,sendOTP,SignupUser } from "./ApiCalls";
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteLink } from "./ApiCalls";
import UserLink from "./UserLink";
import Admin from "./Admin";
import "./css/dashboard.css"
import LinksManagement from "./LinksManagement";
import { useSelector } from "react-redux";
import { selectAuth } from "./reducers/authSlice";
function DashBoard(){
    let Nav = useNavigate();
    useEffect(()=>{
        if(auth.token === undefined){
            Nav("/")
        }else{
            let cont = document.getElementsByClassName("MainCont")[0] ;
            cont.classList.add("visible")
        }
    },[]);
    const auth = useSelector(selectAuth);
    // console.log(auth.token)
    function countViews(){
        let views = 0
        let links = auth.links;
        for(let link of links){
            views +=link.views
        }
        return views
    }
    // console.log("Hellow This is bform ds",auth.links,auth.links[0].views)
    return(
        <>
        <div className="statusBar statusBarRun"></div>
        <div className="MainCont" key={"Dashboard"}>
            {
            (auth.users && auth.feedbacks)?<h1 style={{textAlign:"center"}}>Hi Admin</h1>:<h1 style={{textAlign:"center"}}>Hi {GetAuth().name}</h1>
            }
            <div className="dash flex">
                <div className="DashCards">
                    <h1>Total Links</h1>
                    <h1>{auth.links.length}</h1>
                </div>
                <div className="DashCards">
                <h1>Total Visits</h1><h1>{countViews()}</h1>
                </div>
            </div>
            <LinksManagement/>
            {
            (auth.users && auth.feedbacks)?<Admin/>:<></>
            }
    </div>
    </>
    )
}
export default DashBoard;