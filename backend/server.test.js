const request = require('supertest');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Przykładowe API endpointy
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

// Testy
describe('Testy API KRYPTOMAT', () => {
  it('powinno zwrócić dane rynku kryptowalut', async () => {
    const response = await request(app).get('/api/market');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bitcoin');
    expect(response.body).toHaveProperty('ethereum');
    expect(response.body).toHaveProperty('litecoin');
  });

  it('powinno zwrócić dane użytkownika', async () => {
    const response = await request(app).get('/api/user');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('balance');
    expect(response.body).toHaveProperty('portfolio');
  });

  it('powinno kupić kryptowalutę', async () => {
    const response = await request(app)
      .post('/api/buy')
      .send({ coin: 'bitcoin', amount: 0.1 });
    
    expect(response.status).toBe(200);
    expect(response.body.portfolio.bitcoin).toBeGreaterThan(0);
    expect(response.body.balance).toBeLessThan(10000.00); // Sprawdzenie, że saldo zostało zmniejszone
  });

  it('powinno sprzedać kryptowalutę', async () => {
    // Najpierw kupujemy, by potem móc sprzedać
    await request(app)
      .post('/api/buy')
      .send({ coin: 'ethereum', amount: 0.2 });

    const response = await request(app)
      .post('/api/sell')
      .send({ coin: 'ethereum', amount: 0.1 });
    expect(response.status).toBe(200);
    expect(response.body.portfolio.ethereum).toBeLessThan(0.2); // Sprawdzenie, że ilość ethereum spadła
    expect(response.body.balance).toBeLessThan(10000.00); // Sprawdzenie, że saldo wzrosło
  });

  it('powinno zwrócić błąd przy niewystarczającej ilości środków', async () => {
    const response = await request(app)
      .post('/api/buy')
      .send({ coin: 'litecoin', amount: 10000 }); // Próbujemy kupić zbyt dużą ilość
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Niewystarczające środki');
  });

  it('powinno zwrócić błąd przy niewystarczającej ilości kryptowaluty', async () => {
    const response = await request(app)
      .post('/api/sell')
      .send({ coin: 'bitcoin', amount: 100 }); // Próbujemy sprzedać więcej niż posiadamy
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Niewystarczająca ilość kryptowaluty');
  });
});
