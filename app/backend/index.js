const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.post('/api/example', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ message: `Hello, ${name}!` });
});

module.exports = app;
