'use strict';

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
const saveSettings = () => {

    //saving the values in local storage and convert to seconds
    localStorage.setItem('pomodoroValue', inputPomodoro.value * 60);
    localStorage.setItem('shortBreakValue', inputShortbreak.value * 60);
    localStorage.setItem('longBreakValue', inputLongbreak.value * 60);

    document.getElementById('workTip').innerHTML = '-- Settings Update --';

}

// Update local settings
document.getElementById('btmSave').addEventListener('click', saveSettings);