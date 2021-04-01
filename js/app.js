//MONTHS AND DAYS

var now, dd, td;
var months = [
  "Stycznia", //January
  "Lutego",
  "Marca",
  "Kwietnia",
  "Maja",
  "Czerwca",
  "Lipca",
  "Sierpnia",
  "Września",
  "Października",
  "Listopada",
  "Grudnia",//December
];
var days = [
  "Niedziela",//Sunday
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",//Saturday
];

document.addEventListener("DOMContentLoaded", init, false);

function init() {
  dd = document.getElementById("date");
  td = document.getElementById("time");
  ad = document.getElementById("day");
  od = document.getElementById("day2");
  odd = document.getElementById("day3");
  oddd = document.getElementById("day4");
  odddd = document.getElementById("day5");
  updateTime();
  setInterval(updateTime, 1000);
}
function updateTime() {
  var clockdata = getClockStrings();
  dd.innerHTML = clockdata.datehtml;
  td.innerHTML = clockdata.timehtml;
  ad.innerHTML = days[now.getDay()];
  od.innerHTML = days[(now.getDay()+1)%days.length];
  odd.innerHTML = days[(now.getDay()+2)%days.length];
  oddd.innerHTML = days[(now.getDay()+3)%days.length];
  odddd.innerHTML = days[(now.getDay()+4)%days.length];
  dd.dateTime = now.toISOString();
  td.dateTime = now.toISOString();
  ad.day = now.toISOString();
}
function getClockStrings() {
  now = new Date();
  var year = now.getFullYear();
  var month = months[now.getMonth()];
  var date = now.getDate();
  var hour = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var clockhour = hour < 10 ? `0${hour}` : hour;
  if (hour === 0) {
    clockhour = "00";
  }
  var clockminutes = minutes < 10 ? `0${minutes}` : minutes;
  var clockseconds = seconds < 10 ? `0${seconds}` : seconds;
  var currenthour = clockhour + ":" + clockminutes + ":" + clockseconds;
  var datehtml = date + " " + month + ", " + year;
  var timehtml = currenthour;
  return { datehtml: datehtml, timehtml: timehtml };
}
// CURRENT APP CONSTS AND VARS
const iconElement = document.querySelector(".current-weather-icon i");
const tempElement = document.querySelector(".current-temp");
const tempFeelElement = document.querySelector(".current-feel");
const descElement = document.querySelector(".current-weather-description");
const locationElement = document.querySelector(".location p");
const humidElement = document.querySelector(".p-humidity p");
const pressureElement = document.querySelector(".p-pressure p");
const sunriseElement = document.querySelector(".p-sunrise p");
const sunsetElement = document.querySelector(".p-sunset p");
const windElement = document.querySelector(".p-wind p");
var roseIcon = document.querySelector("#roseIcon i");

// FORECAST APP CONSTS AND VARS
const icon1 = document.querySelector(".fore-i-1 i");
const temp101 = document.querySelector(".min-temp-1");
const temp102 = document.querySelector(".max-temp-1");
const icon2 = document.querySelector(".fore-i-2 i");
const temp201 = document.querySelector(".min-temp-2");
const temp202 = document.querySelector(".max-temp-2");
const icon3 = document.querySelector(".fore-i-3 i");
const temp301 = document.querySelector(".min-temp-3");
const temp302 = document.querySelector(".max-temp-3");
const icon4 = document.querySelector(".fore-i-4 i");
const temp401 = document.querySelector(".min-temp-4");
const temp402 = document.querySelector(".max-temp-4");
// App data
const weather = {};
const onecall = {};

weather.temperature = {
  unit: "celsius",
};
onecall.temperature = {
  unit: "celsius",
};

// CONSTANTS FOR THE CALL
const key = "KeyHere";
const language = "pl";
const units = "metric";
const exclude = "minutely";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}
// SET USER'S POSITION
function setPosition(position) {

  var latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
  getOne(latitude, longitude);
  fetchInter(latitude, longitude);

}
function resetIconClass(){
  $('.current-weather-icon i').removeClass()
};

