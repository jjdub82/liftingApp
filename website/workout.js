
function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  
  // Get muscle_group and date from URL parameters
  var group = getUrlParameter('group');
  var date = getUrlParameter('date');
  
  // Use the variables as needed
  console.log('Muscle Group:', group);
  console.log('Date:', date);

  const sessionID = group + ' - ' + date;
   

document.addEventListener('DOMContentLoaded', function(){



   
      const headline = document.createElement('h1');
      headline.className = 'display-3 mx-2 mt-3 mb-3';
      headline.textContent = sessionID
      

      document.getElementById('workout-container').appendChild(headline)


}
)

const muscleGroupDropdown = document.getElementById('muscle-group-select');
const muscle = muscleGroupDropdown.value;
if(muscle){
fetch('/api/exercises/' + muscle)
  .then(response => response.json())
  .then(exerciseNames => {
    let selectExercise = document.createElement('select');
    selectExercise.className = 'form-control';

    exerciseNames.forEach(name => {
      let option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      selectExercise.appendChild(option);
    });

    // Add the select element to the searchResult div
    document.getElementById('exercise-select').appendChild(selectExercise);
  })
  .catch(error => console.error('Error:', error));
}
  document.getElementById('muscle-group-select').addEventListener('change', function() {
    // Get the selected muscle group
    let selectedMuscle = this.value;
  
    // Fetch the exercises for the selected muscle group
    fetch('/api/exercises/' + selectedMuscle)
      .then(response => response.json())
      .then(data => {
        // Get the exercises select element
        let exercisesSelect = document.getElementById('exercise-select');
  
        // Clear the existing options
        exercisesSelect.innerHTML = '';
  
        // Add a default option
        let defaultOption = document.createElement('option');
        defaultOption.textContent = '-- Select an exercise --';
        defaultOption.value = '';
        exercisesSelect.appendChild(defaultOption);
  
        // Add an option for each exercise
        data.forEach(item => {
          let option = document.createElement('option');
          option.textContent = item.name; // Assuming 'name' is the property in your data objects
          option.value = item.name;
          exercisesSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error:', error));
  });
  
  let setCount = 0; // This will keep track of the current set number

document.getElementById('new-set').addEventListener('click', function() {
  // Create the new row div
  let newRow = document.createElement('div');

  // Create the set number display
  let setNumber = document.createElement('span');
  setNumber.textContent = 'Set ' + (++setCount) + ': '; // Increment the set number
  setNumber.className = 'lead mx-2 p-2'
  newRow.appendChild(setNumber);

    // Create line break
    let lineBreak = document.createElement('br');
    newRow.appendChild(lineBreak);

  // Create the weight input
  let weightInput = document.createElement('input');
  weightInput.type = 'number';
  weightInput.className = 'mx-2 p-2 mt-3'
  weightInput.style = 'max-width:90%'
  weightInput.placeholder = 'Weight';
  newRow.appendChild(weightInput);

  // Create the reps input
  let repsInput = document.createElement('input');
  repsInput.type = 'number';
  repsInput.className = 'mx-2 p-2 mt-2'
  repsInput.style = 'max-width:90%'
  repsInput.placeholder = 'Reps';
  newRow.appendChild(repsInput);

  // Add the new row to the sets container
  document.getElementById('sets-container').appendChild(newRow);
});

document.getElementById('save-sets').addEventListener('click', function() {
    // Retrieve the exercise name from the select element
    const exerciseSelect = document.getElementById('exercise-select');
    const exerciseName = exerciseSelect.value;
    let sessionID2 = sessionID
  
    // Iterate through each set row
    const setRows = document.querySelectorAll('#sets-container > div');
    const setsData = [];
  
    setRows.forEach((setRow, index) => {
      const weightInput = setRow.querySelector('input[type="number"][placeholder="Weight"]');
      const repsInput = setRow.querySelector('input[type="number"][placeholder="Reps"]');
    
      const weight = weightInput.value;
      const reps = repsInput.value;
      let volume = repsInput.value * weightInput.value;
      const setNumber = index + 1; // Set number is the index + 1
    
      // Create the set data object
      const setData = {
        exercise: exerciseName,
        session_id: sessionID2,
        weight,
        reps,
        volume,
        set_number: setNumber
      };
      console.log('set data:  ', setData);
    
      // Push the set data to the setsData array
      setsData.push(setData);
    
      // Clear the input values
      weightInput.value = '';
      repsInput.value = '';
    
      // Create a 'set display' for the set
      let setDisplay = document.createElement('div');
      setDisplay.className = 'set-display';
    
      let exHeading = document.createElement('h5');
      exHeading.textContent = `Exercise: ${exerciseName}`;
      setDisplay.appendChild(exHeading);
    
      let exSetNum = document.createElement('p');
      exSetNum.className = 'lead';
      exSetNum.textContent = `Set # ${setNumber}`;
      setDisplay.appendChild(exSetNum);
    
      let exWeight = document.createElement('p');
      exWeight.className = 'lead';
      exWeight.textContent = `Weight: ${weight} lbs`;
      setDisplay.appendChild(exWeight);
    
      let exReps = document.createElement('p');
      exReps.className = 'lead';
      exReps.textContent = `Reps: ${reps}`;
      setDisplay.appendChild(exReps);
    
      // Add the set display to a 'sets display' container
      document.getElementById('sets-display-container').appendChild(setDisplay);
    });
    

    
    console.log(JSON.stringify(setsData)); // Add this line

    // Send the sets data to the server
    fetch('/api/sets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setsData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Sets saved successfully:', data);
  
      // Clear the set rows
      const setsContainer = document.getElementById('sets-container');
      setsContainer.innerHTML = '';
      // Handle the response as needed
      // clearNewSets();
    })
    .catch(error => console.error('Error:', error));


  });
  
  let seconds = 0;
  let timer;
  
  function startTimer() {
      // Stop any existing timer
      stopTimer();
      
      // Start a new timer
      timer = setInterval(function() {
          seconds++;
          // Display the time
          document.getElementById('timer').textContent = seconds + ' seconds';
      }, 1000);
  }
  
  function stopTimer() {
      if(timer) {
          clearInterval(timer);
          timer = null;
      }
  }
  
  document.getElementById('start-button').addEventListener('click', startTimer);
  document.getElementById('stop-button').addEventListener('click', stopTimer);
  
  function resetTimer() {
    // Stop the timer
    stopTimer();
    
    // Reset the time
    seconds = 0;
    
    // Update the display
    document.getElementById('timer').textContent = '0 seconds';
}

document.getElementById('reset-button').addEventListener('click', resetTimer);

