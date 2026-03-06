const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

app.get('/health', (req, res) => res.send('OK'));

app.post('/echo', (req, res) => res.json({ body: req.body }));

app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
