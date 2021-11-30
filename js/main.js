'use strict';

const buttonToogleTimer = document.getElementById('btmToogleTimer');

const buttonPomodoro = document.getElementById('btmPomodoro');
const buttonShortBreak = document.getElementById('btmShortbreak');
const buttonLongBreak = document.getElementById('btmLongbreak');

const elemWorkTip = document.getElementById('workTip');

const elemPomodoro = document.getElementById('pomodoro');

let intervalID;
let isTimerRunning;

const sessionDuration = {
    'pomodoro': {
        duration: 1500, // (25 mins)
        tip: 'Time to Focus!'
    }, 
    'shortBreak': {
        duration: 300, // (5 mins)
        tip: 'Take a break!'
    }, 
    'longBreak': {
        duration: 900,  // (15 mins)
        tip: 'Take a long break!'
    }
}

let currentSession = 'pomodoro';
let secondsTimeLeft = sessionDuration['pomodoro'].duration;

resetTimer();
updateButtonToogleTimerClass(buttonPomodoro);


/**
 *Update class of toogleTimer button
 *
 * @param {*} btm button to copy css class name
 */
function updateButtonToogleTimerClass(btm) {
    buttonToogleTimer.className = btm.className;
}


/**
 * Update clock seconds and minutes
 *
 */
function updateTimer() {

    const seconds = secondsTimeLeft % 60;
    const minutes = parseInt(secondsTimeLeft / 60);

    let clockText = `${minutes}`.padStart(2, '0') + ':' + `${seconds}`.padStart(2, '0');

    elemPomodoro.innerHTML = clockText;
    document.title = `PomodoroJS (${clockText})`;

}



/**
 * Reset Clock timer and variables
 *
 */
function resetTimer() {

    buttonToogleTimer.innerText = 'Start';
    isTimerRunning = false;

    secondsTimeLeft = sessionDuration[currentSession].duration;
    elemWorkTip.innerHTML = sessionDuration[currentSession].tip;


    if (intervalID)
        clearInterval(intervalID);

    // Initialize HTML minutes and seconds value
    updateTimer();

}

/**
 * Start and stop timer
 *
 */
const toogleTimer = () => {

    if (!isTimerRunning) {

        buttonToogleTimer.innerText = 'Stop';
        isTimerRunning = true;

        if (intervalID)
            clearInterval(intervalID);

        // Init time counter
        intervalID = setInterval(() => {

            secondsTimeLeft--;

            if (secondsTimeLeft >= 0)
                updateTimer()

            if (secondsTimeLeft == 0) {
                const audio = new Audio('./sounds/digital.wav');
                audio.play();
            }

        }, 1000);

    }
    else {
        resetTimer();
    }
}


buttonToogleTimer.addEventListener('click', toogleTimer);

buttonPomodoro.addEventListener('click', () => {
    currentSession = 'pomodoro';
    resetTimer();
    updateButtonToogleTimerClass(buttonPomodoro);
});

buttonShortBreak.addEventListener('click', () => {
    currentSession = 'shortBreak';
    resetTimer();
    updateButtonToogleTimerClass(buttonShortBreak);
});

buttonLongBreak.addEventListener('click', () => {
    currentSession = 'longBreak';
    resetTimer();
    updateButtonToogleTimerClass(buttonLongBreak);
});
