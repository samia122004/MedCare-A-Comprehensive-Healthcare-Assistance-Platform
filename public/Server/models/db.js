const { Client } = require('pg');

// Set up your PostgreSQL client (make sure to update with your PostgreSQL credentials)
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Users",
  password: "postgresql",
  port: 5432, // Default PostgreSQL port
});

// Connect to the database
client.connect();

module.exports = client;
