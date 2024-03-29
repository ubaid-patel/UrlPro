import { createSlice } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
function getLinks(){
    if(localStorage.Token){
      return[]
    }else{
      if(localStorage.Links){
        return JSON.parse(localStorage.Links)
      }else{
        return[]
      }
    }
  }

export const authSlice = createSlice({
    name:"auth",
    initialState:{
        auth:{
        isLoggedIn:false,
        count:0,
        message:null,
        name:null,
        picture:null,
        token:localStorage.Token,
        links:getLinks(),
        // For admin useOnly
        users:undefined,
        feedbacks:undefined,
        }
    },
    reducers:{
        updateLoggedIn:(state,action)=>{
            state.auth.isLoggedIn = action.payload;
        },
        updateLinks:(state,action)=>{
            state.auth.links = action.payload;
        },
        updateName:(state,action)=>{
            state.auth.name = action.payload;
        },
        updateAuth:(state,action)=>{
            state.auth = action.payload;
        },
        updateCount:(state,action)=>{
            state.auth.count = action.payload;
        },
    }
})
export const selectAuth = (state)=>state.auth.auth;

export const {updateLinks,updateName,updateAuth,updateCount,updateLoggedIn} = authSlice.actions;
export default authSlice.reducer;