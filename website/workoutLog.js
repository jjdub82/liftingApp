 //Create Workout Log
 console.log('the current session id variable is ' + group + ' - ' + date)
 document.getElementById('view-sets').addEventListener('click', function() {
   console.log('Fetching sets'); // add this line
   fetch('/api/sets/' + sessionID)
       .then(response => response.json())
       .then(data => {
           const setsContainer = document.getElementById('sets-container');
           setsContainer.innerHTML = '';
           
           data.forEach(set => {
               let setRow = document.createElement('div');
               setRow.className = 'flex-container'

               // Create and append elements for each property of the set
               // Customize this part according to how you want to display the data

               let exerciseElement = document.createElement('p');
               exerciseElement.textContent = 'Exercise: ' + set.exercise;
               setRow.appendChild(exerciseElement);

               let weightElement = document.createElement('p');
               weightElement.textContent = 'Weight: ' + set.weight;
               setRow.appendChild(weightElement);

               let repsElement = document.createElement('p');
               repsElement.textContent = 'Reps: ' + set.reps;
               setRow.appendChild(repsElement);

               let setNumberElement = document.createElement('p');
               setNumberElement.textContent = 'Set number: ' + set.set_number;
               setRow.appendChild(setNumberElement);

               setsContainer.appendChild(setRow);
           });
       })
       .catch(error => console.error('Error:', error));
});
