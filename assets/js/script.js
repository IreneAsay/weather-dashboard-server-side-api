$(document).ready(function () {
    // console.log("Hello world!");
    var lat = 0;
    var lon = 0;
    var recent = JSON.parse(localStorage.getItem("recentCity")) || [];

    if(recent.length) {
        $(".recent-search").removeClass("d-none");
        for(var i = 0; i < recent.length; i++){
            $(".recent-search").append(`<li>${recent[i]}</li>`)
        }
    }

    $("#submitSearch").on("click", function(){
        var input = $("#search-input").val();
        if(!input || !isNaN(input)) {
            alert("You must enter city name;")
            return false;
        }
        citySearch(input);
        recent.push(input);
        $(".recent-search").removeClass("d-none");
        $(".recent-search").append(`<li>${input}</li>`)
        localStorage.setItem("recentCity", JSON.stringify(recent));
    })

    $(".recent-search").on("click", "li", function(e){
        e.stopPropagation();
        citySearch($(this).text());
    })

    function citySearch(city) {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=2568d61b5f85f6cd09e9bc523ade30ae`
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            // console.log(response);
            lat = response.coord.lat;
            lon = response.coord.lon;
            $(".city-name").text(response.name + " (" + moment().format('DD/MM/YYYY') + ")")
                            .append(`<img src="http://openweathermap.org/img/w/${response.weather[0].icon}.png" alt="weather">`);
            $("#temperature").text("Temperature: " + response.main.temp + "℉");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#wind-speed").text("Wind Speed: " + response.wind.speed + "MPH");
            getOtherInfo(lat, lon);
        });
    }

    function getOtherInfo(lat, lon) {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=2568d61b5f85f6cd09e9bc523ade30ae`,
            method: "GET",
        }).then(function (response) {
            // console.log(response);
            var uvLevel = response.current.uvi;
            $("#uv-index").text(uvLevel);
            switch (Math.floor(uvLevel)) {
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
            for (var i = 0; i < $(".card").length; i++){
                var temp = (response.daily[i+1].temp.min + response.daily[i+1].temp.max) / 2;
                // console.log(temp)
                $(".card:eq("+i+") .dataTime").text(moment.unix(response.daily[i+1].dt).format('DD/MM/YYYY'));
                $(".card:eq("+i+") .weather").attr("src", `http://openweathermap.org/img/w/${response.daily[i+1].weather[0].icon}.png`);
                $(".card:eq("+i+") .temp").text("Temp: " + temp.toFixed(2) + "℉");
                $(".card:eq("+i+") .humidity").text("Humidity: " + response.daily[i+1].humidity + "%");
            }
        })
    }
    citySearch("Atlanta");
});