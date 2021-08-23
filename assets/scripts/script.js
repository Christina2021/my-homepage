//Variables for User Info
let startingModal = $('#startingModal');
let myName = "";
let myWeather;
let myKey;
let cityName;

//Background Images
let morningBackgroundImages = ["./assets/images/background-m1.jpg", "./assets/images/background-m2.jpg", "./assets/images/background-m3.jpg"];
let afternoonBackgroundImages = ["./assets/images/background-a1.jpg", "./assets/images/background-a2.jpg", "./assets/images/background-a3.jpg"];
let eveningBackgroundImages = ["./assets/images/background-e1.jpg", "./assets/images/background-e2.jpg", "./assets/images/background-e3.jpg"];

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

//Add random background image
function addBackgroundImage(backgroundImageArray) {
    let bodyBackground = $("body");

    let randomNumber = Math.floor(Math.random() * (backgroundImageArray.length));
    let randomImage = backgroundImageArray[randomNumber];

    bodyBackground.css("background-image", `url(${randomImage})`);
}

//Get current time; setInterval will be used to constantly update current time
function currentTime() {
    $('#current-time').html(`${moment().format("[~ ]dddd LL[ ~]")}<br>${moment().format("h[:]mm[:]ss a")}`);

    //Update past/present/future colors if start of new hour
    if(moment().startOf('second').isSame(moment().startOf('hour'))){
        //Update currentHour if changed;
        currentHour = moment().startOf('hour');
        updateGreeting(currentHour);
        //Updates information (mainly for weather) every hour
        displaySavedInformation();
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
        $('#specific-greeting').html(`It's late, `);
        addBackgroundImage(eveningBackgroundImages);
    } else if (hour.isBefore(earlyEnd)){
        $('#specific-greeting').html(`It's early, `);
        addBackgroundImage(morningBackgroundImages);
    } else if (hour.isBefore(morningEnd)){
        $('#specific-greeting').html(`Good Morning, `);
        addBackgroundImage(morningBackgroundImages);
    } else if (hour.isBefore(afternoonEnd)){
        $('#specific-greeting').html(`Good Afternoon, `);
        addBackgroundImage(afternoonBackgroundImages);
    } else if (hour.isBefore(eveningEnd)){
        $('#specific-greeting').html(`Good Evening, `);
        addBackgroundImage(eveningBackgroundImages);
    };

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

//Settings Button
//Display User Information
function pullUpUserInfo() {
    let storeSavedInformation = JSON.parse(localStorage.getItem("homepageSavedInformation"));

    $('#users-name').attr("placeholder",storeSavedInformation[0].name);

    $('#users-city').attr("placeholder",storeSavedInformation[0].city);
    if(!storeSavedInformation[0].city){
        $('#users-city').attr("placeholder","Enter City Name");        
    }

    $('#users-api').attr("placeholder",storeSavedInformation[0].apiKey);
    if(!storeSavedInformation[0].apiKey){
        $('#users-api').attr("placeholder","Enter API Key");        
    }    
}

//Update User Information
function updateUserInfo(event) {
    event.preventDefault();
    let storeSavedInformation = JSON.parse(localStorage.getItem("homepageSavedInformation"));

    if($('#users-name').val() != ""){
        let newName = $('#users-name').val();
        storeSavedInformation[0].name = newName;
    }
    if($('#users-city').val() != ""){
        let newCity = $('#users-city').val();
        storeSavedInformation[0].city = newCity;
    }
    if($('#users-api').val() != "" && $('#users-api').val() != "clear"){
        let newApi = $('#users-api').val();
        storeSavedInformation[0].apiKey = newApi;
        storeSavedInformation[0].weather = true;        
    } else if ($('#users-api').val() === "clear"){
        storeSavedInformation[0].apiKey = "";
        storeSavedInformation[0].weather = false;    
    }

    localStorage.setItem("homepageSavedInformation",JSON.stringify(storeSavedInformation));
    displaySavedInformation()

    $('#users-name').val("");
    $('#users-city').val("");
    $('#users-api').val("");
    pullUpUserInfo();
}

//Adds to-do item to to-do list
function addToDo() {

    let newToDoItem = $('#to-do-add-item').val();

    //Create html for item
    let newToDoListItem = $('<li class="mb-2">');
    newToDoListItem.html(`${newToDoItem} <button type="button" class="btn btn-outline-danger btn-sm ms-3 remove-to-do-button"> Remove </button>`);
    //Append to list
    $('#to-do-list').append(newToDoListItem);
    //Clear value in input
    $('#to-do-add-item').val("");

    saveToDos()
}

//Removes to-do item from to-do list
function removeToDo(event) {
    
    let specificListItem = $(event.target).parent();
    specificListItem.remove();

    saveToDos()
}

//Save to-do list to Local Storage
function saveToDos() {

    storeSavedToDos = [];
    
    let listItems = $('#to-do-list li')

    for (let i = 0; i < listItems.length; i++){
        storeSavedToDos.push(listItems[i].innerHTML);
    };

    // console.log(storeSavedToDos)

    //Save to Local Storage
    localStorage.setItem("homepageSavedToDos",JSON.stringify(storeSavedToDos));

}



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

//Clear weekly notes
async function clearWeekly() {

    let storedSavedNotes = JSON.parse(localStorage.getItem("homepageSavedNotes")); 
    if(!storedSavedNotes){
        storedSavedNotes = [];
    }

    localStorage.removeItem("homepageSavedNotes");


    weeklyNotes.forEach(item => {
        $("#"+item.attr("id")).val("");
    })

}

//FIRST TIME USE: Prompts for name, API key for openweathermap (change to modal later possibly)
function firstTimeUse(event) {

    event.preventDefault;

    let myName = $('#initial-users-name').val();
    let myCity = $('#initial-users-city').val();
    let myKey = $('#initial-users-api').val();
    let myWeather = false;

    if(myKey){
        myWeather = true;
    } else {
        myKey = false;
    };
    
    //Local Storage
    let storeSavedInformation = [];
    let savedInformation;

    savedInformation = {name: myName, weather: myWeather, apiKey: myKey, city: myCity};
    storeSavedInformation = JSON.parse(localStorage.getItem("homepageSavedInformation"));

    //Saves object
    storeSavedInformation = [];
    storeSavedInformation[0] = savedInformation;

    //Saves to Local Storage
    localStorage.setItem("homepageSavedInformation",JSON.stringify(storeSavedInformation));
  

    displaySavedInformation()
}


//Local storage pulls information to display
function displaySavedInformation() {
    let storeSavedInformation = JSON.parse(localStorage.getItem("homepageSavedInformation"));
    let storeSavedNotes = JSON.parse(localStorage.getItem("homepageSavedNotes"));

    if(!storeSavedInformation || !storeSavedInformation[0].name) {
        $("#starter").removeClass("hidden");
        return;
    } else {
        $("#starter").addClass("hidden");
        $("#main-page").removeClass("hidden");
        myName = storeSavedInformation[0].name;
        myWeather = storeSavedInformation[0].weather;
        myKey = storeSavedInformation[0].apiKey;
        cityName = storeSavedInformation[0].city;
    
        if (myWeather) {
            let cityNameRevised = cityName.trim().toLowerCase().split(' ').join('+');
            getWeather(cityNameRevised, myKey);
        } else {
            $('#weather-today').empty();
        }
    
        //Set name field in html
        $('#name').html(myName);


        //$("#container").removeClass("hidden");
    }

    if(storeSavedNotes) {
        weeklyNotes.forEach(item => {
            for (let i = 0; i < storeSavedNotes.length; i++){
                if(storeSavedNotes[i].weekday === item.attr("id")){
                    $("#"+item.attr("id")).val(storeSavedNotes[i].text);
                }
            }
        })
    };


}

//Pulls from Local Storage to display to-do list every time the user clicks on the icon to check their to-do list
function displaySavedToDos() {
    let currentItems = $('#to-do-list');
    currentItems.empty();

    let storeSavedToDos = JSON.parse(localStorage.getItem("homepageSavedToDos"));

    if(storeSavedToDos) {
        //Add to-dos to list
        for (let i = 0; i < storeSavedToDos.length; i++) {
            //Create html for item
            let newToDoListItem = $('<li class="mb-2">');
            newToDoListItem.html(`${storeSavedToDos[i]}`);
            //Append to list
            $('#to-do-list').append(newToDoListItem);
        }
    }
}

//Upon opening page
setInterval(currentTime, 1000);
updateGreeting(currentHour);
displaySavedInformation();

//Events
$("#to-do-add-button").click(addToDo);
//Using .on("click") for event handler for dynamically added button
$("#to-do-list").on("click", ".remove-to-do-button", removeToDo);
$('#to-dos').click(displaySavedToDos)
$("#save-weekly").click(saveWeekly);
$('#clear-weekly-confirm').click(clearWeekly);
$("#update-user").click(updateUserInfo);
$("#settings").click(pullUpUserInfo);
$("#lets-go").click(firstTimeUse);
