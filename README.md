# Model 2D propagacji sygnału WiFi w mieszkaniu

## Autorzy:
 * Bartłomiej Moroz
 * Dawid Sygocki

## Główna funkcjonalność
* dwa źródła promieniowania (routery), co pozwala na obserwację interferencji,
* możliwość zmiany pozycji, mocy i częstotliwości źródeł promieniowania oraz ich włączenia/wyłączenia,
* schemat pomieszczenia wczytywany z przyjaznemu użytkownikowi formatu PNG (w skali szarości)

## Użyte biblioteki:
* https://p5js.org (grafika)
* https://mathjs.org/index.html (macierze)

## Instrukcja uruchomienia

Projekt dostępny jest on-line pod adresem: https://home.elka.pw.edu.pl/~dsygocki/

Istnieje również możliwość uruchomienia lokalnego z wykorzystaniem dowolnego serwera HTTP.  
Dostarczony skrypt `serve.bat` pozwala na wykonanie tej akcji dla systemu Windows z zainstalowanym środowiskiem Python.

Uruchomienie bez serwera nie jest obsługiwane ze względu na ochronę CORS naruszaną w takim przypadku przy wczytywaniu grafik.
