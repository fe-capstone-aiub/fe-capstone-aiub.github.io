if(!(localStorage.username && localStorage.password)){
    window.location.href = 'events.html';
  }
  var originalEvents = []; // Define original events array globally
  var events = []; // Define filtered events array globally
  $(document).ready(function() {
    fetchEvents();
  });

  var calendarEl = document.getElementById('calendar');
  var calendar;

  function ShowCalendar() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: function(info, successCallback, failureCallback) {
        console.log(events);
        successCallback(events);
      },
      eventClick: function(info) {
        console.log(info.event._def.publicId);
        console.log(info.event._def.title);

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
      success: function(data) {
        events = data;
        originalEvents = data;
        //console.log(events);
        ShowCalendar();
        updateTypeFilterDropdown();
      },
      error: function() {
        alert('There was an error fetching the events.');
      }
    });
  }

  $("#addEvent").on("click", function() {
    var obj = {
      title: $("#eventName").val(),
      start: $("#fromDate").val(),
      end: $("#fromDate").val(),
      type: $("#type").val()
    };
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

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        if(JSON.parse(this.responseText).message == "Event inserted successfully") {
          events.push(obj);
          originalEvents.push(obj);
          alert("Event inserted successfully");
        } else if (JSON.parse(this.responseText).message == "Invalid admin credentials") {
          alert("Invalid admin credentials");
          localStorage.clear();
          window.location.href = 'login.html';
        }

        calendar.refetchEvents();
      }
    });

    xhr.open("POST", "https://callendar-app.onrender.com/events");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(objstr);
  });

  // Logout function
  document.getElementById('logoutBtn').addEventListener('click', function() {
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
  distinctTypes.forEach(function(type) {
    typeFilterDropdown.append($('<option>', {
      value: type,
      text: type
    }));
  });
}

// Event listener for type filter change
$('#typeFilter').on('change', function() {
  var selectedType = $(this).val();
  if (selectedType === 'all') {
    calendar.removeAllEventSources();
    calendar.addEventSource(originalEvents); // Add filtered events
  } else {
    events = getEventsByType(selectedType);
    console.log(events);
    calendar.removeAllEventSources();
    calendar.addEventSource(events); // Add filtered events
  }
});