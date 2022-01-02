'use strict';

const buttonToogleTimer = document.getElementById('btmToogleTimer');
const buttonSettingsModal = document.getElementById('openSettingsModal');
const ButtonAboutModal = document.getElementById('openAboutModal');

const buttonPomodoro = document.getElementById('btmPomodoro');
const buttonShortBreak = document.getElementById('btmShortbreak');
const buttonLongBreak = document.getElementById('btmLongbreak');

const elemWorkTip = document.getElementById('workTip');
const elemPomodoro = document.getElementById('pomodoro');

// Get the modal
var settingsModal = document.getElementById("settingsmodal");
var aboutModal = document.getElementById("aboutModal");

// Browser restrict loading resources when tab is inactive
const audio = new Audio('./sounds/digital.wav');

let intervalID;
let isTimerRunning;

if (localStorage.getItem('pomodoroValue') === null)
    localStorage.setItem('pomodoroValue', 1500) // (25 mins)

if (localStorage.getItem('shortBreakValue') === null)
    localStorage.setItem('shortBreakValue', 300) // (5 mins)

if (localStorage.getItem('longBreakValue') === null)
    localStorage.setItem('longBreakValue', 900) // (15 mins)

const sessionInfo = {
    type: {
        'pomodoro': {
            duration: localStorage.getItem('pomodoroValue'),
            tip: 'Time to Focus!',
            btmElem: buttonPomodoro,
        },
        'shortBreak': {
            duration: localStorage.getItem('shortBreakValue'),
            tip: 'Take a break!',
            btmElem: buttonShortBreak,
        },
        'longBreak': {
            duration: localStorage.getItem('longBreakValue'),
            tip: 'Take a long break!',
            btmElem: buttonLongBreak,
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

resetTimer('pomodoro');

/**
 *Show notification mensage
 *
 */
function showNotification(mensage) {

    const notification = new Notification("Pomodorini", {
        body: mensage,
    })

    notification.onclick = (e) => {
        window.location.href = 'https://mstuttgart.github.io/pomodorini';
    };
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
    document.title = `Pomodorini (${clockText})`;

}

/**
 * Reset Clock timer and variables
 *
 */
function resetTimer(current) {

    sessionInfo.type[sessionInfo.current].btmElem.classList.remove("active");
    sessionInfo.type[current].btmElem.classList.add("active");

    sessionInfo.current = current
    buttonToogleTimer.innerText = 'Start';
    buttonToogleTimer.className = sessionInfo.type[current].btmElem.className;
    isTimerRunning = false;

    secondsTimeLeft = sessionInfo.type[sessionInfo.current].duration;
    elemWorkTip.innerHTML = sessionInfo.type[sessionInfo.current].tip;
    elemWorkTip.style.color = sessionInfo.type[current].btmElem.style.background;

    if (intervalID)
        clearInterval(intervalID);

    // Initialize HTML minutes and seconds value
    updateTimer();

    changeFavicon('favicon');

}


/**
 * Change favicon dynamically
 *
 * @param {*} faviconFile
 */
function changeFavicon(faviconFile) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');

    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = `${faviconFile}.ico`;

    document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * Start and stop timer
 *
 */
const toogleTimer = () => {

    if (!isTimerRunning) {

        buttonToogleTimer.innerText = 'Stop';
        isTimerRunning = true;

        changeFavicon('favicon');

        if (intervalID)
            clearInterval(intervalID);

        // Init time counter
        //TODO move to separate function
        intervalID = setInterval(() => {

            secondsTimeLeft--;

            if (secondsTimeLeft >= 0)
                updateTimer()

            if (secondsTimeLeft == 0) {
                changeFavicon('favicon');

                isTimerRunning = false;
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
        resetTimer(sessionInfo.current);
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
        resetTimer('pomodoro');
    }

});

buttonShortBreak.addEventListener('click', () => {

    if (askPermission()) {
        resetTimer('shortBreak');
    }

});

buttonLongBreak.addEventListener('click', () => {

    if (askPermission()) {
        resetTimer('longBreak');
        sessionInfo.counter = 0;
    }

});


// When the user clicks on the button, open the modal
buttonSettingsModal.onclick = function () {

    settingsModal.style.display = "block";

    const inputPomodoro = document.getElementById('inputPomodoro');
    const inputShortbreak = document.getElementById('inputShortbreak');
    const inputLongbreak = document.getElementById('inputLongbreak');

    // Update inout values. Local Storage values in seconds - convert to minutes
    inputPomodoro.value = localStorage.getItem('pomodoroValue') / 60;
    inputShortbreak.value = localStorage.getItem('shortBreakValue') / 60;
    inputLongbreak.value = localStorage.getItem('longBreakValue') / 60;


    /**
     * Save settings in browser local storage
     *
     */
    // const saveSettings = () => 

    // Update local settings
    document.getElementById('btmSave').addEventListener('click', () => {

        //saving the values in local storage and convert to seconds
        localStorage.setItem('pomodoroValue', inputPomodoro.value * 60);
        localStorage.setItem('shortBreakValue', inputShortbreak.value * 60);
        localStorage.setItem('longBreakValue', inputLongbreak.value * 60);

        sessionInfo.type['pomodoro'].duration = localStorage.getItem('pomodoroValue');
        sessionInfo.type['shortBreak'].duration = localStorage.getItem('shortBreakValue');
        sessionInfo.type['longBreak'].duration = localStorage.getItem('longBreakValue');

        resetTimer('pomodoro');

        settingsModal.style.display = "none";

    });

    // Get the <span> element that closes the modal
    document.getElementById("cancelModal").addEventListener('click', () => {
        settingsModal.style.display = "none";
    });
    // Get the <span> element that closes the modal
    document.getElementById("btmClose").addEventListener('click', () => {
        settingsModal.style.display = "none";
    });    
    
    document.getElementById("background-modal").addEventListener('click', () => {
        settingsModal.style.display = "none";
    });

}

// When the user clicks on the button, open the modal
ButtonAboutModal.onclick = function () {

    aboutModal.style.display = "block";

    // Get the <span> element that closes the modal
    document.getElementById("closeAboutModal").addEventListener('click', () => {
        aboutModal.style.display = "none";
    });
    // Get the <span> element that closes the modal
    document.getElementById("btmCloseAboutModal").addEventListener('click', () => {
        aboutModal.style.display = "none";
    });    
    
    document.getElementById("backgroundAboutModal").addEventListener('click', () => {
        aboutModal.style.display = "none";
    });

}
