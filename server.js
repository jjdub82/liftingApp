const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const db = require("./db.js");
require('dotenv').config();


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hell0000000!')
})



app.use(express.static('website'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json())

app.post('/add-session', async (req, res) => {
    console.log(req.body);  // log the request body

    let { session_date } = req.body;
    const { muscle_group } = req.body;

        // Ensure session_date is in 'YYYY-MM-DD' format
        session_date = new Date(session_date).toISOString().split('T')[0];

    try {
        const result = await db.one('INSERT INTO session(session_date, muscle_group) VALUES($1, $2) RETURNING *', [session_date, muscle_group]);

        
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

  app.get('/api/exercises/:name', async (req, res) => {
    const name = req.params.name;
    const response = await fetch('https://api.api-ninjas.com/v1/exercises?name=' + name, {
      method: 'GET',
      headers: { 'X-Api-Key': process.env.API_KEY }
    });
    const data = await response.json();
    res.json(data);
  });
  


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
        console.log(sets)
        res.json(sets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching records.' });
    }
});

   
   


  app.get('/api/sets/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    console.log("Received sessionID: ", sessionId);
  
    try {
        const data = await db.any('SELECT * FROM sets WHERE session_id = $1', [sessionId]); 
        console.log(data);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json({ error: 'An error occurred while fetching data.' });
    }
});





app.listen(port, () => {
    console.log(` listening on port ${port}`)
  });

