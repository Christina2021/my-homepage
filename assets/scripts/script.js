//Any variables
let myName = "";
let myWeather;
let myKey;
let cityName;

//Edit button to update prompts
//modal?




let currentHour = moment().startOf('hour');

//Moment.js for time (setInterval used to be in real-time)
function currentTime() {
    $('#current-time').html(moment().format("[~ ]dddd LL h[:]mm[:]ss A[ ~]"));

    //Update past/present/future colors if start of new hour
    if(moment().startOf('second').isSame(moment().startOf('hour'))){
        //Update currentHour if changed;
        currentHour = moment().startOf('hour');
        updateGreeting(currentHour);
    };
};
setInterval(currentTime, 1000);
//Moment.js for greeting to change based on the time
function updatePastPresentFuture(hour) {
    let lateEnd = moment().set('hour', 3).startOf('hour');
    let earlyEnd = moment().set('hour', 6).startOf('hour');
    let morningEnd = moment().set('hour', 12).startOf('hour');
    let afternoonEnd = moment().set('hour', 17).startOf('hour');
    let eveningEnd = moment().set('hour', 24).startOf('hour');
    
    if (hour.isBefore(lateEnd)){
        $('#specific-greeting').html(`It's late, `)
    } else if (hour.isBefore(earlyEnd)){
        $('#specific-greeting').html(`It's early, `)
    } else if (hour.isBefore(morningEnd)){
        $('#specific-greeting').html(`Good Morning, `)
    } else if (hour.isBefore(afternoonEnd)){
        $('#specific-greeting').html(`Good Afternoon, `)
    } else if (hour.isBefore(eveningEnd)){
        $('#specific-greeting').html(`Good Evening, `)
    } ;

    //Add for weekly dates
};
updatePastPresentFuture(currentHour);

//Weather - api stuff
//<p id="weather-today">The weather today will be</p>

/*
let myKey = prompt("Please enter in your API key for O");
let cityAPIName = prompt("What city do you live in?");
*/

function getWeather(cityAPIName, myKey) {
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityAPIName + "&units=imperial&appid=" + myKey;

    //First API call for lat/lon of city to use for second API call
    $.ajax({
        url: currentURL,
        method: "GET",
        //If city is not valid, will give an error message
        error: function() {
            alert("There was an issue with either your OpenWeather API key or City Name.  Please use the edit button to update the information.");
            return;
        }
    })
    .then(function(response){
        let city = response.name;
        let currentTemp = response.main.temp;
        let currentHigh = response.main.temp_max;
        let currentLow = response.main.temp_min;        
        let currentWeatherCondition = response.weather[0].description;
        
        $('#weather-today').html(`The current weather in ${city} is ${currentTemp}&#8457; (${currentWeatherCondition}), with a high of ${currentHigh}&#8457; and low of ${currentLow}&#8457;!`);
    });
}







//To-do list
//add to-do
//edit to-do
//checkmark to-do (and disable)
//Remove to-do

//Weekly
//modal? for event information
//Add event
//Edit event
//Remove event
//if event passed, different color


//Prompts for name, API key for openweathermap (change to modal later possibly)
function FirstTimeUse() {
    let storeSavedInformation = [];
    let savedInformation;

    alert("Welcome! Please enter in some information so that your homepage may display the necessary information:");
    myName = prompt("Please enter in your name:");
    myWeather = confirm("Would you like to add weather data to your homepage (please note that you will need an API key for OpenWeather to utilize this feature - you may sign up for a key at: https://openweathermap.org/)");
    if (myWeather) {
        myKey = prompt("Please enter in your OpenWeather API key (this will be saved to your local storage):");
        cityName = prompt("Please enter in the name of the city that you would like the weather data for:");

        let cityNameRevised = cityName.trim().toLowerCase().split(' ').join('+');
        getWeather(cityNameRevised, myKey);
    } else {
        myKey = false;
        cityName = false;
    }

    //Local Storage
    savedInformation = {name: myName, weather: myWeather, apiKey: myKey, city: cityName};
    storeSavedInformation = JSON.parse(localStorage.getItem("homepageSavedInformation"));

    //Saves object
    storeSavedInformation = [];
    storeSavedInformation[0] = savedInformation;

    //Saves to Local Storage
    localStorage.setItem("homepageSavedInformation",JSON.stringify(storeSavedInformation));
    

    //Set name field in html
    $('#name').html(myName);

};

function displaySavedInformation() {
    let storeSavedInformation = JSON.parse(localStorage.getItem("homepageSavedInformation"));

    if(!storeSavedInformation || !storeSavedInformation[0].name) {
        FirstTimeUse();
        $("#container").removeClass("hidden");

    } else {

        myName = storeSavedInformation[0].name;
        myWeather = storeSavedInformation[0].weather;
        myKey = storeSavedInformation[0].apiKey;
        cityName = storeSavedInformation[0].city;
    
        if (myWeather) {
            let cityNameRevised = cityName.trim().toLowerCase().split(' ').join('+');
            getWeather(cityNameRevised, myKey);
        }
    
        //Set name field in html
        $('#name').html(myName);


        $("#container").removeClass("hidden");
    }
};

displaySavedInformation();




//Local storage pulls to-do's and weekly