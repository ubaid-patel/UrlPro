import React from 'react';
import ReactDOM from 'react-dom/client';
import "./css/index.css"
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './Components/TopNav';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import LogoutUser from './Components/Logout';
import DashBoard from './Components/DashBoard';
import Settings from './Components/Settings';
import SendFeedback from './Components/SendFeedback';
import Admin from './Components/Admin';
import SessionExpired from './Components/SessionExpired';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <GoogleOAuthProvider clientId='1073579154631-nr0b438d5sqljlqfjkiev25ujshf3cs2.apps.googleusercontent.com'>
            <Provider store={store}>
                  <BrowserRouter>
                        <TopNav />
                        <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/admin" element={<Admin />} />
                              <Route path="/dashboard" element={<DashBoard />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/feedback" element={<SendFeedback />} />
                              <Route path="/signup" element={<Signup />} />
                              <Route path="/logout" element={<LogoutUser />} />
                              <Route path="/sessionExpired" element={<SessionExpired />} />
                              <Route path="/forgotPassword" element={<ForgotPassword />} />
                        </Routes>
                  </BrowserRouter>
            </Provider>
      </GoogleOAuthProvider>
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();