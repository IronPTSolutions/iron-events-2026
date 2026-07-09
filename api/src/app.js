require('dotenv').config();

const express = require('express');
const apiRouter = require('./controllers');
const { errors } = require('./middlewares');

require('./lib/db');

const app = express();

app.use(express.json());

app.use('/api/v0', apiRouter);

app.use(errors.notFound);
app.use(errors.globalHandler);

app.listen(3000, () => console.info('Application listen at port 3000'));