let muscle = 'biceps';
let url = 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle;

fetch(url, {
    method: 'GET',
    headers: { 'X-Api-Key': '9FGcFVzU62vLsFp0Zo/rLg==NKFZzfFVs39uaNIQ'}
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json(); 
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
