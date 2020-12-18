//Any variables


//Edit button to update prompts
let currentHour = moment().startOf('hour');

//Moment.js for time (setInterval used to be in real-time)
function currentTime() {
    $('#current-time').html(moment().format("[~]dddd LL h[:]mm[:]ss A[~]"));

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
};
updatePastPresentFuture(currentHour);

//Weather - api stuff
//<p id="weather-today">The weather today will be</p>

/*
let myKey = prompt("Please enter in your API key for O");
let cityAPIName = prompt("What city do you live in?");

let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityAPIName + "&units=imperial&appid=" + myKey;
*/

function getWeather() {
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=san+diego&units=imperial&appid=";

    //First API call for lat/lon of city to use for second API call
    $.ajax({
        url: currentURL,
        method: "GET",
        //If city is not valid, will give an error message
        error: function() {
            alert("City name entered is not valid.  Please enter in a valid city name.");
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
getWeather();





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


//Prompts for name, API key for openweathermap
//Local storage for storing name, api key

//Local storage pulls name, api key, to-do's, and weekly