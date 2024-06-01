const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;

app.use(bodyParser.json());

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
