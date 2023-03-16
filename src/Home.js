import { displayOneByOne, GetAuth } from "./AppConfig"
import { CreateLink } from "./ApiCalls";
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteLink } from "./ApiCalls";
import UserLink from "./UserLink";
function Home(){
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
    <div className="MainCont" key={"Home"}>
    <div id="name">
    <h1 style={{textAlign:"center",marginBottom:"0px",maxWidth:"100%"}}>Url Pro</h1>
    <h3 style={{textAlign:"center",marginTop:"0px",maxWidth:"100%"}}>Linking made simple and permanent</h3>
    </div>
      <div className="HomeCards flex">
        <div>
            <h1>Link once, update forever</h1>
            <h3>Sick of constantly updating links? Simplify your link management with our app's permanent link feature, 
                allowing you to create a link that never expires or gets deleted, ensuring your audience always ends up in the right place.
            </h3>
        </div>
        <div>
            <img src="/static/social.jpg" style={{height:"300px"}}></img>
        </div>
    </div>
    <div className="HomeCards" style={{textAlign:"center",padding:"10px"}}>
        <div>
        <h1 style={{maxWidth:"none"}}>Create Links Instantly</h1>
        <h3 style={{maxWidth:"none"}}>
        Log in to your account to save your URLs permanently and ensure that your 
        links always lead to the right place by editing their destination URLs.
        </h3>
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
            {
                (alllinks.length>0)?
                alllinks.map((link,index)=>{
                    return  <UserLink key={link.endpoint} link={link} deleteLink={deleteLink}></UserLink>
                }):<UserLink key={"0000"} link={{endpoint:"KKAJ00",url:"https://example.com",title:"Title",views:900}} deleteLink={deleteLink}></UserLink>
            }
        </div>
        </div>
    </div>
  
    <div className="HomeCards flex">
        <div>
            <h1>Shorten Url's</h1>
            <h3 style={{maxWidth:"none"}}>Make your links memorable with URLPRO! Our powerful app lets you create custom,
                 eye-catching URLs that are easy to share and remember. Upgrade your online content today with URLPRO.
            </h3>
        </div>
        <div>
            <img src="/static/shortenurls.png" style={{maxWidth:"100%"}}></img>
        </div>
    </div> 
    <div className="HomeCards flex">
        <div>
            <h1 >100% Free, No ads</h1>
            <h3 >
            Elevate your online presence - shorten your URLs for free without any annoying ads! 
            Sign up now to unlock all the amazing features.
            </h3>
        </div>
        <div>
            <img src="/static/freeNoAds.jpg" style={{maxHeight:"300px"}}></img>
        </div>
    </div>
    <div className="HomeCards flex">
                <div>
                    <h1>Streamlined UI Design, No Distractions</h1>
                    <h3>Experience a modern and simple design with our user-friendly interface, 
                        free from distractions. Get started now!</h3>
                </div>
                <div>
                    <img src="/static/computerSmall.jpg" style={{height:"300px",width:"100%"}}></img>
                </div>
    </div>
    <div className="HomeCards flex">
        <div>
            <h1>Open-Source URL Shortening Made Simple</h1>
            <h3>Say goodbye to complex and confusing URL shortening services. With our open-source platform, 
                you can easily create and manage your links with complete transparency. Checkout Here!</h3>
        </div>
        <img src="/static/github-mark.png"></img>
    </div>
    </div>
    </>
    )
}
export default Home