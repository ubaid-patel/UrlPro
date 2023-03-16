import React from 'react';
import { Link } from 'react-router-dom';
import { LoginUser } from './ApiCalls';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const Login = () => {
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
      <div id="googleLogin"><img src="/static/google.svg"/> Signin with google</div>
    </div>
    </div>
    </>
  );
};

export default Login;
