const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.get('db.uri'))
  .then(() => console.info('Successfully connected to the database'))
  .catch((error) => {
    console.error('An error occurred connecting to the database', error);
    process.exit(0);
  });