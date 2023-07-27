function displayOneByOne(str, ref, time, type = "success") {
  let i = 0;

  if (type === "success") {
    ref.current.style = "display:block;margin:0px;color:green";
  } else {
    ref.current.style = "display:block;margin:0px;color:red";
  }

  ref.current.innerHTML = "";

  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      if (i >= str.length) {
        clearInterval(intervalId);
        resolve();
      } else {
        ref.current.innerHTML += str.charAt(i);
        i++;
      }
    }, time);
  });
}

export const initState = () => {
  return (
    {
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
  )
}

//Converting Date to IST
const convertDateToIST = (utcdateString) => {
  const timestamp = new Date(utcdateString).getTime();

  // Calculate the offset for IST (GMT+5:30)
  const offset = 5.5 * (60 * 60);

  // Create a new Date object for the IST date and time
  const istDate = new Date(timestamp + offset);

  // Format the IST date and time
  const istDateString = istDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return (istDateString); // 7/13/2023, 6:32:28 PM
}

export {displayOneByOne, convertDateToIST}