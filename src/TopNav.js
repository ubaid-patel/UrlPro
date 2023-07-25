import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshData } from './ApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, updateAuth } from './reducers/authSlice';
import styles from './css/topNav.module.css'
function TopNav() {
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const propMenu = useRef(null),
    userCircleRef = useRef(null);

  useEffect(() => {
    if (localStorage.Token) {
      RefreshData().then(
        (data) => {
          dispatch(updateAuth(data))
          localStorage.setItem("Token", data.token)
        },
        (message) => {
          navigate("/SessionExpired")
        })
    }
  }, [])
  const token = auth.token;
  const picture = auth.picture;
  // console.log(auth.token)

  //Check and display profile picture
  useEffect(() => {
    if (userCircleRef.current) {
      if (picture === null) {
        userCircleRef.current.src = "static/userCircle.svg"
        userCircleRef.current.id = styles.userCircle
      } else {
        userCircleRef.current.src = picture
        userCircleRef.current.id = styles.userPicture
      }
    }
  }, [auth])

  function handleMouse1(event) {
    switch (event.type) {
      case 'mouseover':
        if (propMenu.current.classList.contains(styles.active)) {
          propMenu.current.classList.add(styles.active)
          propMenu.current.classList.remove(styles.hide)
        }
        break;
      case 'mouseleave':
        propMenu.current.classList.add(styles.hide)
        propMenu.current.classList.remove(styles.active)
        break;
    }
  }
  function handleMouse0(event) {
    switch (event.type) {
      case 'mouseover':
        propMenu.current.classList.remove(styles.hide)
        propMenu.current.classList.add(styles.active)
        break;
      case 'mouseleave':
        propMenu.current.classList.add(styles.hide)
        break;
    }
  }
  return (
    <div id={styles.TopNav}>
      <img id={styles.logo} src='static/logo.svg' alt="Logo" onClick={() => navigate('/')} />
      {(token === undefined) ?
        <div id={styles.buttons}>
          <button className={styles.button} onClick={() => navigate('/login')}>
            Login
          </button>
          <button className={styles.button} onClick={() => navigate('/signup')}>
            Signup
          </button>
        </div>
        :
        <div className={styles.profileContainer} onMouseOver={handleMouse1} onMouseLeave={handleMouse1}>
          <div className={styles.Profile} onMouseOver={handleMouse0} onMouseLeave={handleMouse0}>
            <img ref={userCircleRef} />
          </div>
          <div className={`${styles.profileMenu} ${styles.hide}`} ref={propMenu}>
            <ul>
              <Link to="/Dashboard"><li>DashBoard</li></Link>
              <Link to="/Settings"><li>Settings</li></Link>
              <Link to="/Feedback"><li>Send Feedback</li></Link>
              <Link to="/Logout"><li>Logout</li></Link>
            </ul>
          </div>
        </div>
      }
    </div>
  )
}

export default TopNav;
