function GetHost(){
    return "http://192.168.43.160:5000/"
}
function GetAuth(){
    let Auth = {status:0,token:null,links:[]}
    try {
        return JSON.parse(localStorage.Auth)
      } catch (e) {
        // Handle the error here
        return Auth
      }
   }
   function displayOneByOne(str, id, time, type = "success") {
    let i = 0;
    const el = document.getElementById(id);
    
    if (type === "success") {
      el.style = "display:block;margin:0px;color:green";
    } else {
      el.style = "display:block;margin:0px;color:red";
    }
    
    el.innerHTML = "";
    
    return new Promise(resolve => {
      const intervalId = setInterval(() => {
        if (i >= str.length) {
          clearInterval(intervalId);
          resolve();
        } else {
          el.innerHTML += str.charAt(i);
          i++;
        }
      }, time);
    });
  }
export {GetAuth,GetHost,displayOneByOne}