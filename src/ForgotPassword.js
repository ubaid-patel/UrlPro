import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendOTP,ForgpotPassword } from './ApiCalls';
import { useNavigate } from 'react-router-dom';
import { displayOneByOne } from './AppConfig';
import { useEffect } from 'react';
const ForgotPassword = () => {
  let Nav = useNavigate();
  useEffect(()=>{
      let cont = document.getElementsByClassName("MainCont")[0] ;
      cont.classList.add("visible")
  })
  const[stage,setStage]=useState(1);
  return (
    <>
    <div className="statusBar statusBarRun"></div>
    <div className="MainCont">

    <div className='forms' style={{position:"relative"}}>
      <h4 id="loginResult"></h4>
      <form onSubmit={(e)=>{
        e.preventDefault()
        let data = new FormData(e.target);
        let emailinp = document.getElementById("emailInput");
        let passinp = document.getElementById("passwordInput");
        let otpinp = document.getElementById("OTPInput");
        let submitbtn = document.getElementById("mainBtn");
        document.getElementById("btnloader").style="display:block;";
        if(stage === 1){
          sendOTP(data.get("email"),1).then(
            (response)=>{
              displayOneByOne(response.message,"loginResult",40,(response.status === 1)?"success":"failed")
              emailinp.setAttribute("disabled",true)
              passinp.removeAttribute("disabled");
              otpinp.removeAttribute("disabled");
              let ldr = document.createElement("div");
              ldr.id="btnloader"
              ldr.className="smLoader smaller-cut hide";
              submitbtn.innerHTML="Reset password"
              submitbtn.appendChild(
                ldr
              )
              setStage(2)
            },
            (response)=>{
              displayOneByOne(response.message,"loginResult",40,"failed")
            }
          ).finally(()=>{
            document.getElementById("btnloader").style="display:none;";
          })
        }else{
          document.getElementById("btnloader").style="display:block;";
          submitbtn.setAttribute("disabled",true)
          ForgpotPassword(emailinp.value,passinp.value,otpinp.value).then(
            (response)=>{
              displayOneByOne(response.message,"loginResult",40,"success")
            },
            (response)=>{
              displayOneByOne(response.message,"loginResult",40,"failed")
            }
          ).finally(()=>{
            document.getElementById("btnloader").style="display:none;";
            submitbtn.removeAttribute("disabled")
          })
        }
      }}>
      <div style={{position:"relative"}}>
      <input type="email" required name="email" id="emailInput" placeholder="Email" className="inputText" />
      <span style={{
        position:"absolute",
        right:"23px",
        top:"32px"
      }} onClick={
        ()=>{
          let emailinp = document.getElementById("emailInput");
          let passinp = document.getElementById("passwordInput");
          let otpinp = document.getElementById("OTPInput");
          let submitbtn = document.getElementById("mainBtn");
            emailinp.removeAttribute("disabled")
            passinp.setAttribute("disabled",true);
            otpinp.setAttribute("disabled",true);
            let ldr = document.createElement("div");
            ldr.id="btnloader"
            ldr.className="smLoader smaller-cut hide";
            submitbtn.innerHTML="Send OTP"
            submitbtn.appendChild(
              ldr
            )
            setStage(1)
        }
      }>Edit</span>
      </div>
      <input type="text" disabled id="OTPInput" name="otp" placeholder="One-time-password" className="inputText" />
      <input type="password" disabled id="passwordInput" name="password" placeholder="New password" className="inputText" /><br/>
      <input type="checkbox" id="showPass"onChange={(e)=>{
          let elem = document.getElementById("passwordInput");
          if(e.target.checked){
            elem.type="text"
          }else{
            elem.type="password"
          }
        }}/> Show Password<br/><br/>
      <button type="submit" id="mainBtn" style={{margin:"auto",marginBottom:"10px",marginTop:"30px",display:"flex",alignItems:"center"}} className="Button submitBtn">Send OTP<div id="btnloader" className="smLoader smaller-cut hide"></div></button>
      <Link to="/Login" className='Links'>Login instead?</Link>
      </form>
    </div>
    </div>
    </>
  );
};

export default ForgotPassword;
