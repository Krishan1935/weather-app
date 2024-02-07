const APIKEY = "AW2L7NU7VEKSSLEYQDJFBEMQ3";

// grant access screen
const grantAccessScreen = document.querySelector("[data-grantAccessScreen]");
// location access button
const locationAccessButton = document.querySelector("[data-locationAccessButton]");
// loading screen
const LoadingScreen = document.querySelector("[data-loadingScreen]");

// DAY AND DATE AND MONTH
const WeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const Months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const newdate = new Date();   
// console.log(newdate)
const Day = WeekDays[newdate.getDay()];
const DayIndex = newdate.getDay();
const Month = Months[newdate.getMonth()];
const CurrentDate = `${Day} ${newdate.getDate()} ${Month}`;

function getNextDay(daystoadd){
    const result = new Date();
    result.setDate(result.getDate()+daystoadd);
    return result;
}


// RIGHT SECTION
const RIGHT_SECTION = document.querySelector("[data-rightSection]");
const rightSectionChildren = Array.from(RIGHT_SECTION.children);



// check if user's coords are in localstorage

if(localStorage.getItem("coordinates")!=null){
    grantAccessScreen.classList.add("hidden");
    rightSectionChildren.forEach((child)=>{
        child.classList.remove("invisible");
    })
    getUserLocationData();
} else {
    locationAccessButton.addEventListener("click",getUserLocation);
}


function getUserLocation() {
    if(!navigator.geolocation){
        alert("Geolocation is not supported in your browser");
    } else {
        navigator.geolocation.getCurrentPosition(storeUserLocation);
        LoadingScreen.classList.remove("hidden");
    }
}

function storeUserLocation(position){
    const coordinates = {
        latitude : position.coords.latitude,
        longitude : position.coords.longitude
    }
    window.localStorage.setItem("coordinates",JSON.stringify(coordinates))
    rightSectionChildren.forEach(child => {
        child.classList.remove("invisible");
    });
    getUserLocationData()
}

async function getUserLocationData(){

    const userCoords = JSON.parse(window.localStorage.getItem("coordinates"));
    const lat = userCoords.latitude;
    const lon = userCoords.longitude;

    const API_URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${APIKEY}`;

    const response = await fetch(API_URL);
    const data = await response.json();

    const API_URL2 = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=b19b80fbd1b5e56c10b70e413c7e278a`;
    const response2 = await fetch(API_URL2);
    const data2 = await response2.json()

    renderData(data,data2)
}

// fetching elements



function renderData(data,data2){
    console.log(data)
    console.log(data2)
    LoadingScreen.classList.add("hidden")
    grantAccessScreen.classList.add("hidden")   

    // SET CITY NAME, DAY AND DATE
    RIGHT_SECTION.children[0].firstElementChild.innerText = `${data2?.[0]?.name}, ${data2?.[0]?.state}`;
        // set date
        RIGHT_SECTION.children[0].children[1].innerText = CurrentDate;

    // CHANGE TEMP AND DESC
    RIGHT_SECTION.children[1].firstElementChild.src = `images/icons/${data?.days?.[0]?.icon}.png`;
        // change temp
        let temp = data?.days?.[0]?.temp;
        let temptocel = Math.floor(((temp - 32)*5/9)*10)/10;
        RIGHT_SECTION.children[1].lastElementChild.firstElementChild.innerHTML = temptocel+"&deg;";
        // change description
        RIGHT_SECTION.children[1].lastElementChild.lastElementChild.innerHTML = data?.days?.[0]?.description;
    
    // CHANGE CURRENT STATS
        // max and min temp
        let maxtemp = data?.days?.[0]?.tempmax;
        let maxtempC = Math.floor(((maxtemp - 32)*5/9)*10)/10;
        let mintemp = data?.days?.[0]?.tempmin;
        let mintempC = Math.floor(((mintemp - 32)*5/9)*10)/10;

        RIGHT_SECTION.children[2].firstElementChild.firstElementChild.firstElementChild.innerHTML = maxtempC+"&deg;";
        RIGHT_SECTION.children[2].firstElementChild.lastElementChild.firstElementChild.innerHTML = mintempC+"&deg";
    
        // wind and rain
        RIGHT_SECTION.children[2].children[1].firstElementChild.firstElementChild.innerText = data?.days?.[0]?.windspeed + " kmph";
        RIGHT_SECTION.children[2].children[1].lastElementChild.firstElementChild.innerText = data?.days?.[0]?.precipprob+"%";

        // sunrise and sunset
        sunrise = (data?.days?.[0]?.sunrise).substring(0,5);
        sunset = (data?.days?.[0]?.sunset).substring(0,5);
        
        RIGHT_SECTION.children[2].children[2].firstElementChild.firstElementChild.innerText = sunrise;
        RIGHT_SECTION.children[2].children[2].lastElementChild.firstElementChild.innerText = sunset;
     
    // TODAY'S WEATHER
    const timePeriodcontainer= Array.from(RIGHT_SECTION.children[3].children);
    const timePeriod = timePeriodcontainer.filter(element => element.tagName.toLowerCase() == 'div');
    
    for (let i = 0; i<timePeriod.length;i++){
        // changing weather icon
        timePeriod[i].children[1].src = `images/icons/${data?.days?.[0]?.hours?.[((i+1)*3)]?.icon}.png`

        // changing temp
        let timetemp = data?.days?.[0]?.hours?.[(i+1)*3].temp;
        let timetempc = Math.floor(((timetemp -32)*5/9)*10)/10;
        timePeriod[i].children[2].innerHTML = timetempc+"&deg;";
    }

    // NEXT 5 DAYS
    const daysContainer = Array.from(RIGHT_SECTION.children[4].children);
    const daysDiv = daysContainer.filter(div => div.tagName.toLocaleLowerCase() == 'div');

    for (let i=0; i<daysDiv.length;i++){
        // console.log(daysDiv[i].children[0].firstElementChild)

        const nextDate = getNextDay(i+1)
        const nextDay = (WeekDays[nextDate.getDay()]);
        // change day and date
        daysDiv[i].children[0].firstElementChild.innerText = nextDay.slice(0,3);
        daysDiv[i].children[0].lastElementChild.innerText = `${nextDate.getDate()}/${nextDate.getMonth() + 1}`;


        // change weather icon
        daysDiv[i].children[1].src = `images/icons/${data?.days?.[i+1]?.icon}.png`;

        // change low temp
        daysDiv[i].children[2].firstElementChild.innerHTML = Math.floor(((data?.days?.[i+1]?.tempmin - 32)*5/9)*10)/10 + "&deg;";
        // change high temp
        daysDiv[i].children[3].firstElementChild.innerHTML = Math.floor(((data?.days?.[i+1]?.tempmax - 32)*5/9)*10)/10 + "&deg;";
        // change wind
        daysDiv[i].children[4].firstElementChild.innerText = data?.days?.[i+1]?.windspeed + " kmph";
        // change rain
        daysDiv[i].children[5].firstElementChild.innerText = data?.days?.[i+1]?.precipprob+"%";
    }
}


