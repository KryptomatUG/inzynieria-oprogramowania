// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let userState = {
  balance: 10000.00,
  portfolio: { bitcoin: 0, ethereum: 0, litecoin: 0 }
};

const generateMarketData = () => ({
  bitcoin: Math.random() * (90000 - 80000) + 80000,
  ethereum: Math.random() * (7000 - 6000) + 6000,
  litecoin: Math.random() * (400 - 300) + 300
});

app.get('/api/market', (req, res) => {
  res.json(generateMarketData());
});

app.get('/api/user', (req, res) => {
  res.json(userState);
});

app.post('/api/buy', (req, res) => {
  const { coin, amount } = req.body;
  const prices = generateMarketData();
  const cost = amount * prices[coin];

  if (cost > userState.balance) {
    return res.status(400).json({ error: 'Niewystarczające środki' });
  }

  userState.balance -= cost;
  userState.portfolio[coin] += amount;
  res.json(userState);
});

app.post('/api/sell', (req, res) => {
  const { coin, amount } = req.body;
  const prices = generateMarketData();
  
  if (amount > userState.portfolio[coin]) {
    return res.status(400).json({ error: 'Niewystarczająca ilość kryptowaluty' });
  }

  userState.balance += amount * prices[coin];
  userState.portfolio[coin] -= amount;
  res.json(userState);
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});