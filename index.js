const API_KEY = "AW2L7NU7VEKSSLEYQDJFBEMQ3";
// loading screen
const loadingScreen = document.querySelector("[data-loadingScreen]");

// DAY AND DATE AND MONTH
const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const date = new Date();   
const day = weekDays[date.getDay()];
const month = months[date.getMonth()];
const currentDate = `${day} ${date.getDate()} ${month}`;

// SEARCH CITY
const searchBtn = document.querySelector("[data-searchButton]");
const searchInput = document.querySelector("[data-searchCity]");

// LEFT SECTION
const cityInfo = document.querySelector("[data-cityInfo]");
const cityTempInfo = document.querySelector("[data-cityTempDiv]");
const cityStats = document.querySelector("[data-cityStats]");
const cityForecast = document.querySelector("[data-cityNext5Days]");
// array
const leftSectionEle = [cityInfo, cityTempInfo, cityStats, cityForecast];

// cityInfo
const cityName = document.querySelector("[data-cityName]");
const cityDayDate = document.querySelector("[data-cityDayDate]");

// cityTempInfo
const cityWeatherIcon = document.querySelector("[data-cityCurrentWeatherIcon]");
const cityCurrentTemp = document.querySelector("[data-cityCurrentTemp]");
const cityCurrentDesc = document.querySelector("[data-cityCurrentDesc]");

// cityStats
const cityMaxTemp = document.querySelector("[data-cityHighTemp]");
const cityMinTemp = document.querySelector("[data-cityLowTemp]");
const cityWindspeed = document.querySelector("[data-cityWindSpeed]");
const cityRain = document.querySelector("[data-cityRain]");
const citySunrise =document.querySelector("[data-citySunrise]");
const citySunset = document.querySelector("[data-citySunset]");

// cityForecast 
const cityForecast1 = document.querySelector("[data-forecast1]");
const cityForecast2 = document.querySelector("[data-forecast2]");
const cityForecast3 = document.querySelector("[data-forecast3]");
const cityForecast4 = document.querySelector("[data-forecast4]");
const cityForecast5 = document.querySelector("[data-forecast5]");



searchBtn.addEventListener("click", getCityData);

async function getCityData(){
    let city_name = searchInput.value;
    // console.log(city_name)
    try{
        const API_URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city_name}?key=${API_KEY}`;

        // show loading screen
        loadingScreen.classList.remove("hidden")

        let response = await fetch(API_URL);
        let data = await response.json();

        displayLeftSection(data);
        // console.log(data)
    }
    catch(err){
        console.log(err);
        alert("Enter valid city name");
        loadingScreen.classList.add("hidden");
    }    
}

function displayLeftSection(data){
    leftSectionEle.forEach((Section)=>{
        if(Section.classList.contains("hidden")){
            Section.classList.remove("hidden");
        }
    })
    renderLeftSectionData(data)
}

function renderLeftSectionData(data){
    // remove loading screen
    loadingScreen.classList.add("hidden");

    // RENDER CITY INFO
    cityName.innerText = data?.resolvedAddress;
    cityDayDate.innerText = currentDate;

    // RENDER TEMP INFO
    // CONVERT TEMP TO CELSIUS
    let temprature = data?.days?.[0]?.temp;
    let tempToCelsius = Math.floor(((temprature -32)*5/9)*10)/10;

    cityWeatherIcon.src = `images/icons/${data?.days?.[0]?.icon}.png`;
    cityCurrentTemp.innerHTML = tempToCelsius+"&deg;";
    cityCurrentDesc.innerText = data?.days?.[0]?.conditions;

    // RENDER CITY STATS
    // convert MAX/MIN temp to celsius
    let maxtemp = data?.days?.[0]?.tempmax;
    let mintemp = data?.days?.[0]?.tempmin;
    let maxtempCelsius = Math.floor(((maxtemp - 32)*5/9)*10)/10;
    let mintempCelsius = Math.floor(((mintemp - 32)*5/9)*10)/10;

    // max and min temp
    cityMaxTemp.innerHTML = maxtempCelsius+"&deg;";
    cityMinTemp.innerHTML = mintempCelsius+"&deg;";

    // wind and rain
    cityWindspeed.innerText = data?.days?.[0]?.windspeed+" kmph";
    cityRain.innerText = data?.days?.[0]?.precipprob+"%";

    // sunrise and sunset
    citySunrise.innerText = (data?.days?.[0]?.sunrise).substring(0,5);
    citySunset.innerText = (data?.days?.[0]?.sunset).substring(0,5);
    
    // render forecast
    // get next 5 days
    const currentIndex = weekDays.indexOf(day);

    const nextDayArr = [];
    const maxmintemparr = [];
    const iconarr = [];
    for (let i =1; i<=5; i++){
        const nextIndex = (currentIndex + i)% weekDays.length;
        // console.log("next index: ", nextIndex)
        const nextDay = weekDays[nextIndex];
        nextDayArr.push(nextDay.substring(0,3));
        
        // temp
        let maxtempForecast = data?.days?.[i]?.tempmax;
        let mintempForecast = data?.days?.[i]?.tempmin;
        let maxtempForecastCel = Math.floor(((maxtempForecast - 32)*5/9)*10)/10;
        let mintempForecastCel = Math.floor(((mintempForecast - 32)*5/9)*10)/10;
        maxmintemparr.push(`${mintempForecastCel} - ${maxtempForecastCel}`);

        // icon
        iconarr.push(data?.days?.[i]?.icon);
    }
    // console.log(nextDayArr);
    // console.log(maxmintemparr);
    // console.log(iconarr);

    cityForecast1.firstElementChild.innerText = nextDayArr[0];
    cityForecast2.firstElementChild.innerText = nextDayArr[1];
    cityForecast3.firstElementChild.innerText = nextDayArr[2];
    cityForecast4.firstElementChild.innerText = nextDayArr[3];
    cityForecast5.firstElementChild.innerText = nextDayArr[4];

    cityForecast1.lastElementChild.innerText = maxmintemparr[0];
    cityForecast2.lastElementChild.innerText = maxmintemparr[1];
    cityForecast3.lastElementChild.innerText = maxmintemparr[2];
    cityForecast4.lastElementChild.innerText = maxmintemparr[3];
    cityForecast5.lastElementChild.innerText = maxmintemparr[4];

    cityForecast1.querySelector('img').src = `images/icons/${iconarr[0]}.png`;
    cityForecast2.querySelector('img').src = `images/icons/${iconarr[1]}.png`;
    cityForecast3.querySelector('img').src = `images/icons/${iconarr[2]}.png`; 
    cityForecast4.querySelector('img').src = `images/icons/${iconarr[3]}.png`;
    cityForecast5.querySelector('img').src = `images/icons/${iconarr[4]}.png`;
}   