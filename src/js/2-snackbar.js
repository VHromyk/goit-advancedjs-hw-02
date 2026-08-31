import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formRef = document.querySelector('.form');

function onSubmit(event) {
  event.preventDefault();

  const formData = new FormData(formRef);

  const state = formData.get('state');
  const delayValue = Number(formData.get('delay'));

  delayFunction(delayValue, state)
    .then(delay =>
      iziToast.show({
        message: `✅ Fulfilled promise in ${delay}ms`,
        color: 'green',
        position: 'topRight',
      })
    )
    .catch(delay =>
      iziToast.show({
        message: `❌ Rejected promise in ${delay}ms`,
        color: 'red',
        position: 'topRight',
      })
    );
}

function delayFunction(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

formRef.addEventListener('submit', onSubmit);
