import {closeBookingModal, openBookingModal } from "./interface.js";
let currentParking = null;
let user_id;
let id_cookie=getCookie("user-id");
user_id=id_cookie;
sessionStorage.setItem("user_id", user_id);
const BOOKING_FRAME_SIZE = 600;
const width = 600;
const height = 400;
init()
var currentBookings=[];

function getCookie(cookieName) {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}

let initObj =
{
  client_id: '375617435757-oapk0ruihfafpn85e93jv96envuhm5uc.apps.googleusercontent.com'
} 

   gapi.load('auth2', function() {
    /* Ready. Make a call to gapi.auth2.init or some other API */
    gapi.auth2.init(initObj);
  });
  async function signIn(){
    const auth2 = gapi.auth2.getAuthInstance()
    auth2.signIn().then(async googleUser => {
      // метод возвращает объект пользователя
      // где есть все необходимые нам поля
      const profile = googleUser.getBasicProfile()
      // токен
      var id_token = googleUser.getAuthResponse().id_token
      user_id=profile.getId();
      sessionStorage.clear();
      sessionStorage.setItem("user_id", user_id);
      let resp = await fetch('http://localhost:8090/users/addUser', {
      method: 'POST',
      credentials: 'include',
      body: id_token
      }).then(resp=>{

        if((!resp.status==201)&&(!resp.status==200)){
          M.toast({html: 'Что-то пошло не так!'})
        }
        else{
          M.toast({html: "Авторизация прошла успешно"})
          $('.sidenav').sidenav('close');
        }
      })
    })
    if(!currentBookings.length==0){
      let response = fetch('http://localhost:8090/reservation/currentReservation',{
        credentials:'include',
      }).then(response=>{
        if(response.status==200){
          let respJ = response.json().then(function(localD){
            for (let i = 0; i < localD.length; i += 1) {
                var cur=data.find(item => item.id == localD[i].placeId);
                currentBookings.push(localD[i]);
                svg.append('circle')
                .attr('cx', cur.xCoor+50)
                .attr('cy', cur.yCoor+25)
                .attr('r', 5)
                .attr('fill', '#ffef96');
            }
          }
          );
        }
        else{
          M.toast({html: 'Произошла ошибка. Попробуйте снова'});
        }
      
      })
    }
  }

  function signOut(){
    const auth2 = window.gapi.auth2.getAuthInstance()
    auth2.signOut().then(function() {
      console.log('User signed out.')
    })
  }





async function confirmBooking() {
  let parkingDate = document.getElementById("parkingDate").value;
  let startTime = document.getElementById("startTime").value;
  let endTime = document.getElementById("endTime").value;
var today = new Date();
var strS=startTime.split(':');
var strE=endTime.split(':');
today.setHours(strS[0]);
today.setMinutes(strS[1]);
var checkTimeS=today;
today=new Date();
today.setHours(strE[0]);
today.setMinutes(strE[1]);
var checkTimeE=today;
today= new Date();
  if((checkTimeS==="")||(checkTimeE==="")){
    M.toast({html: 'Введите время начала и конца брони'}) 
  }
  else{
  if (checkTimeS>=checkTimeE){
    M.toast({html: 'Время начала не должно превышать время конца бронирования'})
  }
  else{
    if(today>=checkTimeS){
    M.toast({html: 'Время начала бронирования уже прошло'})
    }
    else{
      let reservation = {
        'userId': 1,
        'placeId': currentParking.id,
        'dataStart': parkingDate,
        'timeStart': startTime,
        'dataEnd': parkingDate,
        'timeEnd': endTime
  
      };
      let resp = fetch('http://localhost:8090/reservation/addReservation', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(reservation)
      })
      .then(async (resp)=>{
      switch(resp.status){
        case 201:
        M.toast({html: 'Бронирование успешно'})
        await drawCircles();
        closeBookingModal();
        break;
        case 501:
        M.toast({html: 'Выбранное время уже занято'});
        break;
        case 400:
        M.toast({html: 'Проблема авторизации. Авторизуйтесь заново'});
        break;
        default:
        M.toast({html: 'Произошла ошибка. Попробуйте снова'});  
      }
    })

      
      }
    }
  }
}




function declineBooking() {
$('.collapsible').collapsible('close');
}


function init() {
    let root = document.documentElement;
    root.style.setProperty('--booking-frame-size', BOOKING_FRAME_SIZE + "px")

    const bookButton = document.getElementById("parkingSendButton");
    bookButton.addEventListener("click", confirmBooking)

    const declineBookingButton = document.getElementById("parkingDeclineButton");
    declineBookingButton.addEventListener("click", declineBooking);

    $(document).ready(function(){
      $('.collapsible').collapsible();
    });

    $(document).ready(function(){
      $('.sidenav').sidenav();
    });
    
    document.getElementById('modalCloseBtn').addEventListener("click", flushNodes);
    //Вешает обработчик события на крестик в модальном окне
    if(user_id){
      document.getElementById('signInButton').remove()
      document.getElementById('signInHeaderButton').remove()
    }
    else{
      document.getElementById('signInHeaderButton').onclick = signIn
      //Вешает обработчик события на кнопку "Авторизоваться"
      document.getElementById('signInButton').onclick = signIn
      //Вешает обработчик события на кнопку "Авторизоваться" в боковой менюшке
    }
    
}
function flushNodes(){
  document.getElementById('myBookings').innerHTML="";
  $('.modal').modal('close');
}

    
const  modalDatePicker = document.querySelectorAll('.datepicker');
M.Datepicker.init(modalDatePicker,{
    defaultDate: new Date(),
    format:"yyyy-mm-dd",
    setDefaultDate: true,
    minDate: new Date(),
    container:"#bookingFrame",
    i18n:{
      done:"Подтвердить",
        cancel:"Отменить" 
    }

})
const  modalTimer = document.querySelectorAll('.timepicker');
M.Timepicker.init(modalTimer,{
    twelveHour:false,
    container:"#bookingFrame",
    i18n:{
        done:"Да",
        cancel:"Нет"
    }

})

