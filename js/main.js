'use strict';

const buttonToogleTimer = document.getElementById('btmToogleTimer');

const buttonPomodoro = document.getElementById('btmPomodoro');
const buttonShortBreak = document.getElementById('btmShortbreak');
const buttonLongBreak = document.getElementById('btmLongbreak');

const elemWorkTip = document.getElementById('workTip');

const elemPomodoro = document.getElementById('pomodoro');

let intervalID;
let isTimerRunning;

const sessionInfo = {
    type: {
        'pomodoro': {
            duration: 1500, // (25 mins)
            tip: 'Time to Focus!',
        },
        'shortBreak': {
            duration: 300, // (5 mins)
            tip: 'Take a break!',
        },
        'longBreak': {
            duration: 900,  // (15 mins)
            tip: 'Take a long break!',
        }
    },
    counter: 0,
    current: 'pomodoro',
}

let secondsTimeLeft = sessionInfo.type['pomodoro'].duration;

// Request notification permission
if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
}

resetTimer();
updateButtonToogleTimerClass(buttonPomodoro);


/**
 *Show notification mensage
 *
 */
function showNotification(mensage) {

    const notification = new Notification("PomodoroJS", {
        body: mensage,
    })

    notification.onclick = (e) => {
        window.location.href = 'https://mstuttgart.github.io/pomodorojs';
    };

}


/**
 *Update class of toogleTimer button
 *
 * @param {Element} btm button to copy css class name
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

    secondsTimeLeft = sessionInfo.type[sessionInfo.current].duration;
    elemWorkTip.innerHTML = sessionInfo.type[sessionInfo.current].tip;


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

                // Counter pomodoro session to long break
                if (sessionInfo.current == 'pomodoro') {
                    sessionInfo.counter += 1;
                    buttonPomodoro.innerText = `Pomodoro (${sessionInfo.counter})`

                    if (sessionInfo.counter == 4)
                        showNotification('Take a long break!');
                    else
                        showNotification('Take a break!');

                }
                else {
                    showNotification('Time to focus! Let`s go!');
                }
            }

        }, 1000);

    }
    else {
        resetTimer();
    }
}


/**
 * Ask permission to switch session type
 *
 * @return {boolean} 
 */
function askPermission() {
    return isTimerRunning ? window.confirm('The timer is still running, are you sure you want to switch?') : true;
}


buttonToogleTimer.addEventListener('click', toogleTimer);

buttonPomodoro.addEventListener('click', () => {

    if (askPermission()) {
        sessionInfo.current = 'pomodoro';
        resetTimer();
        updateButtonToogleTimerClass(buttonPomodoro);
    }

});

buttonShortBreak.addEventListener('click', () => {

    if (askPermission()) {
        sessionInfo.current = 'shortBreak';
        resetTimer();
        updateButtonToogleTimerClass(buttonShortBreak);
    }

});

buttonLongBreak.addEventListener('click', () => {

    if (askPermission()) {
        sessionInfo.current = 'longBreak';
        resetTimer();
        sessionInfo.counter = 0;
        updateButtonToogleTimerClass(buttonLongBreak);
    }

});

