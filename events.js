    if(localStorage.username && localStorage.password){
      window.location.href = 'index.html';
    }
    
  var originalEvents = []; // Define original events array globally
  var events = []; // Define filtered events array globally
$(document).ready(function() {
  fetchEvents();
});

var calendarEl = document.getElementById('calendar');
var calendar;

function ShowCalendar() {
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: function(info, successCallback, failureCallback) {
      console.log(events);
      successCallback(events);
    },
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
      console.log(events);
      ShowCalendar();
      updateTypeFilterDropdown();
    },
    error: function() {
      alert('There was an error fetching the events.');
    }
  });
}

function getDistinctTypes(ev) {
  const types = ev.map(event => event.type);
  const distinctTypes = [...new Set(types)];
  return distinctTypes;
}
function getEventsByType(type) {
return originalEvents.filter(event => event.type === type);
}

function updateTypeFilterDropdown() {
var distinctTypes = getDistinctTypes(originalEvents);
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