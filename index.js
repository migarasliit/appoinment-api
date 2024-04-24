// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');


const app = express();
app.use(bodyParser.json());


dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.DB_PASSWORD)
  }
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.post('/api/appointments', (req, res) => {
  const { patientName, appointmentDate } = req.body;
  const appointment = { patientName, appointmentDate };

  connection.query('INSERT INTO appointments SET ?', appointment, (error, results) => {
    if (error) {
      console.error('Error saving appointment:', error);
      res.status(500).send('Error saving appointment');
      return;
    }
    console.log('Appointment saved successfully:', results);
    res.status(200).send('Appointment saved successfully');
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
