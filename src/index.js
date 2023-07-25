import React from 'react';
import ReactDOM from 'react-dom/client';
import "./css/index.css"
import "./css/dashboard.css"
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,Routes,Route,RouterProvider,createBrowserRouter,createRouter } from 'react-router-dom';
import TopNav from './TopNav';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import LogoutUser from './Logout';
import DashBoard from './DashBoard';
import Settings from './Settings';
import SendFeedback from './SendFeedback';
import Loading from './Loading';
import Admin from './Admin';
import SessionExpired from './SessionExpired';
import { RefreshData } from './ApiCalls';
import { useNavigate } from 'react-router-dom';
import { createStore } from 'redux';
import LinksManagement from './LinksManagement';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CancelSvg from './CancelSvg';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { GoogleOAuthProvider } from '@react-oauth/google';
 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <GoogleOAuthProvider clientId='1073579154631-nr0b438d5sqljlqfjkiev25ujshf3cs2.apps.googleusercontent.com'>
<Provider store={store}>
      <BrowserRouter>
      <TopNav/>
            <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/admin" element={<Admin/>} />
                  <Route path="/loading" element={<Loading/>} />
                  <Route path="/dashboard" element={<DashBoard   />} />
                  <Route path="/settings" element={<Settings/>} />
                  <Route path="/feedback" element={<SendFeedback/>} />
                  <Route path="/signup" element={<Signup/>} />
                  <Route path="/logout" element={<LogoutUser/>} />
                  <Route path="/sessionExpired" element={<SessionExpired/>} />
                  <Route path="/forgotPassword" element={<ForgotPassword/>} />
            </Routes>
      </BrowserRouter>
</Provider>
</GoogleOAuthProvider>
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();