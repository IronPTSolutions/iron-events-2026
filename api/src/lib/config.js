require('dotenv').config();

const convict = require('convict');

const config = convict({
  build: {
    service: {
      doc: 'App name',
      format: String,
      default: process.env.npm_package_name
    },
    version: {
      doc: 'App name',
      format: String,
      default: process.env.npm_package_version
    }
  },
  port: {
    doc: 'Api port to bind',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  db: {
    uri: {
      doc: 'Mongo db connection URI',
      format: String,
      default: '',
      env: 'MONGODB_URI'
    }
  }
});

config.validate({ allowed: 'strict' });

module.exports = config;