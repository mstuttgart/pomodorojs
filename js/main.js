'use strict';

const buttonStarStop = document.getElementById('start-stop');

const buttonPomodoro = document.getElementById('pomodoro');
const buttonShortBreak = document.getElementById('shortbreak');
const buttonLongBreak = document.getElementById('longbreak');

const elemMinutes = document.getElementById('minutes');
const elemSeconds = document.getElementById('seconds');

let intervalID;
let isTimerRunning;

const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakCount: 4,
}

let currentState;

let minutes;
let seconds;

// Init values
resetPomodoro(timer.pomodoro);


/**
 * Reset Pomodoro values and variables
 *
 */
function resetPomodoro(timer_total){
    buttonStarStop.innerText = 'Start';

    currentState = timer_total;

    isTimerRunning = false;

    minutes = timer_total;
    seconds = 0;

    if(intervalID){
        clearInterval(intervalID);
        intervalID = 0;
    }

    // Initialize HTML minutes and seconds value
    elemMinutes.innerHTML = `${minutes}`.padStart(2, '0');
    elemSeconds.innerHTML = `${seconds}`.padStart(2, '0');
}


/**
 * Start Pomodoro timer
 *
 */
function startPomodoro(){
    buttonStarStop.innerText = 'Stop';

    isTimerRunning = true;

    if(intervalID){
        clearInterval(intervalID);
    }

    // Init time counter
    intervalID = setInterval(incremSeconds, 1000);
}


/**
 * Increment clock seconds and minutes
 *
 */
const incremSeconds = () => {

    if (seconds === 0) {
        minutes -= 1;
        seconds = 59;

    } else {
        seconds -= 1;
    }

    if (minutes < 0) {
        resetPomodoro();
    }
    else {
        elemMinutes.innerHTML = `${minutes}`.padStart(2, '0');
        elemSeconds.innerHTML = `${seconds}`.padStart(2, '0');
    }

}


buttonStarStop.addEventListener('click', () => {
    (!isTimerRunning) ? startPomodoro() : resetPomodoro(currentState);
});

buttonPomodoro.addEventListener('click', () => {
    resetPomodoro(timer.pomodoro);
});

buttonShortBreak.addEventListener('click', () => {
    resetPomodoro(timer.shortBreak);
});

buttonLongBreak.addEventListener('click', () => {
    resetPomodoro(timer.longBreak);
});
