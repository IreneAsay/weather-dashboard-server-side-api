$(document).ready(function(){
    console.log("Hello world!");
    var displayTemperature = $("#temperature");
    var displayHumidity = $("#humidity");
    var displayWind = $("#wind-speed");
    var displayUV = $("#uv-index")


function citySearch(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2568d61b5f85f6cd09e9bc523ade30ae`
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        // console.log(response.main.humidity);
        // console.log(response.main.temp);
        // console.log(response.wind.speed);
        $(".city-name").text(response.name + " (" + moment().format('DD/MM/YYYY') + ")").append(`<img src="http://openweathermap.org/img/w/${response.weather[0].ico}.png" alt="">`);   
        $("#temperature").text("Temperature: " + response.main.temp + "℉")
        $("#humidity").text("Humidity: " + response.main.humidity + "%")
        $("#wind-speed").text("Wind Speed: " + response.wind.speed + "MPH")
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=2568d61b5f85f6cd09e9bc523ade30ae`
        $.ajax({
            url: uvURL,
            method: "GET",
        }).then(function (uvResponse) {
            // console.log(uvResponse.value);
            $("#uv-index").text(uvResponse.value);
            var uvLevel = Math.floor(uvResponse.value);
            switch(uvLevel){
                case 1:
                case 2:
                    $("#uv-index").addClass("uv-low");
                    break;
                case 3:
                case 4:
                case 5:
                    $("#uv-index").addClass("uv-moderate");
                    break;
                case 6:
                case 7:
                    $("#uv-index").addClass("uv-high");
                    break;
                case 8:
                case 9:
                case 10:
                    $("#uv-index").addClass("uv-veryhigh");
                    break;
                default:
                    $("#uv-index").addClass("uv-extreme");
            }
        })
    });

}
citySearch("Atlanta");
});
