const express = require('express');
const app = express();

app.get('/contact', (req, res) => {
  res.send('This is the Contact Page.');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});