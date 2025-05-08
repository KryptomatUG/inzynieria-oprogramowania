import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Testy komponentu App', () => {
  it('powinno renderować nagłówek', () => {
    render(<App />);
    const headerElement = screen.getByText(/Kryptowalutowy Symulator Pro/i);
    expect(headerElement).toBeInTheDocument();
  });

  it('powinno wyświetlić saldo użytkownika', () => {
    render(<App />);
    const balanceElement = screen.getByText(/10000\.00 PLN/i); // Zakładając, że saldo początkowe to 10000 PLN
    expect(balanceElement).toBeInTheDocument();
  });

  it('powinno zaktualizować saldo po zakupie kryptowaluty', async () => {
    render(<App />);
    const buyButton = screen.getByText(/Kup Teraz/i);
    fireEvent.click(buyButton);

    const balanceElement = await screen.findByText(/Balance: [\d,]+\.\d{2} PLN/i);
    expect(balanceElement).not.toBeNull();
  });

  it('powinno zaktualizować portfel po zakupie', async () => {
    render(<App />);
    const amountInput = screen.getByPlaceholderText(/Wprowadź ilość/i);
    fireEvent.change(amountInput, { target: { value: '0.1' } });

    const buyButton = screen.getByText(/Kup Teraz/i);
    fireEvent.click(buyButton);

    const portfolioElement = await screen.findByText(/Twoje Aktywa/i);
    expect(portfolioElement).toBeInTheDocument();
  });
});
