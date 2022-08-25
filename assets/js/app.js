var apiKey= CP8U8ZRDKMNSMC59LZFLZWMCR
var city = "Greensboro";
var favLocations = [];

var currentWeather = [];
var forcast = [];
var dateFormat = "mm/dd/yy";

var getForeCast = function (location) {
    city = location;
    var apiUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?locations=" +city+"aggregateHours=24&forcastDays=6&contentType=json&iconSet=icons2&shortColumnNames=true&key=" + apiKey;
    //console.log(apiUrl)
    fetch(apiUrl).then(function (data) {
        if (Response.ok) {
            Response.json().then(function (data) {
                if (data.errorCode === 999) {
                    triggerModal("Not a valid location, try again");
                    return false
                }
                currentWeather = data.locations;
                console.log(currentWeather);
                city = currentWeather[Object.keys(currentWeather)[0]].address;
                forcast = currentWeather[Object.keys(currentWeather)[0]].valuews;
                currentWeather = currentWeather[Object.keys(currentWeather)[0]].currentConditions;

                setCurrentConditions();
                setForecast();
                convertCityToId();
                addRecentSearch();
                isFavorite();
            })
        }else{
            triggerModal("sorry, the weather service is currently unavailable");
        }
    })
}

var setCurrentConditions = function() {
    var uvi = parseInt(forecast[0].uvindex);
    var uvEl = $("#today-uv").text(uvi);
}