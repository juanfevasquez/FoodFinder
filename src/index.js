const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(`${__dirname}/public`));

const TEMPLATE_PATH = path.join(__dirname, 'templates', 'index.html');
const TEMPLATE = fs.readFileSync(TEMPLATE_PATH).toString();

const CONFIG =  JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')).toString());
const CLIENT_ID = CONFIG.CLIENT_ID;
const CLIENT_KEY = CONFIG.CLIENT_KEY;

app.get('/', (req, res) => {
    const template_inst = TEMPLATE.replace('{CLIENT_ID}', CLIENT_ID)
        .replace('{CLIENT_KEY}', CLIENT_KEY);
    res.send(template_inst);
})

app.listen(4040, () => {
    console.log('listening on port 4040');
})