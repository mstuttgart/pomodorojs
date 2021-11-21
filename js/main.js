'use strict';

const buttonStarStop = document.getElementById('start-stop');

const elemMinutes = document.getElementById('minutes');
const elemSeconds = document.getElementById('seconds');

let intervalID;
let isTimerRunning;

const timer = {
    pomodoro: 25,
    shortBreak: 5,
    logBreak: 15,
    longBreak: 4,
}

let pomodoroMinute;
let pomodoroSecond;

// Init values
resetPomodoro();


/**
 * Reset Pomodoro values and variables
 *
 */
function resetPomodoro(){
    buttonStarStop.innerText = 'Start';

    isTimerRunning = false;

    pomodoroMinute = timer.pomodoro;
    pomodoroSecond = 0;

    if(intervalID){
        clearInterval(intervalID);
        intervalID = 0;
    }

    // Initialize HTML minutes and seconds value
    elemMinutes.innerHTML = `${pomodoroMinute}`.padStart(2, '0');
    elemSeconds.innerHTML = `${pomodoroSecond}`.padStart(2, '0');
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

    if (pomodoroSecond === 0) {
        pomodoroMinute -= 1;
        pomodoroSecond = 59;

    } else {
        pomodoroSecond -= 1;
    }

    if (pomodoroMinute < 0) {
        resetPomodoro();
    }
    else {
        elemMinutes.innerHTML = `${pomodoroMinute}`.padStart(2, '0');
        elemSeconds.innerHTML = `${pomodoroSecond}`.padStart(2, '0');
    }

}


buttonStarStop.addEventListener('click', () => {
    (!isTimerRunning) ? startPomodoro() : resetPomodoro();
});