import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [marketData, setMarketData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketResponse = await fetch('http://localhost:5000/api/market');
        const market = await marketResponse.json();
        
        const userResponse = await fetch('http://localhost:5000/api/user');
        const user = await userResponse.json();
        
        setMarketData(market);
        setUserData(user);
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTransaction = async (type) => {
    if (!amount || isNaN(amount)) {
      alert('Wprowadź poprawną ilość');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          coin: selectedCoin, 
          amount: parseFloat(amount) 
        })
      });

      if (!response.ok) throw new Error(await response.text());
      
      const updatedUser = await response.json();
      setUserData(updatedUser);
      setAmount('');
    } catch (error) {
      alert(`Błąd transakcji: ${error.message}`);
    }
  };

  if (!marketData || !userData) return <div className="loading">Ładowanie...</div>;

  return (
    <div className="container">
      <h1 className="header">💰 Kryptowalutowy Symulator Pro</h1>
      
      <div className="market-grid">
        <div className="card">
          <h2>📈 Rynek w czasie rzeczywistym</h2>
          <table className="crypto-list">
            <tbody>
              {Object.entries(marketData).map(([coin, price]) => (
                <tr key={coin}>
                  <td>
                    <span className="crypto-icon">
                      {coin === 'bitcoin' ? '₿' : coin === 'ethereum' ? 'Ξ' : 'Ł'}
                    </span>
                    {coin.charAt(0).toUpperCase() + coin.slice(1)}
                  </td>
                  <td className="price">
                    {price.toLocaleString('pl-PL', {
                      style: 'currency',
                      currency: 'PLN',
                      minimumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card portfolio-section">
          <h2>💼 Twój Portfel</h2>
          <div className="balance">
            {userData.balance.toLocaleString('pl-PL', {
              style: 'currency',
              currency: 'PLN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
          
          <h3>Twoje Aktywa:</h3>
          <div className="assets-grid">
            {Object.entries(userData.portfolio).map(([coin, amount]) => (
              <div key={coin} className="asset-row">
                <div className="crypto-info">
                  <span className="crypto-icon">
                    {coin === 'bitcoin' ? '₿' : coin === 'ethereum' ? 'Ξ' : 'Ł'}
                  </span>
                  <span className="crypto-name">
                    {coin.charAt(0).toUpperCase() + coin.slice(1)}
                  </span>
                </div>
                <div className="crypto-amount">
                  {parseFloat(amount).toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card transaction-panel">
        <div className="input-group">
          <select
            className="crypto-select"
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
          >
            <option value="bitcoin">₿ Bitcoin</option>
            <option value="ethereum">Ξ Ethereum</option>
            <option value="litecoin">Ł Litecoin</option>
          </select>
          
          <input
            type="number"
            className="input-field"
            placeholder="Wprowadź ilość"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0"
          />
        </div>
        
        <div className="btn-group">
          <button 
            className="btn btn-buy"
            onClick={() => handleTransaction('buy')}
          >
            🚀 Kup Teraz
          </button>
          <button 
            className="btn btn-sell"
            onClick={() => handleTransaction('sell')}
          >
            📉 Sprzedaj
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;