import { displayOneByOne, GetAuth } from "./AppConfig"
import { CreateLink,sendOTP,SignupUser } from "./ApiCalls";
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteLink } from "./ApiCalls";
import UserLink from "./UserLink";
import Admin from "./Admin";
import "./css/dashboard.css"
import LinksManagement from "./LinksManagement";
function DashBoard(){
    useEffect(()=>{
        let cont = document.getElementsByClassName("MainCont")[0] ;
        cont.classList.add("visible")
    })
    let Nav = useNavigate();
    if(GetAuth().status === 0){
        Nav("/")
    }
    function countViews(){
        let views = 0
        let links = GetAuth().links;
        for(let i in links){
            views +=links[i].views
        }
        return views
    }
    return(
        <>
        <div className="statusBar statusBarRun"></div>
        <div className="MainCont" key={"Dashboard"}>
        {
        (GetAuth().users && GetAuth().feedbacks)?<h1 style={{textAlign:"center"}}>Hi Admin</h1>:<h1 style={{textAlign:"center"}}>Hi {GetAuth().name}</h1>
        }
        <div className="dash flex">
            <div className="DashCards">
                <h1>Total Links</h1>
                <h1>{GetAuth().links.length}</h1>
            </div>
            <div className="DashCards">
            <h1>Total Visits</h1><h1>{countViews()}</h1>
            </div>
        </div>
        <LinksManagement/>
    </div>
    {
        (GetAuth().users && GetAuth().feedbacks)?<Admin/>:<></>
    }
    </>
    )
}
export default DashBoard;