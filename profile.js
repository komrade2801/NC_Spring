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
        newBooking.className = `bookingText${String(localD[i].placeId)}`;
        const dateR = document.createElement('td');
        let date = new Date();
        date.setTime(localD[i].startDateReser);
        date = `${date.getFullYear.toString}-${date.getMonth.toString}-${date.getDay.toString}`;
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
        currentBookings.push(localD[i]);
        display.appendChild(newBooking);
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
