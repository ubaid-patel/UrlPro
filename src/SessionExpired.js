import React from 'react';
import { initState } from './AppConfig';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, updateAuth } from './reducers/authSlice';
import Login from './Login';
 

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
      <Login />
  )
}
export default SessionExpired;