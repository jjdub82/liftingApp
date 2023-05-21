document.getElementById('fetch-button').addEventListener('click', function() {
    // Remove existing results if they exist
    let oldResults = document.getElementById('searchResult');
    if(oldResults) {
        oldResults.innerHTML = '';
    }

    let muscle = getSelectedMuscle();
    let url = 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle;
    
    fetch(url, {
        method: 'GET',
        headers: { 'X-Api-Key': '9FGcFVzU62vLsFp0Zo/rLg==NKFZzfFVs39uaNIQ'}
    })
    .then(response => response.json())
    .then(data => {
        const ul = document.createElement('ul');
        ul.className = 'list-group';

        data.forEach(item => {
            let li = document.createElement('li');
            li.textContent = item.name; // Assuming 'name' is the property in your data objects
            li.className = 'list-group-item';
            li.addEventListener('click', function(e) {

                // Clear all selected items
                let listItems = document.querySelectorAll('.list-group-item');
                listItems.forEach(item => {
                    item.style = '';
                });



                li.style = 'background-color: lightblue;font-weight: strong';
                    let exerciseName = e.target.textContent; 
                    console.log(exerciseName)
                    let exerciseURL = 'https://api.api-ninjas.com/v1/exercises?name=' + encodeURIComponent(exerciseName);
                    console.log(exerciseURL)
                    fetch(exerciseURL, {
                        method: 'GET',
                        headers: { 'X-Api-Key': '9FGcFVzU62vLsFp0Zo/rLg==NKFZzfFVs39uaNIQ'}
                        })
                        .then(response => response.json())
                        .then(exerciseDetails => {
                                console.log(exerciseDetails); 
                                console.log(exerciseDetails.instuctions)
                                // Do something with the data
                const descriptionHead = document.createElement('h1');
                descriptionHead.className = 'display-5';
                descriptionHead.textContent = exerciseDetails[0].name
                document.getElementById('exercise-description').appendChild(descriptionHead)


                const descriptionP =document.createElement('p');
                descriptionP.className = 'lead'
                descriptionP.textContent = exerciseDetails[0].instructions

                document.getElementById('exercise-description').appendChild(descriptionP)

                            })

                            .catch(error => console.error('Error:', error));
                        
                
                        
                        });
           
 
            ul.appendChild(li);
        });

        document.getElementById('searchResult').appendChild(ul);
    })
    .catch(error => console.error('Error:', error));


///choose the selected radio value
function getSelectedMuscle() {
    let radios = document.getElementsByName('muscleGroupRadio');

    for(let i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            return radios[i].id; 
        }
    }

    return null; 
}
});

