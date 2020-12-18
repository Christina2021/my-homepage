//Any variables


//Edit button to update prompts
let currentHour = moment().startOf('hour');

//Moment.js for time (setInterval used to be in real-time)
function currentTime() {
    $('#current-time').html(moment().format("dddd LL h[:]mm[:]ss A"));

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