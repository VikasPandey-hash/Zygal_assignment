const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = './data.json';

app.post('/submit', (req, res) => {
    const { number } = req.body;
    if (number < 1 || number > 100) {
        return res.status(400).send('Number must be between 1 and 100');
    }

    let data = [];
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    const existingEntry = data.find(item => item.number === number);
    if (existingEntry) {
        existingEntry.count += 1;
    } else {
        data.push({ number, count: 1 });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).send('Number submitted');
});

app.get('/data', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return res.json(data);
    }
    res.json([]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

