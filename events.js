    if(localStorage.username && localStorage.password){
      window.location.href = 'index.html';
    }
$(document).ready(function() {
  fetchEvents();
});

var calendarEl = document.getElementById('calendar');
var calendar;

function ShowCalendar() {
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: function(info, successCallback, failureCallback) {
      successCallback(events);
    },
  });

  calendar.render();
}

function fetchEvents() {
  $.ajax({
    url: 'http://127.0.0.1:5000/events',
    method: 'GET',
    success: function(data) {
      events = data;
      console.log(events);
      ShowCalendar();
    },
    error: function() {
      alert('There was an error fetching the events.');
    }
  });
}