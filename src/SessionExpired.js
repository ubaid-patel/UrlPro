import React from 'react';
import { Link } from 'react-router-dom';
import { LoginUser, GoogleSignin } from './ApiCalls';
import { displayOneByOne, initState } from './AppConfig';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, updateAuth } from './reducers/authSlice';
import Login from './Login';
import styles from './css/sessionExpired.module.css'

function SessionExpired() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const nav = useNavigate();
  useEffect(() => {
    if (localStorage.Token) {
      localStorage.removeItem("Token")
      dispatch(updateAuth(initState()))
    }
  }, [])
  let Nav = useNavigate();
  return (
    <React.Fragment>
      <div className={styles.Container}>
        <img src='static/clock.svg'></img>
        <h4>Session Expired Please Relogin</h4>
      </div>
      <Login />
    </React.Fragment>
  )
}
export default SessionExpired;