function getOne(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=${language}&exclude=${exclude}&appid=${key}&units=${units}`;


  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      //morrow
      onecall.mintemp = Math.round(data.daily[1].temp.min);
      onecall.maxtemp = Math.round(data.daily[1].temp.max);
      onecall.icon1 = data.daily[1].weather[0].id;
      //aftermorrow
      onecall.mintemp2 = Math.round(data.daily[2].temp.min);
      onecall.maxtemp2 = Math.round(data.daily[2].temp.max);
      onecall.icon2 = data.daily[2].weather[0].id;
      //aaftermorrow
      onecall.mintemp3 = Math.round(data.daily[3].temp.min);
      onecall.maxtemp3 = Math.round(data.daily[3].temp.max);
      onecall.icon3 = data.daily[3].weather[0].id;
      //aaaftermorrow
      onecall.mintemp4 = Math.round(data.daily[4].temp.min);
      onecall.maxtemp4 = Math.round(data.daily[4].temp.max);
      onecall.icon4 = data.daily[4].weather[0].id;

      //create a graph
      var dataArr = new Array();
      var popArr = new Array();
      var timeint = data.hourly[0].dt * 1000;
      var offset = (new Date().getTimezoneOffset());
      // limit 48hrs to 24 with "< 24 && i"
      for (var i = 0; i < 24 && i < data.hourly.length; i++)
        dataArr.push(data.hourly[i].temp);

      for (var i = 0; i < 24 && i < data.hourly.length; i++)
        popArr.push(data.hourly[i].pop);

      let series = [],
        seriesNames = ["rain", "temp"];
      let dataForSeries = [popArr, dataArr];

      series.push({
        name: seriesNames[i],
        data: dataForSeries,
      });

      $("#containergraph").highcharts({
        chart: {
          backgroundColor: "#000",
          fontSize: "30px",
          plotBorderWidth: 0,
        },
        accessibility: {
          announceNewData: {
              enabled: true,
              minAnnounceInterval: 15000,
              announcementFormatter: function (popArr, dataArr, newPoint) {
                  if (newPoint) {
                      return 'New point added. Value: ' + newPoint.y;
                  }
                  return false;
              }
          }
      },
      data: {
          enablePolling: true,
          dataRefreshRate: parseInt(10)
      },

        global: {
          useUTC: false,
        },
        time: {
          timezoneOffset: offset,
        },
        credits: {
          enabled: false,
        },
        title: {
          text: "",
        },
        subtitle: {
          text: "",
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          lineWidth: 0,
          tickWidth: 0,
          type: "datetime",
          labels: {
            overflow: "justify",
            style: {
              fontSize: "1vw",
              color: "white",
            },
          },
        },
        yAxis: [
          {
            // Primary yAxis
            labels: {
              format: "{value}°C",
              style: {
                fontSize: "2vh",
                color: "white",
              },
            },
            title: {
              text: "",
              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
          },
          {
            // Secondary yAxis
            title: {
              text: "",
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
          },
        ],
        series: [
          {
            name: "temp",
            type: "areaspline",
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, Highcharts.Color("#1a1919").get()],
                [1, Highcharts.Color("#fff").get()],
              ],
            },
            marker: {
              enabled: false,
            },
            lineColor: "#fff ",
            lineWidth: ".15vh",
            data: dataArr,
            pointStart: timeint,
            pointInterval: 60 * 60 * 1000,
          }
          ,
          {
            name: "rain",
            type: "column",
            yAxis:0, //enlarge the rainfall column
            color: "#000",
            data: popArr,
            pointStart: timeint,
            pointInterval: 60 * 60 * 1000,
          },
        ],
      });
    })
    .then(function () {
      displayOne();
    });
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${language}&appid=${key}&units=${units}`;

  fetch(api)
  
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.round(data.main.temp);
      weather.temperature.feel = Math.round(data.main.feels_like);
      weather.description = data.weather[0].description;
      weather.iconId = function geticonClass() {
        let prefix = data.weather[0].icon.endsWith("d")
          ? "wi-owm-day-"
          : "wi-owm-night-";
        return `${prefix}${data.weather[0].id}`;
      };
      weather.city = data.name;
      weather.humidity = data.main.humidity;
      weather.pressure = data.main.pressure;
      weather.sunrise = new Date(data.sys.sunrise * 1000);
      weather.sunset = new Date(data.sys.sunset * 1000);
      weather.wind = data.wind.speed;
      windDirection = data.wind.deg ? data.wind.deg.toFixed(0) : "N/A ";
      weather.rose = function(){
        $(".wi-wind").addClass("from-" + windDirection + "-deg")
        setTimeout(function (){
          $("#roseIcon").removeClass();
          setTimeout(function () { 
          $("#roseIcon").addClass(`wi` +` `+ `wi-wind` +` `+ `from-` + windDirection + `-deg`)}, 1000)
        },920000)
      };
    })

    .then(function () {
      displayWeather();
    });
}

// DISPLAY WEATHER TO UI
function displayWeather() {
  iconElement.classList.add(weather.iconId());
  tempElement.innerHTML = `${weather.temperature.value}<sup><small>°C</small></sup>`;
  tempFeelElement.innerHTML = `Odczuwalna: ${weather.temperature.feel}<sup><small>°C</small></sup>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}`;
  humidElement.innerHTML = ` ${weather.humidity}%`;
  pressureElement.innerHTML = ` ${weather.pressure} hPa`;
  sunriseElement.innerHTML = ` ${weather.sunrise.toLocaleTimeString("pl-PL")}`;
  sunsetElement.innerHTML = ` ${weather.sunset.toLocaleTimeString("pl-PL")}`;
  windElement.innerHTML = ` ${weather.wind} m/s`;
  roseIcon.innerHTML = `${weather.rose()}`;
}

// DISPLAY fore TO UI
function displayOne() {
  temp101.innerHTML = `${onecall.mintemp}<sup>° </sup>`;
  temp102.innerHTML = `${onecall.maxtemp}<sup>° </sup>`;
  icon1.classList.add("wi-owm-" + onecall.icon1);

  temp201.innerHTML = `${onecall.mintemp2}<sup>° </sup>`;
  temp202.innerHTML = `${onecall.maxtemp2}<sup>° </sup>`;
  icon2.classList.add("wi-owm-" + onecall.icon2);

  temp301.innerHTML = `${onecall.mintemp3}<sup>° </sup>`;
  temp302.innerHTML = `${onecall.maxtemp3}<sup>° </sup>`;
  icon3.classList.add("wi-owm-" + onecall.icon3);

  temp401.innerHTML = `${onecall.mintemp4}<sup>° </sup>`;
  temp402.innerHTML = `${onecall.maxtemp4}<sup>° </sup>`;
  icon4.classList.add("wi-owm-" + onecall.icon4);
}

function fetchInter(latitude, longitude) {

  setInterval(function(){
    resetIcon = resetIconClass();
    fetchCurrent =  getWeather(latitude, longitude)
  },900000);
  fetchFore = setInterval(() => getOne(latitude, longitude), 1800000);
} // 900000 899000



var elem = document.getElementById("body");
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}


