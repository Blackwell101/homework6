var apiKey= "CP8U8ZRDKMNSMC59LZFLZWMCR"
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

var setCurrentConditions = function () {
    var uvi = parseInt(forecast[0].uvindex);
    var uvEl = $("#today-uv").text(uvi);
    
    $("#searched-city").text(city);
    $("#fav").addClass("oi oi-bookmark");
    $("#today").text("(" + dayjs().format(dateFormat) + ")");
    $("#today-castmoji")
        .attr("src", getIcon(forecast[0].conditions))
        .attr("alt",forecast[0].conditions);
    $("#today-temp").text(currentWeather.temp+" \xB0F");
    $("#today-wind").text(currentWeather.wspd+" MPH");
    $("#today-humidity").text(currentWeather.humidity+"%");

    //translate values of uv index
    if (uvi <= 2) {
        uvEl.addClass("bg-success px-2 shadow-sm rounded");
    }
    else if (uvi <= 6) {
        uvEl.addClass("bg-warning px-2 shadow-sm rounded");
    }
    else {
        uvEl.addClass("bg-danger px-2 shadow-sm rounded");
    }
}

var setForecast = function () {
    var container = $("#forecast-row")    

    //must be seperated to prevent the info from staying removed    
    container 
        .children()
        .remove();
    
    for (var i = 1; i < forecast.length; i++) {
        //console.log(forecast[i].temp);
        var dayEl = $("<div>")
            .addClass("rounded mt-2 col-5 col-md-5 col-xl-2 bg-dark text-light pt-1")
            .attr("id",i+"-day");

        var date = $("<p>")          
            .text(dayjs().add(i, 'days').format(dateFormat))
            .addClass("h5");
        dayEl.append(date);
        
        var icon = $("<img>")
            .text(forecast[i].conditions)
            .attr("src", getIcon(forecast[i].conditions))
            .attr("alt",forecast[i].conditions);
        dayEl.append(icon);

        var temp = $("<p>")
            .text("Temp: "+ forecast[i].temp+" \xB0F"); //need to add degrees
        dayEl.append(temp);

        var wind = $("<p>")
            .text("Wind: "+forecast[i].wspd+" MPH");
        dayEl.append(wind);

        var humidity = $("<p>")
            .text("Humidity: "+ forecast[i].humidity+ "%");
        dayEl.append(humidity);
        
        container.append(dayEl);
    }
}

var getIcon = function (condition) {
    switch (condition.toLowerCase()) {
        case "rain":
        case "rain, partially cloudy":
        case "rain, overcast":
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/rain.png";
        case "partially cloudy":
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/partly-cloudy-day.png";
        case "overcast":
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/cloudy.png";
        default:
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/clear-day.png";
    
    }
}

var triggerModal = function (message) {
    $("#dialog-modal").modal('show');
    $(".modal-body").text(message);
}

$("#dialog-modal").on("click", function (event) {
    if ($(event.target).attr("class").includes('btn')) {
        $("#dialog-modal").modal("hide");
    }   
})

var addRecentSearch = function () {

    var cityLower = city.toLowerCase().replace(" ","_");

    var children = [$("#recent").children()][0];

    if (cityLower === $("#" + cityLower).attr("id")) { //against hard coded quick search
        return console.log("This element already exists");
    }
  
    for (var i = 0; i < children.length; i++){
        console.log("new element " + $(children[i]).attr("id"));
        console.log($("#" + city).attr("id"));
        console.log(city);
        
        if($(children[i]).attr("id") === cityLower){
            return console.log("This element already exists");
        }
    }


    var recent = $("<div>")
        .addClass("d-block btn custom-btn text-center bg-light mt-2")
        .attr("id", cityLower)
        .text(city.replace("-",","));
    
    $("#recent").append(recent);
};

var navEl = $("nav").on("click", function (event) {

    var targetEl = $(event.target);
    console.log(targetEl);

    if (targetEl.attr("id") === "search") {
        var location = $("#city").val();
        if (location) {
            getForeCast(location);
        }
        else {
            triggerModal("You must make a valid selection"); //replace with a modal message
        }
        $("#city").val("");
        
    } else if (targetEl.attr("class").includes("custom-btn")) {
        console.log(targetEl.attr("id"));
        getForeCast(targetEl.attr("id").replace("-",","));
    }

});

$("#fav").on("click", function (element) {

    //checks to if the current elementa already has a class of text-warnin when the fav icon is clicked
    if ($(this).attr("class").includes("text-warning")) {
        console.log("removing favorite");
        $(this).removeClass("text-warning");

        $("#favorites").children("#" + city.toLowerCase()).remove();
        favLocations.forEach(function (element) {
            if (element.id === city.toLowerCase()) {
                favLocations.splice(favLocations.indexOf(element), 1);
            }
        })
        console.log(favLocations);
        //return and update local storage
        return updateStorage();
    }

    $(this).addClass("text-warning");

    var fav = $("<div>")
        .addClass("d-block btn custom-btn text-center bg-warning mt-2")
        .attr("id", city.toLowerCase())
        .text(city.replace("-", ","));
    
    $("#favorites").append(fav);
    
    favLocations.push({
        id: city.toLowerCase(),
        display: city.replace("-", ",")
    });
    console.log(favLocations);
    updateStorage();

    console.log(city)
})

var convertCityToId = function () {
    var temp = city.split(",");
    city = temp[0].trim() + "-" + temp[1].trim();


getForeCast();