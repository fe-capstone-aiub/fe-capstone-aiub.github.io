$(document).ready(function() {
  ShowCalendar();
});

var events = [];
var calendarEl = document.getElementById('calendar');
var calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: 'dayGridMonth',

    events: function(info, successCallback, failureCallback ) {
      successCallback(events);
    },

  });

function ShowCalendar() {
  calendar.render();
}

$("#addEvent").on("click", function() {
  var obj={
    title: $("#eventName").val(),
    start: $("#fromDate").val(),
    end: $("#toDate").val()
  }
  events.push(obj);
  console.log(events);

  calendar.refetchEvents();
});