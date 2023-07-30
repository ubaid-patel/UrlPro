function GetHost() {
    return (localStorage.Host)
}

function RefreshData() {
    let promise = new Promise((resolve, reject) => {
        try {
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    let response = JSON.parse(this.responseText);
                    if (this.status === 200) {
                        localStorage.Token = response.token
                        resolve(response)
                    } else {
                        reject(this.status)
                    }
                }
            });
            xhr.open("POST", GetHost() + "auth/refreshData?token=" + localStorage.Token);
            // console.log(GetAuth().token)
            xhr.send();
        } catch (error) {
            reject(406, "Invalid Url")
        }
    });
    return (promise)
}

function CreateLink(title, url) {
    return (new Promise((resolve, reject) => {
        try {
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    let reponse = JSON.parse(this.responseText);
                    let date = new Date(new Date().getTime() + 5.5 * 60 * 60);
                    let obj = { "url": url, "endpoint": reponse.endpoint, "title": title, "views": 0, createdOn: date.toUTCString() }
                    if (this.status === 201) {
                        resolve(obj)
                    } else {
                        reject(reponse)
                    }
                }
            });
            let token = localStorage.Token;
            xhr.open("POST", GetHost() + "links/createLink?url=" + url + "&title=" + title + (token ? "&token=" + token : ''));
            xhr.send();
        } catch (error) {
            reject(406, "Invalid Url")
        }
    }))
}

function LoginUser(email, password) {
    let xhr = new XMLHttpRequest();
    return new Promise(
        (resolve, reject) => {
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    let response = JSON.parse(this.responseText);
                    if (this.status === 200) {
                        localStorage.Token = response.token
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }
            });
            xhr.open("POST", GetHost() + "auth/login?email=" + email + "&password=" + password);
            xhr.send();
        }
    )
}


function saveChanges(endpoint, title, url) {
    return (new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText)
                if (this.status === 202) {
                    resolve(response)
                } else {
                    reject(response)
                }
            }
        });
        let token = localStorage.Token
        xhr.open("PUT", GetHost() + "links/updateLink?" + (token ? "token=" + token : '') + "&endpoint=" + endpoint + "&url=" + url + "&title=" + title);
        xhr.send();
    }))
}

async function DeleteLink(endpoint) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                if (this.status === 202) {
                    resolve(response);
                } else {
                    reject(response)
                }
            }
        });
        let token = localStorage.Token
        xhr.open("DELETE", GetHost() + "links/deleteLink?" + (token ? "token=" + token : '') + "&endpoint=" + endpoint);
        xhr.send();
    });
}
function changePassword(oldPass, newPass) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                if (this.status === 202) {
                    resolve(response)
                } else {
                    console.log(response.message)
                    reject(response)
                }
            }
        });
        xhr.open("PUT", GetHost() + "action/changePassword?password=" + oldPass + "&token=" + localStorage.Token + "&newPassword=" + newPass);
        xhr.send();
    })
}

function ForgpotPassword(email, password, otp) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                if (this.status === 202) {
                    resolve(response)
                } else {
                    reject(response)
                }
            }
        });
        xhr.open("PUT", GetHost() + "recovery/resetPassword?email=" + email + "&password=" + password + "&otp=" + otp);
        xhr.send();
    })
}

function SignupUser(data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                if (this.status === 201) {
                    localStorage.Token = response.token;
                    resolve(response)
                } else {
                    reject(response)
                }
            }
        });
        xhr.open("POST", GetHost() + "auth/signup?email=" + data.email + "&password=" + data.password + "&name=" + data.name + "&otp=" + data.otp);
        xhr.send();
    })
}
async function sendOTP(email, type) {
    return (new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText)
                if (this.status === 201) {
                    resolve(response)
                } else {
                    reject(response)
                }
            }
        });
        if (type === 0) {
            xhr.open("POST", GetHost() + "auth/sendOtp?email=" + email);
        } else {
            xhr.open("POST", GetHost() + "recovery/sendOtp?email=" + email);
        }
        xhr.send();
    }))
}
function changeName(newName) {
    return (new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText)
                if (this.status === 202) {
                    resolve(response)
                } else {
                    reject(response)
                }
            }
        });
        xhr.open("PUT", GetHost() + "action/changeName?token=" + localStorage.Token + "&newName=" + newName);
        xhr.send();
    }))
}
function deleteAccount(password) {
    return (new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText)
                if (this.status === 202) {
                    resolve(response)
                } else {
                    reject(response)
                }
            }
        });
        xhr.open("DELETE", GetHost() + "action/deleteAccount?token=" + localStorage.Token + "&password=" + password);
        xhr.send();
    }))
}
function sendFeedback(message) {
    return (new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText)
                if (this.status === 201) {
                    resolve(response)
                } else {
                    reject(response)
                }
            }
        });
        xhr.open("POST", GetHost() + "action/sendFeedback?token=" + localStorage.Token + "&message=" + message);
        xhr.send();
    }))
}

function GoogleSignin(accessToken) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    let response = JSON.parse(this.responseText);
                    localStorage.Token = response.token
                    resolve(response)
                } else {
                    let response = JSON.parse(this.responseText);
                    reject(response)
                }
            }
        });
        xhr.open("POST", GetHost() + "auth/OAuth?accessToken=" + accessToken);
        xhr.send();
    })
}
function RefreshLinks() {
    new Promise((resolve,reject)=>{
        var xhr = new XMLHttpRequest();
        let links = JSON.parse(localStorage.Links);
        let endpoints = (links.length>0?links.map((link)=>link.endpoint):[])
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
               if(this.status === 200){
                const response =  JSON.parse(this.responseText);
                resolve(response)
               }else{
                reject({message:"No links found"})
               }
            }
        });
        xhr.open("POST", GetHost()+"refreshLinks?endpoints="+endpoints);
        xhr.send();
    })
}

export { CreateLink, RefreshData, LoginUser, saveChanges, DeleteLink,RefreshLinks, changePassword, GoogleSignin, ForgpotPassword, SignupUser, sendOTP, changeName, deleteAccount, sendFeedback }