import React from 'react';
import { Link } from 'react-router-dom';
import { LoginUser,GoogleSignin } from './ApiCalls';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginSocialGoogle } from 'reactjs-social-login';
const Login = () => {
  const nav = useNavigate();
  useEffect(()=>{
      let cont = document.getElementsByClassName("MainCont")[0] ;
      cont.classList.add("visible")
  })
  let Nav = useNavigate();
  return (
    <>
    <div className="statusBar statusBarRun"></div>
    <div className="MainCont">
    <div className='forms'>
      <h4 id="loginResult"></h4>
      <form onSubmit={(e)=>{
        document.getElementById("btnloader").style="display:block;";
        let data = new FormData(e.target);
        LoginUser(data.get("email"),data.get("password"),Nav);
        e.preventDefault()
      }}>
      <input type="email" required name="email" placeholder="Enter Email" className="inputText" />
      <input type="password" required name="password" placeholder="Enter Password" className="inputText" />
      <button type="submit" style={{margin:"auto",marginBottom:"10px",marginTop:"30px",display:"flex",alignItems:"center"}} className="Button submitBtn">Login <div id="btnloader" className="smLoader smaller-cut hide"></div></button>
      <Link to="/forgotPassword" className='Links'>Forgot password?</Link>
      <Link to="/signup" className='Links' style={{marginTop:"5px"}}>Dont have an account?</Link>
      </form>
      <LoginSocialGoogle
      client_id={'1073579154631-nr0b438d5sqljlqfjkiev25ujshf3cs2.apps.googleusercontent.com'}
      scope='openid profile email'
      discoveryDocs='claims_supported'
      access_type='offline'
      typeResponse='accessToken'
      onResolve={(response)=>{
        //console.log(response.data.access_token)
        GoogleSignin(response.data.access_token).then(
          (data)=>{
            localStorage.setItem("Auth",JSON.stringify(data))
            setTimeout(()=>{
              localStorage.removeItem("Loading")
              nav("/Dashboard")
            },300)
          },
          (message)=>{
            alert(message)
          }
        )
      }}
      onReject={(err)=>{
        console.log(err)
      }}
      onLoginStart={()=>{
        localStorage.setItem("Loading","true")
        nav('/Loading')
      }}
      >
        <div id="googleLogin"><img src="/static/google.svg"/> Continue with google</div>
      </LoginSocialGoogle>
      
    </div>
    </div>
    </>
  );
};

export default Login;
