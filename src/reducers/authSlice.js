import { createSlice } from "@reduxjs/toolkit";
import { GetAuth } from "../AppConfig";

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
        links:[{endpoint: 'URLPRO', title: 'Example Link', url: 'https://example.com', views: 0}],
        // For admin useOnly
        users:undefined,
        feedbacks:undefined,
        }
    },
    reducers:{
        updateLinks:(state,action)=>{
            state.auth.links = action.payload;
        },
        updateName:(state,name)=>{
            state.auth.name = name;
        },
        updateAuth:(state,action)=>{
            // console.log(
            //     "Iam from state update here is the payload \n",
            //     action.payload,
            //     "Here is the state \n",
            //     state
            // )
            state.auth = action.payload;
        },
        updateCount:(state,action)=>{
            state.auth.count = action.payload;
        },
    }
})
export const selectAuth = (state)=>state.auth.auth;

export const {updateLinks,updateName,updateAuth,updateCount} = authSlice.actions;
export default authSlice.reducer;