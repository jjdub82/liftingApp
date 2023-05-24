let allData = []; // Declare this at the top of your script

document.getElementById('submitIngredient').addEventListener('click', function() {
    // Clear out the previous results
    const table = document.getElementById('nutritionTable');
   
    var myHeaders = new Headers();
    myHeaders.append("X-Api-Key", "9FGcFVzU62vLsFp0Zo/rLg==NKFZzfFVs39uaNIQ");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let ingredient = document.getElementById('ingredientInput').value

    fetch(`/fetch-nutrition?ingredient=${ingredient}`)
    .then(response => response.json())
    .then(data => {
            data.forEach(item => {
                // Create a new row and cells
                const row = document.createElement('tr');

                // Iterate over each key in the item
                Object.keys(item).forEach(key => {
                    const cell = document.createElement('td');
                    cell.textContent = item[key];
                    row.appendChild(cell);
                });

                // Add the row to the table
                table.appendChild(row);
                allData.push(item);  // Push the item into allData
            });

            // Remove total row if it exists
            const totalRow = document.getElementById('total-row');
            if(totalRow) {
                table.removeChild(totalRow);
            }

            // Add total row
            const newTotalRow = document.createElement('tr');
            newTotalRow.id = 'total-row';
            // Calculate and add totals
            // Add a cell for the "Total" label
            let labelCell = document.createElement('td');
            labelCell.textContent = 'Total';
            newTotalRow.appendChild(labelCell);

            ['calories', 'serving_size_g', 'fat_total_g', 'fat_saturated_g', 'protein_g', 'sodium_mg', 'potassium_mg', 'cholesterol_mg', 'carbohydrates_total_g', 'fiber_g', 'sugar_g'].forEach(key => {
                let totalCell = document.createElement('td');
                let total = allData.reduce((sum, item) => sum + Number(item[key] || 0), 0);
                totalCell.textContent = total.toFixed(1);
                newTotalRow.appendChild(totalCell);
            });
            table.appendChild(newTotalRow);

            document.getElementById('ingredientInput').value = '';

        })
        .catch(error => console.error('Error:', error));
});
