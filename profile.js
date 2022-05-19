$(document).ready(() => {
  $('.sidenav').sidenav();
});
const currentBookings = [];
const pastBookings = [];

const response1 = fetch(
  'http://localhost:8090/reservation/currentReservation',
  {
    credentials: 'include',
  }
).then((response) => {
  if (response.status == 200) {
    const display = document.getElementById('futureTable');
    const respJ = response.json().then((localD) => {
      console.log(localD.length);
      for (let i = 0; i < localD.length; i += 1) {
        const newBooking = document.createElement('tr');
        newBooking.className = 'booking';
        const dateR = document.createElement('td');
        let date = new Date();
        date.setTime(localD[i].startDateReser);
        date = date.toLocaleDateString();
        dateR.innerHTML = date;
        newBooking.appendChild(dateR);
        const timeS = document.createElement('td');
        timeS.innerHTML = localD[i].startTimeReser;
        newBooking.appendChild(timeS);
        const timeE = document.createElement('td');
        timeE.innerHTML = localD[i].endTimeReser;
        newBooking.appendChild(timeE);
        const nomer = document.createElement('td');
        nomer.innerHTML = localD[i].placeId;
        newBooking.appendChild(nomer);
        currentBookings.push(localD[i]);
        display.appendChild(newBooking);
        const btn = document.createElement('div');
        btn.innerHTML = 'Отменить';
        btn.className = 'btn-small waves-effect waves-light red';
        const toDelete = {
          reservationId: localD[i].reservationId,
          placeId: localD[i].placeId,
          startTimeReser: localD[i].startTimeReser,
        };
        // eslint-disable-next-line no-loop-func
        btn.onclick = async () => {
          const resp = await fetch('http://localhost:8090/reservation/delete', {
            method: 'DELETE',
            credentials: 'include',
            body: JSON.stringify(toDelete),
          }).then((resp) => {
            switch (resp.status) {
              case 200:
                M.toast({ html: 'Удаление успешно' });
                btn.parentElement.innerHTML = '';
                break;
              case 400:
                M.toast({ html: 'Авторизуйтесь заново' });
                break;
              case 500:
                M.toast({ html: 'Ошибка на сервере' });
                break;
              default:
                M.toast({ html: 'Unexpected behaviour' });
            }
          });
        };
        newBooking.appendChild(btn);
      }
    });
  } else {
    M.toast({ html: 'Произошла проблема при отображении текущих броней' });
  }
});

const response2 = fetch('http://localhost:8090/reservation/endedReservation', {
  credentials: 'include',
}).then((response) => {
  if (response.status == 200) {
    const respJ = response.json().then((localD) => {
      const display = document.getElementById('pastTable');
      for (let i = 0; i < localD.length; i += 1) {
        const newBooking = document.createElement('tr');
        newBooking.className = `bookingText${String(localD[i].placeId)}`;
        const dateR = document.createElement('td');
        let date = new Date();
        date.setTime(localD[i].startDateReser);
        date = date.toLocaleDateString();
        dateR.innerHTML = date;
        newBooking.appendChild(dateR);
        const timeS = document.createElement('td');
        timeS.innerHTML = localD[i].startTimeReser;
        newBooking.appendChild(timeS);
        const timeE = document.createElement('td');
        timeE.innerHTML = localD[i].endTimeReser;
        newBooking.appendChild(timeE);
        const nomer = document.createElement('td');
        nomer.innerHTML = localD[i].placeId;
        newBooking.appendChild(nomer);
        const cost = document.createElement('td');
        cost.innerHTML = localD[i].coast;
        newBooking.appendChild(cost);
        pastBookings.push(localD[i]);
        display.appendChild(newBooking);
      }
    });
  } else {
    M.toast({ html: 'Произошла проблема при отображении прошедших броней' });
  }
});
