if(localStorage.username && localStorage.password){
  window.location.href = '/';
}
var Login = function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var data = JSON.stringify({
      "username": username,
      "password": password
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
        // Save the credentials in local storage and redirect to the calendar page
        if(JSON.parse(this.responseText).message == "Login successful")
        {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          window.location.href = '/';
        }
        else
        {
          alert("Invalid username or password");
        }
      }
    });

    xhr.open("POST", "https://callendar-app.onrender.com/login");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  }