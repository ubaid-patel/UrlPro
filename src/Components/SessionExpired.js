import React from 'react';
import { initState } from '../AppConfig';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateAuth } from '../reducers/authSlice';
import Login from './Login';
 

function SessionExpired() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.Token) {
      localStorage.removeItem("Token")
      dispatch(updateAuth(initState()))
    }
  }, [])
  return (
      <Login />
  )
}
export default SessionExpired;