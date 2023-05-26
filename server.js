const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const db = require("./db.js");
require('dotenv').config();
const path = require('path');
const fetch = require('node-fetch');



app.use(express.static('website'));

const port = process.env.PORT || 3000;
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/website/index.html'));
});






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json())

app.post('/add-session', async (req, res) => {

    let { session_date } = req.body;
    const { muscle_group } = req.body;

        // Ensure session_date is in 'YYYY-MM-DD' format
        session_date = new Date(session_date).toISOString().split('T')[0];

    const session_name = `${muscle_group} - ${session_date}`;

    try {
        const result = await db.one('INSERT INTO session(session_date, muscle_group, session_name) VALUES($1, $2, $3) RETURNING *', [session_date, muscle_group, session_name]);

        
        res.status(200).json({ status: 'success', message: 'Session added', session: result });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.toString() });
    }
});

app.get('/api/exercises/:muscle', async (req, res) => {
    const muscle = req.params.muscle;
    const response = await fetch('https://api.api-ninjas.com/v1/exercises?muscle=' + muscle, {
      method: 'GET',
      headers: { 'X-Api-Key': process.env.API_KEY}
    });
    const data = await response.json();
    res.json(data);
  });

//   app.get('/api/exercises/:name?offset=0', async (req, res) => {
//     const name = req.params.name;
//     const response = await fetch('https://api.api-ninjas.com/v1/exercises?name=' + name, {
//       method: 'GET',
//       headers: { 'X-Api-Key': process.env.API_KEY }
//     });
//     const data = await response.json();
//     res.json(data);
//   });
  


  app.get('/sessions', async (req, res) => {
    try {
        const data = await db.any('SELECT * FROM session'); // Replace with your actual query
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json({ error: 'An error occurred while fetching data.' });
    }
});

app.get('/api/sets', async (req, res) => {
    try {
        const sets = await db.any('SELECT * FROM sets');
        // console.log(sets)
        res.json(sets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching records.' });
    }
});

app.post('/api/sets', async (req, res) => {
    const setsDataArray = req.body;
    let errors = []

    // Loop through the array of sets data
    for (let setsData of setsDataArray) {
        const {session_id, exercise, weight, reps, volume, set_number} = setsData;
        // console.log(session_id, exercise, weight, reps, volume, set_number); // log the values

        try {
            await db.none('INSERT INTO sets(session_id, exercise, weight, reps, volume, set_number) VALUES ($1, $2, $3, $4, $5, $6)', [session_id, exercise, weight, reps, volume, set_number]);
        } catch(err) {
            console.log(err);
            errors.push(err);
        }
    }

    if (errors.length >0) {
        res.status(500).json({error: 'Some Erros occurred while trying to insert the data', details: errors});
    } else{

    // send response to client
    res.status(200).json({ message: 'Data successfully inserted' });
    }
});

   


  app.get('/api/sets/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    console.log("Received sessionID: ", sessionId);
  
    try {
        const data = await db.any('SELECT * FROM sets WHERE session_id = $1', [sessionId]); 
        // console.log(data);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json({ error: 'An error occurred while fetching data.' });
    }
});





// app.get('/api/nutrition/:query', async (req, res) => {
//     const name = req.params.name;
//     const response = await fetch('https://api.api-ninjas.com/v1/nutrition?query=' + query, {
//       method: 'GET',
//       headers: { 'X-Api-Key': process.env.API_KEY }
//     });
//     const data = await response.json();
//     res.json(data);
//     console.log(data)
//   });

  app.get('/fetch-nutrition', (req, res) => {
    var requestOptions = {
        method: 'GET',
        headers: {
            "X-Api-Key": process.env.API_KEY
        },
        redirect: 'follow'
    };

    let ingredient = req.query.ingredient;  // assuming you are sending ingredient as a query parameter

    fetch("https://api.api-ninjas.com/v1/nutrition?query="+ ingredient, requestOptions)
        .then(response => response.json())
        .then(data => {
            res.json(data);   // send the data to client
        })
        .catch(error => console.error('Error:', error));
});

app.delete('/api/sets/:id', async (req, res) => {
    const setId = req.params.id;

    try {
        await db.none('DELETE FROM sets WHERE id = $1', [setId]);
        res.status(200).json({ status: 'success', message: 'Set deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while trying to delete the set.' });
    }
});

app.get('/api/exercises/:muscleGroup', async (req, res) => {
    const { muscleGroup } = req.params;
    try {
        const result = await db.any('SELECT * FROM exercises WHERE muscle_group = $1', [muscleGroup]);
        res.status(200).json({ status: 'success', exercises: result });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.toString() });
    }
});







app.listen(port, () => {
    console.log(` listening on port ${port}`)
  });

