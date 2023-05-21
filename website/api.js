// Choose the selected radio value
function getSelectedMuscle() {
    let radios = document.getElementsByName('muscleGroupRadio');

    for(let i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            return radios[i].id; 
        }
    }

    return null; 
}

document.getElementById('fetch-button').addEventListener('click', function() {
    // Remove existing results if they exist
    let oldResults = document.getElementById('searchResult');
    if(oldResults) {
        oldResults.innerHTML = '';
    }
    

    let muscle = getSelectedMuscle();
    let url = 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle;
    console.log(url)
    
    fetch('/api/exercises/' + muscle)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const ul = document.createElement('ul');
        ul.className = 'list-group';

        data.forEach(item => {
            let li = document.createElement('li');
            li.textContent = item.name; // Assuming 'name' is the property in your data objects
            li.className = 'list-group-item';

            // Save the item data on the list element for later use
            li.dataset.exercise = JSON.stringify(item);

            li.addEventListener('click', function(e) {
                // Clear all selected items
                let listItems = document.querySelectorAll('.list-group-item');
                listItems.forEach(item => {
                    item.style = '';
                });

                li.style = 'background-color: lightblue;font-weight: strong';

                // Retrieve the item data from the clicked list element
                let exercise = JSON.parse(e.target.dataset.exercise);
                console.log(exercise)

                // Clear the previous description
                let descriptionDiv = document.getElementById('exercise-description');
                descriptionDiv.innerHTML = '';

                // Add the new description
                const descriptionHead = document.createElement('h1');
                descriptionHead.className = 'display-5';
                descriptionHead.textContent = exercise.name;
                descriptionDiv.appendChild(descriptionHead);

                const descriptionP = document.createElement('p');
                descriptionP.className = 'lead';
                descriptionP.textContent = exercise.instructions;
                descriptionDiv.appendChild(descriptionP);
            });

            ul.appendChild(li);
        });

        document.getElementById('searchResult').appendChild(ul);
    })
    .catch(error => console.error('Error:', error));
});
