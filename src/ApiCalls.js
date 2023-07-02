import React from "react";
import { GetAuth, displayOneByOne,GetHost } from "./AppConfig";

function RefreshData(){
    let promise = new Promise((resolve,reject)=>{
            try{
                let xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function() {
                if(this.readyState === 4) {
                    let response = JSON.parse(this.responseText);
                    if(this.status === 200){
                        resolve(response)
                    }else{
                        reject(response)
                    }
                }
                });
                xhr.open("POST", GetHost()+"RefreshData?token="+GetAuth().token);
                console.log(GetAuth().token)
                xhr.send();
            }catch(error){
                reject(406,"Invalid Url")
            }
    });
    return(promise)
}

function CreateLink(data){
    let url = encodeURIComponent(data.get("url"));
    return(new Promise((resolve,reject)=>{
    try{
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let reponse = JSON.parse(this.responseText);
            let obj = {"url":data.get("url"),"endpoint":reponse.endpoint,"title":data.get("title"),"views":0}
            if(this.status === 201){
                resolve(obj)
            }else{
                reject(reponse)
            }
        }
        });
        xhr.open("POST", GetHost()+"createLink?url="+url+"&title="+data.get("title")+"&token="+GetAuth().token);
        xhr.send();
    }catch(error){
        reject(406,"Invalid Url")
    }
    }))
}

function LoginUser(email,password){
let xhr = new XMLHttpRequest();
return new Promise(
    (resolve,reject)=>{
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let response = JSON.parse(this.responseText);
            if(this.status === 200){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("POST", GetHost()+"login?email="+email+"&password="+password);
        xhr.send();
    }
)
}


function saveChanges(endpoint,title,url){
    return(new Promise((resolve,reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            document.getElementById("btnloader").style="display:none;"
            let response = JSON.parse(this.responseText)
            let auth = GetAuth();
            auth.links.forEach((link,index) => {
                if(link.endpoint === endpoint){
                    link.url = url
                    link.title = title
                }
            });
            localStorage.setItem("Auth",JSON.stringify(auth))
            if(this.status === 202){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("PUT", GetHost()+"editLink?token="+GetAuth().token+"&endpoint="+endpoint+"&url="+url+"&title="+title);
        xhr.send();
    }))
}

async function DeleteLink(endpoint){
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
  
      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let response = JSON.parse(this.responseText);
            if(this.status === 202){
                let data = GetAuth();
                    let newarr =[];
                    data.links.forEach((link,index)=>{
                      if(link.endpoint != endpoint){
                        newarr.push(link)
                      }
                    })
                    data.links=newarr;
                    localStorage.setItem("Auth",JSON.stringify(data))
                    resolve(response);
            }else{
                reject(response)
            }
        }
      });
  
      xhr.open("DELETE", GetHost() + "delete?token=" + GetAuth().token + "&endpoint=" + endpoint);
      xhr.send();
    });
  }
function changePassword(oldPass,newPass){
    return new Promise((resolve,reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let response = JSON.parse(this.responseText);
            if(this.status === 202){
                resolve(response)
            }else{
                console.log(response.message)
                reject(response)
            }
        }
        });
        xhr.open("PUT", GetHost()+"changepassword?oldPassword="+oldPass+"&token="+GetAuth().token+"&newPassword="+newPass);
        xhr.send();
    })
}

function ForgpotPassword(email,password,otp){
    return new Promise((resolve,reject)=>{
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        let response = JSON.parse(this.responseText);
        if(this.status === 202){
            resolve(response)
        }else{
            reject(response)
        }    
    }
    });
    xhr.open("PUT", GetHost()+"forgotPassword?email="+email+"&password="+password+"&otp="+otp);
    xhr.send();
    })
}

function SignupUser(data){
    return new Promise((resolve,reject)=>{
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        let response = JSON.parse(this.responseText);
        if(this.status  === 201){
            let auth = {token:"",status:0,name:"",links:[]}
            auth.token = response.token;
            auth.status = 1;
            auth.name = response.name;
            localStorage.setItem("Auth",JSON.stringify(response))
            resolve(response.message)
        }else{
            reject(response.message)
        }
    }
    });
    xhr.open("POST", GetHost()+"signup?email="+data.email+"&password="+data.password+"&name="+data.name+"&otp="+data.otp);
    xhr.send();
    })
}
async function sendOTP(email,type){
    return( new Promise((resolve,reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 1) {
            setTimeout(()=>{
                if(this.readyState === 4){
                    let response = JSON.parse(this.responseText)
                    if(this.status === 201){
                        resolve(response)
                    }else{
                        reject(response)
                    }
                }else{
                    resolve({message:"OTP sent successfully"})
                }
            },3000)
            if(this.readyState === 4){
                console.log(this.responseText)
            }
        }
        });
        if(type === 0){
            xhr.open("POST", GetHost()+"sendOtp?email="+email);
        }else{
            xhr.open("POST", GetHost()+"userSendOtp?email="+email);
        }
        xhr.send();
    }))}
function changeName(newName){
    return(new Promise((resolve,reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let response = JSON.parse(this.responseText)
            if(this.status === 202){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("PUT", GetHost()+"ChangeName?token="+GetAuth().token+"&newName="+newName);
        xhr.send();
    }))
}
function deleteAccount(password){
    return(new Promise((resolve,reject)=>{        
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let response = JSON.parse(this.responseText)
            if(this.status === 202){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("DELETE", GetHost()+"DeleteAccount?token="+GetAuth().token+"&password="+password);
        xhr.send();
    }))
}
function SendFeedback(message){
    return(new Promise((resolve,reject)=>{        
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let response = JSON.parse(this.responseText)
            if(this.status === 201){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("POST", GetHost()+"sendFeedback?token="+GetAuth().token+"&message="+message);
        xhr.send();
    }))
}

function GoogleSignin(accessToken) {
    return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        if(this.status === 200){
            resolve(JSON.parse(this.responseText))
        }else{
            reject(JSON.parse(this.responseText))
        }
    }
    });
    xhr.open("GET", GetHost()+"GoogleSignin?accessToken="+accessToken);
    xhr.send();
    })
  }
  
export {CreateLink,RefreshData,LoginUser,saveChanges,DeleteLink,changePassword,GoogleSignin,ForgpotPassword,SignupUser,sendOTP,changeName,deleteAccount,SendFeedback}