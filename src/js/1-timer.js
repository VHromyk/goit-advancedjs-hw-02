import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputRef = document.querySelector('#datetime-picker');
const buttonRef = document.querySelector('[data-start]');
const daysRef = document.querySelector('[data-days]');
const hoursRef = document.querySelector('[data-hours]');
const minutesRef = document.querySelector('[data-minutes]');
const secondsRef = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    updateButtonState(selectedDates);
  },
};

flatpickr('#datetime-picker', options);

buttonRef.addEventListener('click', onSubmit);

let timerId = null;

function updateButtonState(selectedDates) {
  const selected = selectedDates[0];
  const isPast = selected && selected.getTime() < Date.now();
  buttonRef.disabled = isPast;

  if (isPast) {
    iziToast.show({
      message: 'Please choose a date in the future!',
      color: 'yellow',
      position: 'topRight',
    });
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(num) {
  return num.toString().padStart(2, '0');
}

function onSubmit() {
  const currentTime = new Date();
  const goalTime = new Date(inputRef.value.replace(' ', 'T'));

  if (currentTime.getTime() > goalTime.getTime()) {
    return;
  }

  if (timerId) {
    clearInterval(timerId);
  }

  updateTimer(goalTime);

  timerId = setInterval(() => {
    updateTimer(goalTime);
  }, 1000);
}

function updateTimer(goalTime) {
  const currentTime = new Date();
  let deltaTime = goalTime - currentTime;

  if (deltaTime <= 0) {
    clearInterval(timerId);
    daysRef.textContent = '00';
    hoursRef.textContent = '00';
    minutesRef.textContent = '00';
    secondsRef.textContent = '00';
    return;
  }

  const { seconds, minutes, hours, days } = convertMs(deltaTime);

  daysRef.textContent = addLeadingZero(days);
  hoursRef.textContent = addLeadingZero(hours);
  minutesRef.textContent = addLeadingZero(minutes);
  secondsRef.textContent = addLeadingZero(seconds);
}
