import { displayOneByOne, GetAuth } from "./AppConfig"
import { CreateLink,sendOTP,SignupUser } from "./ApiCalls";
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteLink } from "./ApiCalls";
import UserLink from "./UserLink";
import "./css/dashboard.css"
function DashBoard(){
    useEffect(()=>{
        let cont = document.getElementsByClassName("MainCont")[0] ;
        cont.classList.add("visible")
    })
    let Nav = useNavigate();
    const[num,refresh] = useState(0);
    const[alllinks,setLinks]=useState([]);
    let links = GetAuth().links; ;
    useEffect(()=>{
        setLinks(GetAuth().links)    
    },[num])
    function countViews(){
        let views = 0
        let links = GetAuth().links;
        for(let i in links){
            views +=links[i].views
        }
        return views
    }
    const Signup = () => {
        const nav = useNavigate();
        const[emailId,setEmail]=useState();
      
        function sendOtp(e){
          let form = new FormData(e.target);
          setEmail(form.get("email"))
          sendOTP(form.get("email"))
          document.getElementById("form").classList.toggle("sendotpanimate")
          setTimeout(() => {
            document.getElementById("form").style="display:none;"
            document.getElementById("verify").style="display:block;"
          }, 1000);  
        }
        function CreateAccount(e) {
          let otp = document.getElementById("otpInput").value;
          let name = document.getElementById("nameInput").value;
          let email = document.getElementById("emailInput").value;
          let password = document.getElementById("passwordInput").value;
          let data={name:name,email:email,password:password,otp:otp}
          document.getElementById("btnloader").style="display:block;";
          SignupUser(data).then(
            (message) => {
              document.getElementById("btnloader").style="display:none;";
              displayOneByOne(message,"SignupResult",40,"success").then(
                ()=>{
                  setTimeout(()=>{
                    nav("/")
                  },2000)
                }
              )
            },
            (message) => {
              document.getElementById("btnloader").style="display:none;";
              displayOneByOne(message,"SignupResult",40,"failed")
            }
          );
        }}
        function deleteLink(endpoint){
            if(window.confirm("Delete link for : "+alllinks.filter(link => link.endpoint === endpoint)[0].url)){
                DeleteLink(endpoint).then(
                    ()=>{
                        let newAuth = GetAuth()
                        newAuth.links = alllinks.filter(link => link.endpoint !== endpoint)
                        console.log(newAuth)
                        localStorage.setItem("Auth",JSON.stringify(newAuth))
                        setLinks(alllinks.filter(link => link.endpoint !== endpoint))
                    }
                )
            }
    }
    return(
        <>
        <div className="statusBar statusBarRun"></div>
        <div className="MainCont" key={"Dashboard"}>
        <h1 style={{textAlign:"center"}}>Hi {GetAuth().name}</h1>
        <div className="dash flex">
            <div className="DashCards">
                <h1>Total Links</h1>
                <h1>{GetAuth().links.length}</h1>
            </div>
            <div className="DashCards">
            <h1>Total Visits</h1><h1>{countViews()}</h1>
            </div>
        </div>
        <div className="HomeCards" style={{textAlign:"center",padding:"10px"}}>
        <div>
        <h1 style={{maxWidth:"none"}}>Short URLs Instantly</h1>
        <div style={{fontSize:"28px",marginBottom:"40px",boxShadow:"none",backgroundColor:"#ffffff00"}}>
        <p id="result"></p>
            <form method="post" name="short" onSubmit={(e)=>{
                e.preventDefault()
                document.getElementById("btnloader").style="display:inline-block;"
                let form = new FormData(e.target);
                CreateLink(form).then(
                    (obj)=>{
                        let newAuth = GetAuth();
                        newAuth.links.push(obj);
                        localStorage.setItem("Auth",JSON.stringify(newAuth))
                        setLinks([...alllinks, obj]);
                        displayOneByOne("Success","result",40,"success")
                    },
                    (message)=>{displayOneByOne("Invalid Url","result",40,"failed")}
                ).finally(
                    ()=>{
                        document.getElementById("btnloader").style="display:none;"
                    }
                )
                }}>
                <input type="text" name="title" className="inputText" placeholder="Url Title"></input><br/>
                <input type="text" name="url" required className="inputText" placeholder="https://www.example.com"/><br/>
                <button type="submit" style={{margin:"auto",marginBottom:"40px",marginTop:"30px",display:"flex",alignItems:"center",backgroundColor:"#bfbfcb70"}} className="Button">Short URL <div id="btnloader" className="smLoader smaller-cut hide"></div></button>
            </form>
        </div>
        </div>
    </div>
    <div className="HomeCards" style={{padding:"10px"}}>
        <h1 className="centerText" style={{maxWidth:"none"}}>Shorted Urls</h1>
        
            {
                (alllinks.length>0)?
                alllinks.map((link,index)=>{
                    console.log(`Link ${link.title}: ${link.url}`);
                    return  <UserLink key={link.endpoint} link={link} deleteLink={deleteLink}></UserLink>
                }):<UserLink key={"0000"} link={{endpoint:"KKAJ00",url:"https://example.com",title:"Title",views:900}} deleteLink={deleteLink}></UserLink>
            }
    </div>
    </div>
    </>
    )
}
export default DashBoard;