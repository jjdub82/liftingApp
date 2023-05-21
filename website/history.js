// Step 1: Fetch the data
fetch('/sessions')
    .then(response => response.json())
    .then(data => {
        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group';

        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            const sessionDate = new Date(item.session_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            listItem.textContent = sessionDate + ' - ' + item.muscle_group;

            listGroup.appendChild(listItem);
        });

        // Add the list group to the historyList container element in your HTML
        const historyList = document.getElementById('historyList');
        historyList.appendChild(listGroup);
        });

  

