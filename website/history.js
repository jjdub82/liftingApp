fetch('/api/sets')
    .then(response => response.json())
    .then(data => {
        const accordion = document.getElementById('historyList'); // replace with your accordion ID

        // Group records by session_id
        const groups = data.reduce((groups, set) => {
            const group = (groups[set.session_id] || []);
            group.push(set);
            groups[set.session_id] = group;
            return groups;
        }, {});

        // For each group, create a card
        Object.entries(groups).forEach(([session_id, sets], index) => {
            const card = document.createElement('div');
            card.className = 'card';

            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';

            const button = document.createElement('button');
            button.className = 'btn btn-link';
            button.setAttribute('data-toggle', 'collapse');
            button.setAttribute('data-target', `#collapse${index}`);
            button.textContent = `Session ${session_id}`; 

            cardHeader.appendChild(button);

            const collapse = document.createElement('div');
            collapse.id = `collapse${index}`;
            collapse.className = 'collapse';
            

            // For each set in the group, create a line in the card body
            sets.forEach(set => {

                const histCard = document.createElement('div');
                histCard.className = 'card histCard';
                collapse.appendChild(histCard)

                const deleteDiv = document.createElement('div');
                deleteDiv.className = 'float-end'
                histCard.appendChild(deleteDiv)


                const deleteBtn = document.createElement('button');
                 deleteBtn.className = 'btn btn-danger float-end';
                 deleteBtn.style = 'width: 2rem; margin-right: 1rem; margin-top: 1rem; margin-bottom: 1rem;'
                 deleteBtn.textContent = 'x'
                 deleteDiv.appendChild(deleteBtn)

                const exName = document.createElement('p');
                exName.textContent = `${set.exercise}`; 
                exName.className = 'lead mx-4'
                
                histCard.appendChild(exName);

                const exWeight = document.createElement('p');
                exWeight.textContent = `${set.weight} lbs.`; 
                exWeight.className = 'lead mx-4'
                histCard.appendChild(exWeight);

                const exReps = document.createElement('p');
                exReps.textContent = `Reps: ${set.reps} Reps`; 
                exReps.className = 'lead mx-4'
                exReps.style = 'border-bottom: 1px solid lightgray; padding-botton: 5px'
                histCard.appendChild(exReps);
                console.log(set);
                deleteBtn.addEventListener('click', () => {
                    console.log("Deleting set with id:", set.id); // Log the set id
                    fetch(`/api/sets/${set.id}`, {
                        method: 'DELETE',
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message);
                        // Remove the set from the DOM
                        histCard.remove();
                    })
                    .catch(error => console.error('Error:', error));
                });

            });

            card.appendChild(cardHeader);
            card.appendChild(collapse);

            accordion.appendChild(card);
        });
    })
    .catch(error => console.error('Error:', error));



    