window.onload = function() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  document.getElementById('dateInput').value = today;
}



document.getElementById('session-form').addEventListener('submit', function(event) {
  // Prevent the form from submitting normally
  event.preventDefault();
  console.log('Form submitted');  // Add this line

  // Get the form values
  const muscle_group = document.getElementById('groupInput').value;
  const session_date = document.getElementById('dateInput').value;

  // Send a POST request to the server
  fetch('/add-session', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          muscle_group: muscle_group,
          session_date: session_date
      })
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response data here
      console.log(data)
      localStorage.setItem('sessionData', JSON.stringify(data.session));
      window.location.href = `workout.html?group=${encodeURIComponent(muscle_group)}&date=${session_date}`; 
  })
  .catch(err => {
      // Handle any errors here
      console.error(err);
  });
});

