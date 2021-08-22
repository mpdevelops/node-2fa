const express = require('express');
const speakeasy = require('speakeasy');
const uuid = require('uuid');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const app = express();

const db = new JsonDB(new Config('myDB', true, false, '/'));

app.get('/api', (req, res) => res.json({ message: 'Hello World' }));

// register user and create temp secret
app.post('/api/register', (req, res) => {
  const id = uuid.v4();

  try {
    const path = `/user/${id}`;
    const temp_secret = speakeasy.generateSecret();
    db.push(path, { id, temp_secret });
    res.json({ id, secret: temp_secret });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error generating the secret' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
