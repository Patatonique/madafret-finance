const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const { connect } = require('./db');

const app = express();
const port = 5500;

app.use(bodyParser.json());
dotenv.config();
app.use(express.json());

// Configuration de l'authentification OAuth2
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

app.get('/api/dataglobal', async (req, res) => {
  try {
    const spreadsheetId = '1JP9tduwv5M4zEB5gD1DV1al0AXvQmcmgLysbc1Jnm3A';
    const range = 'Ariary!A1:L2';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const values = response.data.values;
    res.json(values);
  } catch (error) {
    console.error('Error retrieving data from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to retrieve data from Google Sheets' });
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const connection = await connect();
  
  try {
    const [emailResult] = await connection.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email]);
    const emailCount = emailResult[0].count;

    if (emailCount > 0) {
      return res.status(400).send('Cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    res.status(200).send('Utilisateur enregistré.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  } finally {
    connection.end();
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const connection = await connect();

  try {
    const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Incorrect password');
    }

    const token = jwt.sign({ id: user.id }, 'secret');
    res.status(200).json({ token, username: user.username, email: user.email });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  } finally {
    connection.end();
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'secret', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.get('/users', authenticateJWT, async (req, res) => {
  const connection = await connect();

  try {
    const [results] = await connection.query('SELECT * FROM users');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    connection.end();
  }
});

app.get('/devisemaster',async(req,res)=>{
    const connection = await connect();

    try {
      const [results] = await connection.query('SELECT * FROM deviseMaster');
      res.status(200).json(results);
    } catch (error) {
      res.status(500).send(error);
    } finally {
      connection.end();
    }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
