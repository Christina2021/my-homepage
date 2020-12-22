//Variables for User Info
let myName = "";
let myWeather;
let myKey;
let cityName;

//Variables for current time
let currentHour = moment().startOf('hour');

//Variables for weekly notes
let sundayText = $('#sunday-text');
let mondayText = $('#monday-text');
let tuesdayText = $('#tuesday-text');
let wednesdayText = $('#wednesday-text');
let thursdayText = $('#thursday-text');
let fridayText = $('#friday-text');
let saturdayText = $('#saturday-text');
let weeklyNotes = [sundayText, mondayText, tuesdayText, wednesdayText, thursdayText, fridayText, saturdayText];


//Functions

//Get current time; setInterval will be used to constantly update current time
function currentTime() {
    $('#current-time').html(moment().format("[~ ]dddd LL h[:]mm[:]ss A[ ~]"));

    //Update past/present/future colors if start of new hour
    if(moment().startOf('second').isSame(moment().startOf('hour'))){
        //Update currentHour if changed;
        currentHour = moment().startOf('hour');
        updateGreeting(currentHour);
    };
};

//Greeting will be changed based on the current hour
function updateGreeting(hour) {
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
    addDatesToWeekly();    
}

//Dates will be updated for the current week with background color
function addDatesToWeekly(){

    let currentDayOfWeek = moment().day();
    let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    for(let i = 0; i < weekdays.length; i++){

        //Add date to the calendar
        let day = moment().day(i);
        $("#" + weekdays[i] + "-date").html(day.format("ddd M/DD"));

        //Add color based on past/present/future
        if (currentDayOfWeek > i){
            $("#" + weekdays[i] + "-text").addClass("day-past");
        } else if (currentDayOfWeek === i){
            $("#" + weekdays[i] + "-text").addClass("day-present");
        } else if (currentDayOfWeek < i) {
            $("#" + weekdays[i] + "-text").addClass("day-future");
        };
    }
}


//If weather API is given, will display the current weather for the day
function getWeather(cityAPIName, myKey) {
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityAPIName + "&units=imperial&appid=" + myKey;

    //API call to get the weather
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
        
        //Add weather information to homepage
        $('#weather-today').html(`The current weather in ${city} is ${currentTemp}&#8457; (${currentWeatherCondition}), with a high of ${currentHigh}&#8457; and low of ${currentLow}&#8457;!`);
    });
}

//To-do list
//add to-do
//edit to-do
//checkmark to-do (and disable)
//Remove to-do


//Edit button to update user information



//Save Weekly to Local Storage
function saveWeekly() {
 
    let storeSavedNotes = JSON.parse(localStorage.getItem("homepageSavedNotes"));    
    if(!storeSavedNotes){
        storeSavedNotes = [];
    }

    //Check values of each textarea
    weeklyNotes.forEach(item => {
        //If there is a new value to store
        if (item.val() != ''){
            //Reset confirmation of if value was saved
            let stored = false;
            //If there isn't anything currently in Local Storage, save this as the first item
            if(!storeSavedNotes[0]){
                storeSavedNotes.push({weekday: item.attr("id"), text: item.val()});
            } else {
                //If there are saved items, go through each item in local storage array
                for (i = 0; i < storeSavedNotes.length; i++){
                    //If local storage item already exists for the specific textarea, replace the item and confirm it has been stored
                    if (storeSavedNotes[i].weekday === item.attr("id")){
                        storeSavedNotes[i].text = item.val();
                        stored = true;
                    }
                }
                //If item was not stored per the above, add new object to Local Storage array
                if (!stored){
                    storeSavedNotes.push({weekday: item.attr("id"), text: item.val()});                 
                }
            }
        } else {
            //Remove item from local storage array if already exists but value is now empty
            for (i = 0; i < storeSavedNotes.length; i++){
                if (storeSavedNotes[i].weekday === item.attr("id")){
                    storeSavedNotes.splice(i, 1);
                }
            }
        }
    })

    //Save to Local Storage
    localStorage.setItem("homepageSavedNotes",JSON.stringify(storeSavedNotes));

}

//FIRST TIME USE: Prompts for name, API key for openweathermap (change to modal later possibly)
function firstTimeUse() {
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

//Local storage pulls information to display
function displaySavedInformation() {
    let storeSavedInformation = JSON.parse(localStorage.getItem("homepageSavedInformation"));
    let storeSavedNotes = JSON.parse(localStorage.getItem("homepageSavedNotes"));

    if(!storeSavedInformation || !storeSavedInformation[0].name) {
        firstTimeUse();
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

    if(storeSavedNotes) {
        weeklyNotes.forEach(item => {
            for (i = 0; i < storeSavedNotes.length; i++){
                if(storeSavedNotes[i].weekday === item.attr("id")){
                    $("#"+item.attr("id")).val(storeSavedNotes[i].text);
                }
            }
        })
    };
};

//Upon opening page
setInterval(currentTime, 1000);
updateGreeting(currentHour);
displaySavedInformation();

//Events
$("#save").click(saveWeekly);

