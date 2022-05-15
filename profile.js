$(document).ready(function(){
    $('.sidenav').sidenav();
  });
  var currentBookings =[];
  var pastBookings=[];
  var user_id = sessionStorage.getItem('user_id')
  
  let response1 = fetch('http://localhost:8090/reservation/currentReservation',{
      credentials:'include',
    }).then(response=>{
      if(response.status==200){
        var display =  document.getElementById("futureTable");
        let respJ = response.json().then(function(localD){
          console.log(localD.length)
          for (let i = 0; i < localD.length; i += 1) {
            var newBooking = document.createElement('tr');
            newBooking.className = "bookingText"+String(localD[i].placeId);
            var timeS=document.createElement('td')
            timeS.innerHTML=localD[i].startTimeReser;
            newBooking.appendChild(timeS);
            var timeE=document.createElement('td');
            timeS.innerHTML=localD[i].endTimeReser;
            newBooking.appendChild(timeE);
            var cost=document.createElement('td');
            cost.innerHTML="300$"
            newBooking.appendChild(cost);
            var nomer=document.createElement('td');
            nomer.innerHTML=localD[i].placeId;
            newBooking.appendChild(nomer);
            currentBookings.push(localD[i]);
            display.appendChild(newBooking);
          }
          
        });
    }
    else{
      M.toast({html: 'Произошла проблема при отображении текущих броней'});
    }
})

let response2 = fetch('http://localhost:8090/reservation/endedReservation',{
      credentials:'include',
    }).then(response=>{
      if(response.status==200){
        let respJ = response.json().then(function(localD){
          var display = document.getElementById("pastTable");
          console.log(localD.length)
          for (let i = 0; i < localD.length; i += 1) {
            var newBooking = document.createElement('tr');
            newBooking.className = "bookingText"+String(localD[i].placeId);
            var timeS=document.createElement('td')
            timeS.innerHTML=localD[i].startTimeReser;
            newBooking.appendChild(timeS);
            var timeE=document.createElement('td');
            timeE.innerHTML=localD[i].endTimeReser;
            newBooking.appendChild(timeE);
            var nomer=document.createElement('td');
            nomer.innerHTML=localD[i].placeId;
            newBooking.appendChild(nomer);
            var cost=document.createElement('td');
            cost.innerHTML="300$"
            newBooking.appendChild(cost);
            currentBookings.push(localD[i]);  
            display.appendChild(newBooking); 
          }
        });
      }
      else{
        M.toast({html: 'Произошла проблема при отображении прошедших броней'});
      }
})
//console.log(currentBookings);
//console.log(pastBookings);


    

    


