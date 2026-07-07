const express = require('express');
const apiRouter = require('./controllers')

const app = express();

app.use('/api/v0', apiRouter);

app.listen(3000, () => console.info('Application listen at port 3000'));