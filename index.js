const { connect } = require('./db');

async function runQuery() {
  try {
    const connection = await connect();
    const [rows, fields] = await connection.query('SELECT * FROM users');
    console.log(rows);
    connection.end(); // Fermer la connexion après l'utilisation
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

runQuery();
