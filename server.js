// Importera nödvändiga moduler
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const open = require("open");

// Skapa en ny express-applikation
const app = express();
const portNr = 8080; 
const jsonFilePath = "./data.json";

// Middleware för att hantera JSON-payload
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Starta servern och öppna webbläsaren automatiskt
app.listen(portNr, () => {
  console.log(`Server ligger nu på port ${portNr} och lyssnar!`);
  open(`http://localhost:${portNr}`);
});

// Hantera GET-förfrågningar till rot-URL
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * Läs alla data från JSON-fil och returnera som svar.
 * Används för att hämta hela datasetet.
 */
app.get("/data", (req, res) => {
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

/**
 * Läs specifik data från JSON-fil baserat på ID och returnera som svar.
 * Används för att hämta en specifik post i datasetet.
 */
app.get("/data/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const jsonData = JSON.parse(data);
      const item = jsonData.find(d => d.id === id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).send("Item not found");
      }
    }
  });
});

/**
 * Spara ny data till JSON-fil.
 * Används för att lägga till en ny post i datasetet.
 */
app.post("/data", (req, res) => {
  const newData = req.body;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const jsonData = JSON.parse(data);
      jsonData.push(newData);
      fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          res.status(500).send("Error writing to data file");
        } else {
          res.status(200).send("Data saved successfully");
        }
      });
    }
  });
});

/**
 * Uppdatera befintlig data i JSON-fil baserat på ID.
 * Används för att uppdatera en specifik post i datasetet.
 */
app.put("/data/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      let jsonData = JSON.parse(data);
      let itemIndex = jsonData.findIndex(d => d.id === id);
      if (itemIndex !== -1) {
        jsonData[itemIndex] = updatedData;
        fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            res.status(500).send("Error updating data file");
          } else {
            res.status(200).send("Data updated successfully");
          }
        });
      } else {
        res.status(404).send("Item not found");
      }
    }
  });
});

/**
 * Ta bort data från JSON-fil baserat på ID.
 * Används för att ta bort en specifik post i datasetet.
 */
app.delete("/data/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      let jsonData = JSON.parse(data);
      jsonData = jsonData.filter(d => d.id !== id);
      fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          res.status(500).send("Error deleting data file");
        } else {
          res.status(200).send("Data deleted successfully");
        }
      });
    }
  });
});

/**
 * Hantera dynamiska rutter.
 * Används för att extrahera parametrar från URL:en och använda dem i svar.
 */
app.get("/user/:username", (req, res) => {
  const username = req.params.username;
  res.send(`Hello, ${username}!`);
});

/**
 * Hantera query parametrar.
 * Används för att filtrera data från JSON-filen baserat på en query parameter.
 */
app.get("/search", (req, res) => {
  const query = req.query.q;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const jsonData = JSON.parse(data);
      const results = jsonData.filter(d => d.name.includes(query));
      res.json(results);
    }
  });
});

/**
 * Sortera data från JSON-filen.
 * Används för att sortera datasetet baserat på ett visst fält.
 */
app.get("/sort/:field", (req, res) => {
  const field = req.params.field;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const jsonData = JSON.parse(data);
      const sortedData = jsonData.sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      });
      res.json(sortedData);
    }
  });
});

/**
 * Beräkna medelvärde av ett numeriskt fält i datasetet.
 * Används för att beräkna medelvärdet av ett specifikt numeriskt fält.
 */
app.get("/average/:field", (req, res) => {
  const field = req.params.field;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const jsonData = JSON.parse(data);
      const values = jsonData.map(d => d[field]).filter(value => typeof value === 'number');
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      res.json({ field, average });
    }
  });
});

/**
 * Beräkna median av ett numeriskt fält i datasetet.
 * Används för att beräkna medianen av ett specifikt numeriskt fält.
 */
app.get("/median/:field", (req, res) => {
  const field = req.params.field;
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const jsonData = JSON.parse(data);
      const values = jsonData.map(d => d[field]).filter(value => typeof value === 'number').sort((a, b) => a - b);
      const mid = Math.floor(values.length / 2);
      const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
      res.json({ field, median });
    }
  });
});

/**
 * Hantera okända rutter.
 * Används för att hantera alla förfrågningar som inte matchar några av de definierade rutterna.
 */
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});