import React, { useState,useEffect } from 'react';
import { json, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SignupUser,sendOTP, GoogleSignin } from './ApiCalls';
import { displayOneByOne } from './AppConfig';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { LoginSocialGoogle } from 'reactjs-social-login';

const clientId = "679480088996-jptefnvqmp7a7qfrab6frjoq4f3nkn64.apps.googleusercontent.com";
const scope = "https://www.googleapis.com/auth/userinfo.profile";

const Signup = () => {
  const nav = useNavigate();
  const[emailId,setEmail]=useState();
    useEffect(()=>{
      let cont = document.getElementsByClassName("MainCont")[0] ;
      cont.classList.add("visible")
  })
  const GoogleSignup = ()=>{

  }
  function sendOtp(e){
    let form = new FormData(e.target);
    setEmail(form.get("email"))
    const emailcheck = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|yahoo|icloud|aol|protonmail|zoho|mail|gmx|fastmail)\.(com|net|org|edu|gov|mil|info|biz|co|uk)$/i
    if(emailcheck.test(form.get("email"))){
      sendOTP(form.get("email"),0).then(
        (response)=>{
          if(response.status === 1){
            displayOneByOne(response.message,"SignupResult",40,"success")
          }else{
            displayOneByOne(response.message,"SignupResult",40,"failed")
          }
        }
      )
    }else{
        displayOneByOne("Mail provider not supported","SignupResult",40,"failed")
      }  
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
              nav("/Dashboard")
            },1500)
          }
        )
      },
      (message) => {
        document.getElementById("btnloader").style="display:none;";
        displayOneByOne(message,"SignupResult",40,"failed")
      }
    );
  }

  return (
    <>
    <div className="statusBar statusBarRun"></div>
    <div className="MainCont">
    <div className='forms addanim' id="form">
      <form method="post" onSubmit={(e) => { e.preventDefault(); sendOtp(e) }}>
        <input required type="text" id="nameInput" name="name" placeholder="Full name" className="inputText" /><br/>
        <input required type="email" id="emailInput" name="email" placeholder="Email" className="inputText"/><br/>
        <input required type="password" id="passwordInput" name="password" placeholder="Password" className="inputText" /><br/>
        <input type="checkbox" id="showPass"onChange={(e)=>{
          let elem = document.getElementById("passwordInput");
          if(e.target.checked){
            elem.type="text"
          }else{
            elem.type="password"
          }
        }}/> Show Password<br/><br/>
          <button type="submit" className="Button submitBtn">Signup</button>
      </form>
      <Link to="/login" className='Links' style={{marginTop:"10px"}}>Already have an account? Login</Link>
      <LoginSocialGoogle
      client_id={'1073579154631-nr0b438d5sqljlqfjkiev25ujshf3cs2.apps.googleusercontent.com'}
      scope='openid profile email'
      discoveryDocs='claims_supported'
      access_type='offline'
      typeResponse='accessToken'
      onResolve={(response)=>{
        // console.log(response)
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
      <div className='forms' id="verify" style={{display:"none"}}>
      <p id="SignupResult"></p>
      <form  method="post" onSubmit={(e) => { e.preventDefault(); CreateAccount(e) }}>
        <p className='formTitle'>
          <h2>Enter OTP</h2>
          A 6 Digit code is sent to your email adderss {emailId}<br/>
          <span onClick={()=>{
            setTimeout(() => {
              document.getElementById("verify").style="display:none;"
              document.getElementById("form").classList.remove("sendotpanimate")
              document.getElementById("form").style="display:block;"
            }, 100);  
          }}>Change email address</span>  <button type='button' className='formInlinebtn' onClick={
            (e)=>{
              e.target.setAttribute("disabled",true)
                let time = 59;
                let timer = setInterval(()=>{
                  e.target.innerHTML = "Resend in "+time+"s";
                  if(time === 0){
                    e.target.removeAttribute("disabled")
                    e.target.innerHTML = "Resend OTP";
                    clearInterval(timer)
                  }
                  time--
                },1000)
              sendOTP(document.getElementById("emailInput").value,0).then(
                (response)=>{displayOneByOne(response.message,"SignupResult",40,(response.status === 1)?"success":"failed")}
              )
            }
          }>Resend OTP</button>        
        </p>
        <input required type="text" name="otp" id="otpInput" placeholder="OTP" className="inputText"/><br/>
        <div style={{ textAlign: 'center' }}>
        <button type="submit" style={{margin:"auto",marginBottom:"40px",marginTop:"30px",display:"flex",alignItems:"center"}} className="Button submitBtn">Verify <div id="btnloader" className="smLoader smaller-cut hide"></div></button>
        </div>
      </form>
      </div>
      </div>
    </>
  );
};

export default Signup;
