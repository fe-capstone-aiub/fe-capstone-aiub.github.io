if (!(localStorage.username && localStorage.password)) {
  window.location.href = 'events.html';
}
var crud = '';
var evId = -1;
var originalEvents = []; // Define original events array globally
var events = []; // Define filtered events array globally
$(document).ready(function () {
  fetchEvents();
});

var calendarEl = document.getElementById('calendar');
var calendar;

function ShowCalendar() {
  var calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: function (info, successCallback, failureCallback) {
      //console.log(events);
      successCallback(events);
    },
    eventClick: function (info) {
      //console.log(info.event._def.publicId);
      //console.log(info.event._def.title);
      if (crud == 'edit') {
        editEvent(info.event._def.publicId);
      }
      else if (crud == 'delete') {
        deleteEvent(info.event._def.publicId);
      }

      // alert('Event: ' + info.event.title);
      // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
      // alert('View: ' + info.view.type);

      // // change the border color just for fun
      // info.el.style.borderColor = 'red';
    }
  });

  calendar.render();
}

function fetchEvents() {
  $.ajax({
    url: 'https://callendar-app.onrender.com/events',
    method: 'GET',
    success: function (data) {
      events = data;
      originalEvents = data;
      //console.log(events);
      ShowCalendar();
      updateTypeFilterDropdown();
    },
    error: function () {
      alert('There was an error fetching the events.');
    }
  });
}
function addEventFunc() {
  
  var objs = {
    title: $("#eventName").val(),
    start: $("#fromDate").val(),
    end: $("#fromDate").val(),//$("#toDate").val()
    type: $("#type").val(),
    username: localStorage.username,
    password: localStorage.password
  };
  var objstr = JSON.stringify(objs);

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (JSON.parse(this.responseText).message == "Event inserted successfully") {
        
        alert("Event inserted successfully");
        location.reload();
      } else if (JSON.parse(this.responseText).message == "Invalid admin credentials") {
        alert("Invalid admin credentials");
        localStorage.clear();
        window.location.href = 'events.html';
      }

      calendar.refetchEvents();
    }
  });

  xhr.open("POST", "https://callendar-app.onrender.com/events");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(objstr);
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.clear();
  window.location.href = 'events.html';
});
function getDistinctTypes() {
  const types = originalEvents.map(event => event.type);
  const distinctTypes = [...new Set(types)];
  return distinctTypes;
}
function getEventsByType(type) {
  return originalEvents.filter(event => event.type === type);
}

function updateTypeFilterDropdown() {
  var distinctTypes = getDistinctTypes();
  var typeFilterDropdown = $('#typeFilter');
  typeFilterDropdown.empty(); // Clear existing options

  // Add "All Types" option
  typeFilterDropdown.append($('<option>', {
    value: 'all',
    text: 'All Types'
  }));

  // Add options for each distinct type
  distinctTypes.forEach(function (type) {
    typeFilterDropdown.append($('<option>', {
      value: type,
      text: type
    }));
  });
}

// Event listener for type filter change
$('#typeFilter').on('change', function () {
  var selectedType = $(this).val();
  if (selectedType === 'all') {
    calendar.removeAllEventSources();
    calendar.addEventSource(originalEvents); // Add filtered events
  } else {
    events = getEventsByType(selectedType);
    //console.log(events);
    calendar.removeAllEventSources();
    calendar.addEventSource(events); // Add filtered events
  }
});

$('#deleteMode').on('click', function () {
  //set class to "btn btn-danger"
  if (crud == 'delete') {
    $(this).attr('class', "btn btn-primary");
    crud = '';
  }
  else {
    $('#editMode').attr('class', "btn btn-primary");
    $(this).attr('class', "btn btn-danger");
    crud = "delete";
  }
});
$('#editMode').on('click', function () {
  //set class to "btn btn-primary"
  if (crud == 'edit') {
    $(this).attr('class', "btn btn-primary");
    crud = '';
    
  document.querySelector("#addEvent").innerHTML = "Add Event";
  document.querySelector("#addEvent").setAttribute("onclick", "addEventFunc()");
  
  $("#eventName").val('');
  $("#fromDate").val('');
  $("#type").val('');

  }
  else {
    $('#deleteMode').attr('class', "btn btn-primary");
    $(this).attr('class', "btn btn-danger");
    crud = "edit";
  }
});
function deleteEvent(id) {
  var ev=getEventById(id);
  //console.log(ev[0]);
   if(confirm("Are you sure you want to delete "+ev[0].title+"?")){
     
  //console.log(id);
  data = {
    id: id,
    username: localStorage.username,
    password: localStorage.password
  };
var datastr = JSON.stringify(data);
  //console.log(data);

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (JSON.parse(this.responseText).message == "Event deleted successfully") {
        //delete event by id from events array

        alert("Event Removed successfully");
        location.reload();
      } else if (JSON.parse(this.responseText).message == "Invalid admin credentials") {
        alert("Invalid admin credentials");
        localStorage.clear();
        window.location.href = 'events.html';
      }

      calendar.refetchEvents();
    }
  });

  xhr.open("POST", "https://callendar-app.onrender.com/events/delete");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(datastr);
}

}
function getEventById(id) {
  return originalEvents.find(event => event.id === id);
}
function editEvent(id) {
  var eventsn=originalEvents.find(event => event.id === parseInt(id));
  //console.log(eventsn);
  $("#eventName").val(eventsn.title);
  $("#fromDate").val(eventsn.start);
  $("#type").val(eventsn.type);
  document.querySelector("#addEvent").innerHTML = "Update Event";
  document.querySelector("#addEvent").setAttribute("onclick", "updateEvent(" + id + ")");
  

}
function removeEventById(id) {
  return events.filter(event => event.id !== id);
}
function getEventById(id) {
  return events.filter(event => event.id !== id);
}
function updateEvent(id) {
  
  var objs = {
    id: id,
    title: $("#eventName").val(),
    start: $("#fromDate").val(),
    end: $("#fromDate").val(),//$("#toDate").val()
    type: $("#type").val(),
    username: localStorage.username,
    password: localStorage.password
  };
  var objstr = JSON.stringify(objs);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (JSON.parse(this.responseText).message == "Event updated successfully") {
        alert("Event updated successfully");
        location.reload();

      } else if (JSON.parse(this.responseText).message == "Invalid admin credentials") {
        alert("Invalid admin credentials");
        localStorage.clear();
        window.location.href = 'events.html';
      }

      calendar.refetchEvents();
    }
  });
  xhr.open("POST", "https://callendar-app.onrender.com/events/edit");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(objstr);
}