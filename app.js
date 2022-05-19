import { closeBookingModal, openBookingModal } from './interface.js';

let currentParking = null;
let userID;
const data = [];
function getCookie(cookieName) {
  const cookie = {};
  document.cookie.split(';').forEach((el) => {
    const [key, value] = el.split('=');
    cookie[key.trim()] = value;
  });
  return cookie[cookieName];
}
const svg = d3
  .select('#bookingFrame')
  .append('div')
  // Container class to make it responsive.
  .classed('svg-container', true)
  .append('svg')
  // Responsive SVG needs these 2 attributes and no width and height attr.
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 600 400')
  // Class to make it responsive.
  .classed('svg-content-responsive', true)
  .append('g');

const idCookie = getCookie('userID');
userID = idCookie;
sessionStorage.setItem('userID', userID);
const BOOKING_FRAME_SIZE = 600;
let currentBookings = [];

function flushNodes() {
  document.getElementById('myBookings').innerHTML = '';
  $('.modal').modal('close');
}

async function drawCircles() {
  await svg.selectAll('circle').remove();
  currentBookings = [];
  if (userID) {
    const response = await fetch(
      'http://localhost:8090/reservation/currentReservation',
      {
        credentials: 'include',
      }
    );
    if (response.status == 200) {
      const respJ = response.json().then((localD) => {
        currentBookings = [];
        for (let i = 0; i < localD.length; i += 1) {
          const cur = data.find((item) => item.id == localD[i].placeId);
          currentBookings.push(localD[i]);
          svg
            .append('circle')
            .attr('id', localD[i].placeId)
            .attr('cx', cur.xcoor + 50)
            .attr('cy', cur.ycoor + 25)
            .attr('r', 5)
            .attr('fill', '#ffef96');
        }
      });
    } else {
      M.toast({ html: 'Вы не авторизованы' });
      M.toast({ html: 'Пожалуйста, авторизуйтесь' });
    }
  }
}

async function confirmBooking() {
  const parkingDate = document.getElementById('parkingDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  let today = new Date();
  const strS = startTime.split(':');
  const strE = endTime.split(':');
  today.setHours(strS[0]);
  today.setMinutes(strS[1]);
  const checkTimeS = today;
  today = new Date();
  today.setHours(strE[0]);
  today.setMinutes(strE[1]);
  const checkTimeE = today;
  today = new Date();
  if (checkTimeS === '' || checkTimeE === '') {
    M.toast({ html: 'Введите время начала и конца брони' });
  } else if (checkTimeS >= checkTimeE) {
    M.toast({ html: 'Введите корректное время брони' });
  } else if (today >= checkTimeS) {
    M.toast({ html: 'Время начала бронирования уже прошло' });
  } else {
    const reservation = {
      userId: 1,
      placeId: currentParking.id,
      dataStart: parkingDate,
      timeStart: startTime,
      dataEnd: parkingDate,
      timeEnd: endTime,
    };
    const resp = fetch('http://localhost:8090/reservation/addReservation', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(reservation),
    }).then(async (resp) => {
      switch (resp.status) {
        case 201:
          M.toast({ html: 'Бронирование успешно' });
          await drawCircles();
          closeBookingModal();
          break;
        case 501:
          M.toast({ html: 'Выбранное время уже занято' });
          break;
        case 400:
          M.toast({ html: 'Проблема авторизации. Авторизуйтесь заново' });
          break;
        default:
          M.toast({ html: 'Произошла ошибка. Попробуйте снова' });
      }
    });
  }
}

function declineBooking() {
  $('.collapsible').collapsible('close');
}

async function signIn() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn().then(async (googleUser) => {
    // метод возвращает объект пользователя
    // где есть все необходимые нам поля
    const profile = googleUser.getBasicProfile();
    // токен
    const idToken = googleUser.getAuthResponse().id_token;
    userID = profile.getId();
    document.cookie = `userID=${userID}`;
    sessionStorage.clear();
    sessionStorage.setItem('userID', userID);
    const resp = await fetch('http://localhost:8090/users/addUser', {
      method: 'POST',
      credentials: 'include',
      body: idToken,
    }).then((resp) => {
      if (!resp.status == 201 && !resp.status == 200) {
        M.toast({ html: 'Что-то пошло не так!' });
      } else {
        M.toast({ html: 'Авторизация прошла успешно' });
        document.getElementById('signInButton').remove();
        document.getElementById('signInHeaderButton').remove();
        $('.sidenav').sidenav('close');
      }
    });
  });
  if (!currentBookings.length == 0) {
    const response = fetch(
      'http://localhost:8090/reservation/currentReservation',
      {
        credentials: 'include',
      }
    ).then((response) => {
      currentBookings = [];
      if (response.status == 200) {
        const respJ = response.json().then((localD) => {
          for (let i = 0; i < localD.length; i += 1) {
            const cur = data.find((item) => item.id == localD[i].placeId);
            currentBookings.push(localD[i]);
            svg
              .append('circle')
              .attr('cx', cur.xcoor + 50)
              .attr('cy', cur.ycoor + 25)
              .attr('r', 5)
              .attr('fill', '#ffef96');
          }
        });
      } else {
        M.toast({ html: 'Произошла ошибка. Попробуйте снова' });
      }
    });
  }
}

