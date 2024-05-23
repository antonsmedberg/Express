Modulimport:

    express: Används för att skapa servern.
    body-parser: Används för att parsa inkommande request body.
    fs: Används för filoperationer.
    open: Används för att automatiskt öppna webbläsaren när servern startar.

Express-applikation:

    Skapar en ny Express-applikation och ställer in portnumret till 8080.
    Definierar sökvägen till JSON-filen som används för att lagra data.

Middleware:

    express.json(): Hanterar JSON-payloads.
    body-parser.json(): Hanterar JSON-data.
    body-parser.urlencoded({ extended: false }): Hanterar URL-kodad data.

Serverstart:

    Startar servern och öppnar automatiskt webbläsaren till http://localhost:8080.

Routing:

    GET /: Returnerar ett enkelt "Hello World!"-meddelande.
    GET /data: Läser all JSON-data från filen och returnerar den som svar.
    GET /data/:id: Läser specifik data från JSON-filen baserat på ett ID och returnerar den som svar.
    POST /data: Tar emot ny data från klienten och lägger till den i JSON-filen.
    PUT /data/:id: Uppdaterar befintlig data i JSON-filen baserat på ett ID.
    DELETE /data/:id: Tar bort data från JSON-filen baserat på ett ID.

Felsökning:

    Hanterar okända rutter och returnerar en 404-felsida.