import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SignupUser, sendOTP, GoogleSignin } from './ApiCalls';
import { displayOneByOne } from './AppConfig';
import { useGoogleLogin } from '@react-oauth/google';
import styles from './css/signup.module.css'
import { useDispatch } from 'react-redux';
import { updateAuth,updateLoggedIn } from './reducers/authSlice';

const Signup = () => {
  const [isOtpSent, setOtpSent] = useState(false)
  const nav = useNavigate();
  const dispatch = useDispatch();
  const formObject = useRef(null),
    passwordRef = useRef(null),
    MainContRef = useRef(null),
    loaderRef = useRef(null),
    resendLoaderRef = useRef(null),
    MessageRef = useRef(null),
    formContRef = useRef(null),
    obj = { name: null, password: null, email: null };

  //Creates a simplified Object from FormDataObject
  if (formObject.current !== null) {
    obj.name = formObject.current.get("name");
    obj.email = formObject.current.get("email");
    obj.password = formObject.current.get("password");
  } else {
    obj.name = '';
    obj.email = '';
    obj.password = '';
  }


  //Initial Ui animation
  useEffect(() => {
    MainContRef.current.classList.add(styles.showMainCont)
  })

  //Updating state with Transition Effect
  function setOtpSentWithAnimation(otpSent) {
    if (otpSent) {
      if (formContRef.current.classList.contains(styles.expand)) {
        formContRef.current.classList.remove(styles.expand);
      } else {
        formContRef.current.classList.add(styles.hide);
      }
      setTimeout(() => {
        setOtpSent(true)
        formContRef.current.classList.add(styles.expand);
      }, 300)
    } else {
      formContRef.current.classList.remove(styles.expand);
      setTimeout(() => {
        setOtpSent(false)
        formContRef.current.classList.add(styles.expand)
      }, 300)
    }
  }


  //Verify Email pattern and Send Otp
  function handleSendOTP(event) {
    event.preventDefault();
    loaderRef.current.classList.add(styles.visible);
    formObject.current = new FormData(event.target);
    let email = formObject.current.get('email');
    const emailcheck = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|yahoo|icloud|aol|protonmail|zoho|mail|gmx|fastmail)\.(com|net|org|edu|gov|mil|info|biz|co|uk)$/i
    if (emailcheck.test(email)) {
      sendOTP(email, 0).then(
        (response) => {
          MessageRef.current.style = "display:none";
          setOtpSentWithAnimation(true)
        },
        (response) => { displayOneByOne(response.message, MessageRef, 40, "failed") }
      ).finally(
        () => {
          loaderRef.current.classList.remove(styles.visible);
        }
      )
    } else {
      displayOneByOne("Mail provider not supported", MessageRef, 40, "failed").then(
        () => {
          loaderRef.current.classList.remove(styles.visible);
        }
      )

    }
  }

  //Resends OTP
  const resendOTP = () => {
    resendLoaderRef.current.classList.add(styles.visible);
    sendOTP(obj.email, 0).then(
      (response) => {
        displayOneByOne("OTP resent retry after 1 min", MessageRef, 40, "success")
      },
      (response) => { displayOneByOne(response.message, MessageRef, 40, "failed") }
    ).finally(
      () => {
        resendLoaderRef.current.classList.remove(styles.visible);
      }
    )
  }

  function SignupWithOTP(event) {
    event.preventDefault();
    let otp = new FormData(event.target).get("otp");
    obj.otp = otp;
    SignupUser(obj).then(
      (response) => {
        displayOneByOne(response.message, MessageRef, 40, "success").then(
          () => {
            setTimeout(() => {
              dispatch(updateAuth(response))
              localStorage.Token = response.Token;
              nav("/Dashboard")
            }, 1500)
          }
        )
      },
      (response) => {
        displayOneByOne(response.message, MessageRef, 40, "failed")
      }
    );
  }
  const SignupWithGoogle = useGoogleLogin(
    {
      onSuccess: (data) => {
        dispatch(updateLoggedIn(true))
        GoogleSignin(data.access_token).then(
          (response) => {
            dispatch(updateAuth(response))
            localStorage.Token = response.Token;
          },
          (response) => {
            console.log(response.message)
          }
        )
        nav('/DashBoard');
      }
    }
  );

  function ToggleShowPass(event) {
    if (event.target.checked) {
      passwordRef.current.type = 'text';
    } else {
      passwordRef.current.type = 'password';
    }
  }

  return (
    <React.Fragment>
      <div className={styles.MainCont} ref={MainContRef}>
        <div className={`${styles.form}`} ref={formContRef}>
          <h3 ref={MessageRef}></h3>
          {(!isOtpSent ?
            <form method="post" onSubmit={handleSendOTP}>
              <input required type="text" name="name" placeholder="Full name" defaultValue={obj.name} /><br />
              <input required type="email" name="email" placeholder="Email" defaultValue={obj.email} /><br />
              <input required ref={passwordRef} type="password" name="password" placeholder="Password" defaultValue={obj.password} /><br />
              <input type="checkbox" onChange={ToggleShowPass} /> Show Password<br /><br />
              <button type="submit" className={styles.submitBtn}>Signup<div ref={loaderRef} className={styles.smLoader}></div></button>
            </form>
            :
            <form method="post" onSubmit={SignupWithOTP}>
              <h2>Enter OTP</h2>
              A 6 Digit code is sent to your email adderss {obj.email}<br />
              <span onClick={() => { setOtpSentWithAnimation(false) }}>Change email address</span>
              <button type='button' className={styles.resendBtn} onClick={resendOTP}>
                Resend OTP
                <div ref={resendLoaderRef} className={styles.smLoader}></div>
              </button>
              <input required type="text" name="otp" placeholder="OTP" /><br />
              <div>
                <button type="submit" className={styles.submitBtn}>Verify <div ref={loaderRef} className={styles.smLoader}></div></button>
              </div>
            </form>
          )}
          <Link to="/login" className={styles.Links}>Already have an account? Login</Link>
          <div id={styles.googleLogin} onClick={SignupWithGoogle}><img src="/static/google.svg" /> Continue with google</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signup;
