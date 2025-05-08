
# Dokumentacja projektu: KRYPTOMAT

## 1. Charakterystyka oprogramowania

**KRYPTOMAT** to edukacyjna aplikacja webowa, która symuluje zarządzanie portfelem kryptowalutowym. Użytkownik może kupować i sprzedawać kryptowaluty (Bitcoin, Ethereum, Litecoin) w oparciu o losowo generowane dane rynkowe. Celem aplikacji jest umożliwienie nauki podstaw inwestowania w kryptowaluty bez ryzyka finansowego.

---

## 2. Prawa autorskie

Projekt **KRYPTOMAT** został stworzony w celach edukacyjnych przez zespół projektowy w ramach zajęć akademickich. Informacje przedstawione w projekcie są prywatnymi opiniami autorów i nie stanowią rekomendacji inwestycyjnych w rozumieniu Rozporządzenia Ministra Finansów z dnia 19 października 2005 roku w sprawie informacji stanowiących rekomendacje dotyczące instrumentów finansowych, ich emiterów lub wystawców (Dz. U. z 2005 roku, Nr 206, poz. 1715). Autorzy projektu nie ponoszą odpowiedzialności za decyzje inwestycyjne podjęte na podstawie materiałów zawartych w projektu, a słuchacz podejmuje decyzje inwestycyjne na własną odpowiedzialność.
Kod źródłowy może być wykorzystywany i modyfikowany zgodnie z licencją [MIT](https://opensource.org/licenses/MIT):

```
MIT License

Copyright (c) 2025 [Twoje Imię]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction...
```

---

## 3. Specyfikacja wymagań

### 3.1 Wymagania funkcjonalne i niefunkcjonalne

| ID  | Nazwa                            | Opis wymagania                                                                 | Typ             | Priorytet |
|-----|----------------------------------|--------------------------------------------------------------------------------|------------------|-----------|
| F1  | Pobieranie danych rynkowych      | System powinien automatycznie pobierać dane o kursach kryptowalut co 5 sekund | Funkcjonalne     | Wysoki    |
| F2  | Wyświetlanie portfela            | Użytkownik widzi stan konta i ilości posiadanych kryptowalut                  | Funkcjonalne     | Wysoki    |
| F3  | Kupno kryptowalut                | Użytkownik może kupić kryptowaluty, jeżeli ma wystarczające środki            | Funkcjonalne     | Wysoki    |
| F4  | Sprzedaż kryptowalut             | Użytkownik może sprzedać kryptowaluty, jeśli posiada ich wystarczającą ilość  | Funkcjonalne     | Wysoki    |
| NF1 | Intuicyjny interfejs użytkownika | Aplikacja powinna być prosta i przyjazna w obsłudze                            | Niefunkcjonalne  | Średni    |
| NF2 | Aktualizacja danych w tle        | Dane rynkowe powinny być odświeżane bez przeładowywania strony                | Niefunkcjonalne  | Średni    |
| NF3 | Responsywność                    | Aplikacja powinna działać poprawnie na urządzeniach mobilnych                 | Niefunkcjonalne  | Średni    |

---

## 4. Architektura i stos technologiczny

### 4.1 Architektura uruchomieniowa (run-time)

**Typ:** Architektura klient-serwer

```
[Frontend (React)] ⇄ [API (Express.js)] ⇄ [Symulowane dane rynkowe / stan użytkownika w pamięci]
```

---

### 4.2 Architektura testowa

- Testy manualne działania interfejsu użytkownika i poprawności logiki zakupów/sprzedaży
- Możliwość dodania testów jednostkowych w `Jest` lub `Vitest` (frontend) i `Mocha`/`Supertest` (backend)

---

### 4.3 Stos technologiczny

| Warstwa         | Technologia         |
|-----------------|---------------------|
| Frontend        | React (JavaScript)  |
| Backend         | Node.js + Express   |
| Stylizacja      | CSS                 |
| Komunikacja     | REST API, `fetch()` |
| Inne            | CORS, JSON          |

---

### 4.4 Procedura instalacji (lokalnie)

1. **Backend**:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Dostępne pod `http://localhost:5000`

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Otwiera się w przeglądarce pod `http://localhost:3000`

---

### 4.5 Procedura rozwoju

- Każda zmiana w kodzie powinna być zatwierdzana przez GitHub z krótkim opisem commita.
- Zalecane jest wdrożenie testów jednostkowych dla logiki backendowej (`/api/buy`, `/api/sell`).
- Można dodać lokalne bazy danych (np. SQLite, MongoDB) w przyszłości dla trwałości danych.

---

### 5 Scenariusze testów

1. **Test zakupu kryptowaluty**
   - **Cel**: Sprawdzić, czy użytkownik może kupić kryptowalutę, jeśli ma wystarczająco środków.
   - **Wejście**: Żądanie POST na endpoint `/api/buy` z danymi kryptowaluty i kwotą.
   - **Oczekiwany wynik**: Status 200, portfel użytkownika zaktualizowany o nową kryptowalutę, saldo zmniejszone.

2. **Test sprzedaży kryptowaluty**
   - **Cel**: Sprawdzić, czy użytkownik może sprzedać kryptowalutę, jeśli ma ją w swoim portfelu.
   - **Wejście**: Żądanie POST na endpoint `/api/sell` z danymi kryptowaluty i ilością.
   - **Oczekiwany wynik**: Status 200, portfel użytkownika zaktualizowany (ilość kryptowaluty zmniejszona), saldo zwiększone.

3. **Test błędu przy niewystarczającej ilości środków**
   - **Cel**: Sprawdzić, czy aplikacja zwróci błąd, gdy użytkownik nie ma wystarczających środków na zakup.
   - **Wejście**: Żądanie POST na endpoint `/api/buy` z danymi kryptowaluty i kwotą większą niż dostępne saldo.
   - **Oczekiwany wynik**: Status 400 i komunikat o błędzie.

4. **Test błędu przy niewystarczającej ilości kryptowaluty**
   - **Cel**: Sprawdzić, czy aplikacja zwróci błąd, gdy użytkownik próbuje sprzedać więcej kryptowaluty, niż ma w portfelu.
   - **Wejście**: Żądanie POST na endpoint `/api/sell` z danymi kryptowaluty i ilością większą niż dostępna w portfelu.
   - **Oczekiwany wynik**: Status 400 i komunikat o błędzie.
