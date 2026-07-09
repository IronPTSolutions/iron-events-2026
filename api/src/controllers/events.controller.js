const createHttpError = require('http-errors');
const Event = require('../lib/models/event.model');

module.exports.list = async (req, res, next) => {
  req.log.info('Listing events from database');
  const events = await Event.find();
  res.json(events);
}

module.exports.create = async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
}

module.exports.detail = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (event) res.json(event);
  else next(createHttpError(404, 'Event not found'));
}

module.exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);
  if (event) res.status(204).send();
  else next(createHttpError(404, 'Event not found'));
}

module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findByIdAndUpdate(
    id,
    req.body, 
    { runValidators: true, returnDocument: 'after' }
  );
  if (event) res.json(event);
  else next(createHttpError(404, 'Event not found'));
}

