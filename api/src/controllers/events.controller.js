const createHttpError = require('http-errors');
const Event = require('../lib/models/event.model');

module.exports.list = async (req, res, next) => {
  const events = await Event.find();
  res.json(events);
}

module.exports.create = async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
}