import React from 'react';
import ReactDOM from 'react-dom/client';
import "./css/index.css"
import "./css/dashboard.css"
import reportWebVitals from './reportWebVitals';
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import TopNav from './TopNav';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import LogoutUser from './Logout';
import DashBoard from './DashBoard';
import Settings from './Settings';
import Feedback from './Feedback';
import { GoogleOAuthProvider } from '@react-oauth/google';
const routes = createBrowserRouter([
  {path:"",element:<><TopNav/><Home/></>},
  {path:"/login",element:<><TopNav/><Login/></>},
  {path:"/Dashboard",element:<><TopNav/><DashBoard/></>},
  {path:"/Settings",element:<><TopNav/><Settings/></>},
  {path:"/Feedback",element:<><TopNav/><Feedback/></>},
  {path:"/signup",element:<><TopNav/><Signup/></>},
  {path:"/logout",element:<><TopNav/><LogoutUser/></>},
  {path:"/changePassword",element:<><TopNav/><ChangePassword/></>},
  {path:"/forgotPassword",element:<><TopNav/><ForgotPassword/></>},
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId='679480088996-tilrerpurr8qh56gc08por5q5tdvns3t.apps.googleusercontent.com'>
      <RouterProvider router={routes} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