function handleParkingClick() {
  if(user_id){
    currentParking = this;
    var displayedBookings=currentBookings.filter(reservation => reservation.placeId==currentParking.id);
    displayedBookings.forEach(element => {
      console.log(element)
        var menu = document.getElementById("myBookings");
        var newBooking = document.createElement('div');
        newBooking.className="bookingText"
        newBooking.style.paddingTop= "5px"
        menu.appendChild(newBooking);
        newBooking.innerHTML =element.startTimeReser+"-"+element.endTimeReser;
        var btn = document.createElement('div'); 
        btn.innerHTML = "Отменить";
        btn.className="btn-small waves-effect waves-light red"
        const toDelete = {
          reservationId: element.reservationId,
          placeId: element.placeId,
          startTimeReser: element.startTimeReser
      }
        btn.onclick = async ()=>{
          console.log(toDelete);
          let resp = await fetch('http://localhost:8090/reservation/delete', {
            method: 'DELETE',
            credentials: 'include',
            body:JSON.stringify(toDelete)
            }).then(resp=>{
              switch(resp.status){
                case 200:
                M.toast({html: 'Удаление успешно'})
                btn.parentElement.innerHTML="";
                if (menu.hasChildNodes){
                  menu.innerHTML="У вас нет бронирований"
                }
                break;
                case 400:
                M.toast({html: 'Авторизуйтесь заново'});
                break;
                case 500:
                M.toast({html: 'Произошла ошибка. Попробуйте снова'})  
                break;
                default:
                M.toast({html: 'Пизда пизда пизда пизда'});  
              }
            })
        }
        newBooking.appendChild(btn)
    });
    openBookingModal();
  }
  else{
    M.toast({html: 'Вы не авторизованы!'})
  }
}




var data =[];

async function getData(){
  let url = 'http://localhost:8090/places/info';
  let response = await fetch(url);
  let respJ = response.json();
  await respJ.then(function(localD){
    for (let i = 0; i < localD.length; i += 1) {
        localD[i].status=true;
        delete localD[i].parkingId;
        data.push(localD[i]);
    }
  }
  );
  draw();
}


const svg = d3.select('#bookingFrame')
   .append("div")
   // Container class to make it responsive.
   .classed("svg-container", true) 
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 400")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
   .append('g')

function  draw(){
  const parkings = svg.selectAll('.parking').data(data);
  const parkingHeight = 50;
  const parkingWidth = 100;


  const parkingsAdd = parkings
      .enter()
      .append('rect')


  parkingsAdd.merge(parkings)
      .attr('class', 'parking')
      .attr('height', parkingHeight)
      .attr('width', parkingWidth)
      .attr('x', d => d.xCoor)
      .attr('y', d => d.yCoor)
      .attr('rx', 15)
      .attr('id', d=>d.id)
      .attr('fill', d => d.status? "darkseagreen":"palevioletred")
      .on('click', handleParkingClick)
      .attr('transform', d=>{
          switch (d.orient){
              case "horisontal":
                  return "rotate(0, 0, 0)"
              case "vertical":
                  return `rotate(90, ${d.xCoor+parkingWidth/2}, ${d.yCoor+parkingHeight/2})`
              case "45":
                  return `rotate(45, ${d.xCoor+parkingWidth/2}, ${d.yCoor+parkingHeight/2})`

              default:
                  return "rotate(0, 0, 0)"
          }
      })
      

}




var socket; 
getData().then(()=>{
  socket = new WebSocket("ws://localhost:8090/booking");
    socket.onopen = function(e) {
      console.log("[open] Соединение установлено");
      console.log("Отправляем данные на сервер");
    };
    
    socket.onmessage = async function(event) {
      console.log("Getting message");
      let string = event.data;
      let obj = data.find(item => item.id == string);
      obj.status =!obj.status;
      console.log("Изменилось состояние парковки номер"+obj.id)
      draw();
      drawCircles();
    };
    
    socket.onclose = function(event) {
      if (event.wasClean) {
        alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
      } else {
        // например, сервер убил процесс или сеть недоступна
        // обычно в этом случае event.code 1006
        alert('[close] Соединение прервано');
      }
    };
    
    socket.onerror = function(error) {
      alert(`[error] ${error.message}`);
    };
   drawCircles();
});

async function drawCircles(){
  await svg.selectAll("circle").remove();
  currentBookings=[];
    if(user_id){
      let response = await fetch('http://localhost:8090/reservation/currentReservation',{
        credentials:'include',
      })
        if(response.status==200){
          let respJ = response.json().then(function(localD){
            for (let i = 0; i < localD.length; i += 1) {
                var cur=data.find(item => item.id == localD[i].placeId);
                currentBookings.push(localD[i]);
                svg.append('circle')
                .attr("id", localD[i].placeId)
                .attr('cx', cur.xCoor+50)
                .attr('cy', cur.yCoor+25)
                .attr('r', 5)
                .attr('fill', '#ffef96');
            }
          }
          );
        }
        else{
          M.toast({html: 'Вы не авторизованы для отображения бронирований'});
          M.toast({html: 'Пожалуйста, авторизуйтесь'});
        }  
  }
}