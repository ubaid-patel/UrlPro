import React from "react";
import { GetAuth, displayOneByOne,GetHost } from "./AppConfig";

function CreateLink(data){
    return(new Promise((resolve,reject)=>{
    try{
        let url = new URL(data.get("url"))
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let reponse = JSON.parse(this.responseText);
            let obj = {"url":data.get("url"),"endpoint":reponse.endpoint,"title":data.get("title"),"views":0}
            resolve(obj)
        }
        });
        xhr.open("POST", GetHost()+"createLink?url="+data.get("url")+"&title="+data.get("title")+"&token="+GetAuth().token);
        xhr.send();
    }catch(error){
        reject("Invalid Url")
    }
    }))
}

function LoginUser(email,password,nav){
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    let response = JSON.parse(this.responseText);
    document.getElementById("btnloader").style="display:none;";
    if(response.status === 1){
        localStorage.setItem("Auth",JSON.stringify(response))
        displayOneByOne(response.message,"loginResult",40,"success").then(()=>{
            setTimeout(()=>{nav("/Dashboard")},500)
        })
        
    }else{
        displayOneByOne(response.message,"loginResult",40,"failed")
    }
  }
});
xhr.open("POST", GetHost()+"login?email="+email+"&password="+password);
xhr.send();
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

            if(response.status === 1){
                resolve(response.message)
            }else{
                reject(response.message)
            }
        }
        });
        xhr.open("POST", GetHost()+"editLink?token="+GetAuth().token+"&endpoint="+endpoint+"&url="+url+"&title="+title);
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
          if(response.status === 1){
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
          } else {
            reject(response);
          }
        }
      });
  
      xhr.open("POST", GetHost() + "delete?token=" + GetAuth().token + "&endpoint=" + endpoint);
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
            if(response.status === 1){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("POST", GetHost()+"changepassword?oldPassword="+oldPass+"&token="+GetAuth().token+"&newPassword="+newPass);
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
        if(response.status === 1){
            resolve(response)
        }else{
            reject(response)
        }    
    }
    });
    xhr.open("POST", GetHost()+"forgotPassword?email="+email+"&password="+password+"&otp="+otp);
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
        if(response.status  === 1){
            let auth = {token:"",status:0,name:"",links:[]}
            auth.token = response.token;
            auth.status = 1;
            auth.name = response.name;
            localStorage.setItem("Auth",JSON.stringify(auth))
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
                    resolve(response)
                }else{
                    resolve({status:1,message:"OTP sent successfully"})
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
            if(response.status === 1){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("POST", GetHost()+"ChangeName?token="+GetAuth().token+"&newName="+newName);
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
            if(response.status === 1){
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
            if(response.status === 1){
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
export {CreateLink,LoginUser,saveChanges,DeleteLink,changePassword,ForgpotPassword,SignupUser,sendOTP,changeName,deleteAccount,SendFeedback}