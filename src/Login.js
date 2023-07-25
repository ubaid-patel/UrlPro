import React from 'react';
import { Link } from 'react-router-dom';
import { LoginUser, GoogleSignin } from './ApiCalls';
import { displayOneByOne } from './AppConfig';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAuth,updateLoggedIn } from './reducers/authSlice';
import styles from './css/login.module.css';
import { useGoogleLogin } from '@react-oauth/google';
const Login = () => {
  const loginResult = useRef(null),
    MainContRef = useRef(null),
    loaderRef = useRef(null);
  const nav = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    MainContRef.current.classList.add(styles.showMainCont)
  }, [])

  function LoginWithPassword(event) {
    event.preventDefault();
    loaderRef.current.classList.add(styles.visible);

    let data = new FormData(event.target);
    LoginUser(data.get("email"), data.get("password")).then(
      (response) => {
        loaderRef.current.classList.remove(styles.visible)
        localStorage.setItem("Token", response.token)
        displayOneByOne(response.message, loginResult, 40, "success").then(() => {
          setTimeout(() => {
            nav("/Dashboard")
            dispatch(updateAuth(response))
          }, 500)
        })
      },
      (response) => {
        loaderRef.current.classList.remove(styles.visible)
        displayOneByOne(response.message, loginResult, 40, "failed")
      }
    )
  }
  const LoginWithGoogle = useGoogleLogin({
    onSuccess: (data) => {
      dispatch(updateLoggedIn(true));
      GoogleSignin(data.access_token).then(
        (response) => {
          dispatch(updateAuth(response));
          localStorage.Token = response.token;
        },
        (response) => {
          console.log(response.message)
        }
      )
      nav("/Dashboard")
    },
  })
  return (
    <React.Fragment>
      <div className={`${styles.statusBar} ${styles.statusBarRun}`}></div>
      <div ref={MainContRef} className={styles.MainCont}>
        <div className={styles.forms}>
          {/* Displays session expired message if pathname is session expired */}
          {(window.location.pathname.toUpperCase() === '/SESSIONEXPIRED') ?
            <React.Fragment>
              <img src='static/clock.svg'></img>
              <h4>Session Expired Please Relogin</h4>
            </React.Fragment>
            : <React.Fragment></React.Fragment>}
          <h4 ref={loginResult}></h4>
          <form onSubmit={LoginWithPassword}>
            <input type="email" required name="email" placeholder="Enter Email" className={styles.inputText} />
            <input type="password" required name="password" placeholder="Enter Password" className={styles.inputText} />
            <button type="submit" className={styles.submitBtn}>Login
              <div ref={loaderRef} className={styles.smLoader}></div></button>
            <Link to="/forgotPassword" className={styles.Links}>Forgot password?</Link>
            <Link to="/signup" className={styles.Links}>Dont have an account?</Link>
          </form>
          <div id={styles.googleLogin} onClick={LoginWithGoogle}><img src="/static/google.svg" /> Continue with google</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
