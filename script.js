const doc = document;

const hourInput = doc.getElementById('hours');
const minuteInput = doc.getElementById('minutes');
const secondsInput = doc.getElementById('seconds');

const setButton = doc.getElementById('set-btn');

const alarmContainer = doc.getElementById('timers');
const alarmTone = doc.getElementById('alarm-alert');

const intervalMap = new Map();
let counter = 0;

setButton.addEventListener('click', (event)=>{
    event.preventDefault();

    // Get input values
    let hours = Number(hourInput.value);
    let minutes = Number(minuteInput.value);
    let seconds = Number(secondsInput.value);

    // reset input fields
    hourInput.value = '';
    minuteInput.value = '';
    secondsInput.value = '';

    //check edge case
    hours = (!hours || hours < 0) ? 0 : hours;
    minutes = (!minutes || minutes < 0) ? 0 : minutes;
    seconds = (!seconds || seconds < 0) ? 0 : seconds;

    if(hours === 0 && minutes === 0 && seconds === 0) return;

    doc.getElementById('empty').style.display = 'none';
    setAlarm(hours, minutes, seconds);
});

function setAlarm(hh, mm, ss){
    let startTime = hh * 60 * 60 + mm * 60 + ss;

    // Counter creates a unique id everytime an alarm is set
    let id = counter++;

    createTimer(hh, mm, ss, id);
    doc.getElementById(`id_${id}`);

    function updateTimer(){
        let hour = Math.floor(startTime / 3600);
        let minute = Math.floor((startTime % 3600) / 60);
        let second = Math.floor(startTime % 60);
        
        doc.getElementById(`hours_${id}`).value = hour < 10 ? '0'+ hour : hour;
        doc.getElementById(`minutes_${id}`).value = minute < 10 ? '0'+ minute : minute;
        doc.getElementById(`seconds_${id}`).value = second < 10 ? '0'+ second : second;

        startTime--;

        if(startTime < 0){
            clearInterval(timerInterval);
            alarmTone.play();
            updateDisplay(`id_${id}`);
        }
    }

    updateTimer();

    let timerInterval = setInterval(updateTimer, 1000);
    intervalMap.set(`id_${id}`, timerInterval);
}

function updateDisplay(id){
    doc.querySelector(`#timers > #${id}`).style.backgroundColor = '#F0F757';
    doc.querySelector(`#timers > #${id} > .text`).style.display = 'none';
    doc.querySelector(`#timers > #${id} > .countdown`).style.display = 'none';
    doc.querySelector(`#timers > #${id} > .stop-btn`).style.display = 'none';
    doc.querySelector(`#timers > #${id} > .delete-btn`).style.display = 'block';
    doc.querySelector(`#timers > #${id} > .timeup`).style.display = 'block';
}

function stopTimer(id){
    clearInterval(intervalMap.get(id));
    doc.querySelector(`#${id} > .delete-btn`).style.display = 'block';
    doc.querySelector(`#${id} > .delete-btn`).style.border = '1px solid #F0F757';
    doc.querySelector(`#${id} > .stop-btn`).style.display = 'none';
}

function deleteTimer(id){
    doc.querySelector(`#timers > #${id}`).remove();
}

function createTimer(hh, mm, ss, id){
    const div = doc.createElement('div');
    div.className = 'timer';
    div.id = `id_${id}`;
    div.innerHTML = `
    <div class="text">Time left:</div>
    <div class="countdown">
        <input type="number" name="hours" id="hours_${id}" value="${hh}" disabled>
        <span class="colon">:</span>
        <input type="number" name="minutes" id="minutes_${id}" value="${mm}" disabled>
        <span class="colon">:</span>
        <input type="number" name="seconds" id="seconds_${id}" value="${ss}" disabled>
    </div>
    <button class="stop-btn" onclick="stopTimer('id_${id}')" type="submit">Stop</button>
    <div class="timeup">Timer is up!</div>
    <button class="delete-btn" onclick="deleteTimer('id_${id}')" type="submit">Delete</button>`

    alarmContainer.appendChild(div);
}