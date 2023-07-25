import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { sendOTP, ForgpotPassword } from './ApiCalls';
import { useNavigate } from 'react-router-dom';
import { displayOneByOne } from './AppConfig';
import { useEffect } from 'react';
import styles from './css/forgotPasssword.module.css'
const ForgotPassword = () => {
  //stage is used to send otp and reset password conditionally
  const [stage, setStage] = useState(0);
  const [showPass, setShowPass] = useState(false);

  //Refs
  const MainContRef = useRef(null),
    emailRef = useRef(null),
    passwordRef = useRef(null),
    otpRef = useRef(null),
    submitRef = useRef(null),
    resendRef = useRef(null),
    loaderRef = useRef(null),
    resendLoaderRef = useRef(null),
    submitTextRef = useRef("Send OTP"),
    messageRef = useRef(null);
  let navigate = useNavigate();

  //initial ui animation
  useEffect(() => {
    MainContRef.current.classList.add("visible")
  })

  // conditional disabling of inputs
  useEffect(() => {
    if (stage == 0) {
      if (emailRef.current.disabled) {
        emailRef.current.removeAttribute("disabled")
      }
      otpRef.current.setAttribute("disabled", "true");
      resendRef.current.setAttribute("disabled", 'true');
      passwordRef.current.setAttribute("disabled", "true");
    } else {
      otpRef.current.removeAttribute("disabled");
      passwordRef.current.removeAttribute("disabled");
      emailRef.current.setAttribute("disabled", "true");
      resendRef.current.removeAttribute("disabled")
    }
  }, [stage])

  useEffect(() => {
    if (showPass == false) {
      passwordRef.current.type = 'password';
    } else {
      passwordRef.current.type = 'text';
    }
  }, [showPass])

  function ToggleShowPass(checkbox) {
    (checkbox.checked) ? setShowPass(true) : setShowPass(false)
  }

  //Conditional function call
  function handleSubmit(event) {
    loaderRef.current.classList.add(styles.visible)
    event.preventDefault()
    if (stage === 0) {
      SendOTP();
    } else {
      ResetPassword();
    }
  }

  function SendOTP() {
    sendOTP(emailRef.current.value, 1).then(
      (response) => {

        displayOneByOne(response.message, messageRef, 40, "success")
        submitTextRef.current = "Reset Password"
        setStage(1)
      },
      (response) => {
        displayOneByOne(response.message, messageRef, 40, "failed")
      }
    ).finally(() => {
      loaderRef.current.classList.remove(styles.visible)
    })
  }

  function ResetPassword() {
    submitRef.current.setAttribute("disabled", true)
    ForgpotPassword(emailRef.current.value, passwordRef.current.value, otpRef.current.value).then(
      (response) => {
        displayOneByOne(response.message, messageRef, 40, "success").then(
          () => {
            setTimeout(() => {
              navigate("/login")
            }, 300)
          }
        )
      },
      (response) => {
        displayOneByOne(response.message, messageRef, 40, "failed")
      }
    ).finally(() => {
      submitRef.current.removeAttribute("disabled")
      loaderRef.current.classList.remove(styles.visible)
    })
  }

  function resendOTP() {
    if (stage === 1) {
      resendLoaderRef.current.classList.add(styles.visible);
      sendOTP(emailRef.current.value, 1).then(
        (response) => {
          displayOneByOne("OTP resent retry after 1 min.", messageRef, 40, "success")
        },
        (response) => {
          displayOneByOne(response.message, messageRef, 40, "success")
        }
      ).finally(
        () => {
          resendLoaderRef.current.classList.remove(styles.visible)
        }
      );
    }
  }
  return (
    <React.Fragment>
      <div className={`${styles.statusBar} ${styles.statusBarRun}`}></div>
      <div className={styles.MainCont} ref={MainContRef}>
        <div className={styles.forms}>
          <h4 ref={messageRef}></h4>
          <form onSubmit={(e) => { handleSubmit(e); }}>
            <div className={styles.emailAndEdit}>
              <input type="email" required ref={emailRef} placeholder="Email" className={styles.inputText} />
              <span onClick={() => { submitTextRef.current = "Send OTP"; setStage(0) }}>Edit</span>
            </div>
            <div className={styles.otpAndResend}>
              <input type="text" ref={otpRef} placeholder="One-time-password" className={styles.inputText} />
              <div ref={resendRef} onClick={resendOTP}>Resend otp</div>
              <div className={styles.smLoader} ref={resendLoaderRef}></div>
            </div>
            <input type="password" ref={passwordRef} placeholder="New password" className={styles.inputText} /><br />
            <input type="checkbox" onChange={(e) => { ToggleShowPass(e.target) }} /> Show Password
            <button type="submit" ref={submitRef} className={styles.submitBtn} >
              {submitTextRef.current}
              <div className={styles.smLoader} ref={loaderRef}></div></button>
            <Link to="/Login" className={styles.Links}>Login instead?</Link>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
