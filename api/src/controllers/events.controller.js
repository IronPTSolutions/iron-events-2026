const createHttpError = require("http-errors");
const Event = require("../lib/models/event.model");
const User = require("../lib/models/user.model");

module.exports.list = async (req, res, next) => {
  req.log.info("Listing events from database");
  const events = await Event.find().populate("author");
  res.json(events);
};

module.exports.create = async (req, res, next) => {
  const event = await Event.create({
    ...req.body,
    author: req.user.id,
  });

  res.status(201).json(event);
};

module.exports.detail = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findById(id).populate("author");
  if (event) res.json(event);
  else next(createHttpError(404, "Event not found"));
};

module.exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);
  if (event) res.status(204).send();
  else next(createHttpError(404, "Event not found"));
};

module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    returnDocument: "after",
  });
  if (event) res.json(event);
  else next(createHttpError(404, "Event not found"));
};
