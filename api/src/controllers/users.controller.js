const createHttpError = require('http-errors');
const User = require('../lib/models/user.model');

const ERROR_USER_ALREADY_EXIST = {
  message: 'User validation fails',
  errors: {
    username: 'Username already exists'
  }
}

module.exports.create = async (req, res, next) => {
  const { username } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    next(createHttpError(409, ERROR_USER_ALREADY_EXIST));
  } else {
    user = await User.create(req.body);
    res.status(201).json(user);
  }
}