function enterProfile() {
  if (userID) {
    window.location.href = 'profile.html';
  } else {
    M.toast({ html: 'Авторизуйтесь для доступа в профиль ' });
  }
}

function init() {
  const root = document.documentElement;
  root.style.setProperty('--booking-frame-size', `${BOOKING_FRAME_SIZE}px`);

  const bookButton = document.getElementById('parkingSendButton');
  bookButton.addEventListener('click', confirmBooking);

  const declineBookingButton = document.getElementById('parkingDeclineButton');
  declineBookingButton.addEventListener('click', declineBooking);

  $(document).ready(() => {
    $('.collapsible').collapsible();
  });

  $(document).ready(() => {
    $('.sidenav').sidenav();
  });

  document
    .getElementById('modalCloseBtn')
    .addEventListener('click', flushNodes);
  document.getElementById('profileButton').onclick = enterProfile;
  document.getElementById('profileHeaderButton').onclick = enterProfile;
  // Вешает обработчик события на крестик в модальном окне
  if (userID) {
    document.getElementById('signInButton').remove();
    document.getElementById('signInHeaderButton').remove();
  } else {
    document.getElementById('signInHeaderButton').onclick = signIn;
    // Вешает обработчик события на кнопку "Авторизоваться"
    document.getElementById('signInButton').onclick = signIn;
    // Вешает обработчик события на кнопку "Авторизоваться" в боковой менюшке
  }
}

init();

const initObj = {
  client_id:
    '375617435757-oapk0ruihfafpn85e93jv96envuhm5uc.apps.googleusercontent.com',
};

gapi.load('auth2', () => {
  /* Ready. Make a call to gapi.auth2.init or some other API */
  gapi.auth2.init(initObj);
});

const modalDatePicker = document.querySelectorAll('.datepicker');
M.Datepicker.init(modalDatePicker, {
  defaultDate: new Date(),
  format: 'yyyy-mm-dd',
  setDefaultDate: true,
  minDate: new Date(),
  container: '#bookingFrame',
  i18n: {
    done: 'Подтвердить',
    cancel: 'Отменить',
  },
});
const modalTimer = document.querySelectorAll('.timepicker');
M.Timepicker.init(modalTimer, {
  twelveHour: false,
  container: '#bookingFrame',
  i18n: {
    done: 'Да',
    cancel: 'Нет',
  },
});

function handleParkingClick() {
  if (userID) {
    currentParking = this;
    const displayedBookings = currentBookings.filter(
      (reservation) => reservation.placeId == currentParking.id
    );
    displayedBookings.forEach((element) => {
      const menu = document.getElementById('myBookings');
      const newBooking = document.createElement('div');
      newBooking.className = 'bookingText';
      newBooking.style.paddingTop = '5px';
      menu.appendChild(newBooking);
      newBooking.innerHTML = `${element.startTimeReser}-${element.endTimeReser}`;
      const btn = document.createElement('div');
      btn.innerHTML = 'Отменить';
      btn.className = 'btn-small waves-effect waves-light red';
      const toDelete = {
        reservationId: element.reservationId,
        placeId: element.placeId,
        startTimeReser: element.startTimeReser,
      };
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
              if (menu.hasChildNodes) {
                menu.innerHTML = 'У вас нет бронирований';
              }
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
    });
    openBookingModal();
  } else {
    M.toast({ html: 'Вы не авторизованы!' });
  }
}

async function getData() {
  const url = 'http://localhost:8090/places/info';
  const response = await fetch(url);
  const respJ = response.json();
  await respJ.then((localD) => {
    for (let i = 0; i < localD.length; i += 1) {
      localD[i].status = true;
      delete localD[i].parkingId;
      data.push(localD[i]);
    }
  });
  draw();
}

function draw() {
  const parkings = svg.selectAll('.parking').data(data);
  const parkingHeight = 50;
  const parkingWidth = 100;

  const parkingsAdd = parkings.enter().append('rect');

  parkingsAdd
    .merge(parkings)
    .attr('class', 'parking')
    .attr('height', parkingHeight)
    .attr('width', parkingWidth)
    .attr('x', (d) => d.xcoor)
    .attr('y', (d) => d.ycoor)
    .attr('rx', 15)
    .attr('id', (d) => d.id)
    .attr('fill', (d) => (d.status ? 'darkseagreen' : 'palevioletred'))
    .on('click', handleParkingClick)
    .attr('transform', (d) => {
      switch (d.orient) {
        case 'horisontal':
          return 'rotate(0, 0, 0)';
        case 'vertical':
          return `rotate(90, ${d.xcoor + parkingWidth / 2}, ${
            d.ycoor + parkingHeight / 2
          })`;
        case '45':
          return `rotate(45, ${d.xcoor + parkingWidth / 2}, ${
            d.ycoor + parkingHeight / 2
          })`;

        default:
          return 'rotate(0, 0, 0)';
      }
    });
}

let socket;
getData().then(() => {
  socket = new WebSocket('ws://localhost:8090/booking');
  socket.onopen = function () {};

  socket.onmessage = async function (event) {
    const string = event.data;
    const obj = data.find((item) => item.id == string);
    obj.status = !obj.status;
    draw();
    drawCircles();
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(
        `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
      );
    } else {
      // например, сервер убил процесс или сеть недоступна
      // обычно в этом случае event.code 1006
      console.log('[close] Соединение прервано');
    }
  };

  socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
  };
  drawCircles();
});
