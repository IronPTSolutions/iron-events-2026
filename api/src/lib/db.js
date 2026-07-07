const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.info('Successfully connected to the database'))
  .catch((error) => {
    console.error('An error occurred connecting to the database', error);
    process.exit(0);
  });