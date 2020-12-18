//Any variables


//Edit button to update prompts

//Moment.js for time (setInterval used to be in real-time)
function currentTime() {
    $('#current-time').html(moment().format("dddd LL h[:]mm[:]ss A"));

    //Update past/present/future colors if start of new hour
    if(moment().startOf('second').isSame(moment().startOf('hour'))){
        //Update currentHour if changed;
        currentHour = moment().startOf('hour');
        updatePastPresentFuture(currentHour);
    };
};
setInterval(currentTime, 1000);
//Moment.js for greeting to change based on the time


//Weather - api stuff


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