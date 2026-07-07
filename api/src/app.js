require('dotenv').config();

const express = require('express');
const apiRouter = require('./controllers');

require('./lib/db');

const app = express();

app.use(express.json());

app.use('/api/v0', apiRouter);

app.listen(3000, () => console.info('Application listen at port 3000'));