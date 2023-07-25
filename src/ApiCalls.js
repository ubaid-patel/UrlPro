import {GetHost } from "./AppConfig";

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
                xhr.open("POST", GetHost()+"RefreshData?token="+localStorage.Token);
                // console.log(GetAuth().token)
                xhr.send();
            }catch(error){
                reject(406,"Invalid Url")
            }
    });
    return(promise)
}

function CreateLink(title,url){
    return(new Promise((resolve,reject)=>{
    try{
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            let reponse = JSON.parse(this.responseText);
            let date = new Date(new Date().getTime()+5.5*60*60);
            let obj = {"url":url,"endpoint":reponse.endpoint,"title":title,"views":0,createdOn:date.toUTCString()}
            if(this.status === 201){
                resolve(obj)
            }else{
                reject(reponse)
            }
        }
        });
        xhr.open("POST", GetHost()+"createLink?url="+url+"&title="+title+"&token="+localStorage.Token);
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
            let response = JSON.parse(this.responseText)
            if(this.status === 202){
                resolve(response)
            }else{
                reject(response)
            }
        }
        });
        xhr.open("PUT", GetHost()+"editLink?token="+localStorage.Token+"&endpoint="+endpoint+"&url="+url+"&title="+title);
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
                    resolve(response);
            }else{
                reject(response)
            }
        }
      });
  
      xhr.open("DELETE", GetHost() + "delete?token=" + localStorage.Token + "&endpoint=" + endpoint);
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
        xhr.open("PUT", GetHost()+"changepassword?oldPassword="+oldPass+"&token="+localStorage.Token+"&newPassword="+newPass);
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
            resolve(response)
        }else{
            reject(response)
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
        xhr.open("PUT", GetHost()+"ChangeName?token="+localStorage.Token+"&newName="+newName);
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
        xhr.open("DELETE", GetHost()+"DeleteAccount?token="+localStorage.Token+"&password="+password);
        xhr.send();
    }))
}
function sendFeedback(message){
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
        xhr.open("POST", GetHost()+"sendFeedback?token="+localStorage.Token+"&message="+message);
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
  
export {CreateLink,RefreshData,LoginUser,saveChanges,DeleteLink,changePassword,GoogleSignin,ForgpotPassword,SignupUser,sendOTP,changeName,deleteAccount,sendFeedback}