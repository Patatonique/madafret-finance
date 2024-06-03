const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const dotenv = require('dotenv');

const app = express();
const port = 5500;

app.use(bodyParser.json());

dotenv.config();
app.use(express.json());

// Configuration de l'authentification OAuth2
const auth = new google.auth.GoogleAuth({
    keyFile: './credentials.json', // Chemin vers le fichier de clés d'authentification téléchargé depuis Google Cloud Console
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  // Créer un client authentifié pour accéder à Google Sheets API
  const sheets = google.sheets({ version: 'v4', auth });
  
  // Endpoint pour récupérer des données depuis Google Sheets
  app.get('/api/dataglobal', async (req, res) => {
    try {
      const spreadsheetId = '1JP9tduwv5M4zEB5gD1DV1al0AXvQmcmgLysbc1Jnm3A'; // Remplacez par l'ID de votre feuille de calcul
      const range = 'Ariary!A1:L2'; // Remplacez par le nom de la feuille et la plage de cellules que vous souhaitez lire
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
  

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'madafret'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Vérifier si l'email existe déjà
    const emailExistsQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    db.query(emailExistsQuery, [email], async (emailErr, emailResult) => {
        if (emailErr) {
            return res.status(500).send(emailErr);
        }
        const emailCount = emailResult[0].count;
        if (emailCount > 0) {
            // L'email existe déjà, renvoyer une erreur
            return res.status(400).send('Cet email existe déjà.');
        }

        // L'email n'existe pas, continuer avec l'inscription
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [username, email, hashedPassword], (insertErr, insertResult) => {
            if (insertErr) {
                console.log(insertErr)
                return res.status(500).send(insertErr);
            }
            res.status(200).send('Utilisateur enregistré.');
        });
    });
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal server error');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        const user = results[0];
        const username = user.username;
        const email = user.email;

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log('Password mismatch detected');
            return res.status(401).send('Incorrect password');
        }
        const token = jwt.sign({ id: user.id }, 'secret');
        res.status(200).json({ token,username,email });
    });
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

app.get('/users', authenticateJWT, (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
