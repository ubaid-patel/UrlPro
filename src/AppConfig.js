function GetHost(){
    return "http://192.168.43.160:5000/"
}
function GetAuth(){
   return( {
        count:0,
        message:null,
        name:null,
        picture:null,
        token:localStorage.Token,
        links:[{endpoint: 'URLPRO', title: 'Example Link', url: 'https://example.com', views: 0}],
        // For admin useOnly
        users:undefined,
        feedbacks:undefined,
        })
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

export const initState=()=>{
return(
{    message:undefined,
    name:undefined,
    picture:undefined,
    token:undefined,
    links:[],
    // For admin useOnly
    users:[],
    feedbacks:[],}
)  
}
export {GetAuth,GetHost,displayOneByOne}