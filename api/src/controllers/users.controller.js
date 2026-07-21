const createHttpError = require("http-errors");
const User = require("../lib/models/user.model");

const ERROR_USER_ALREADY_EXIST = {
  message: "User validation fails",
  errors: {
    username: "Username already exists",
  },
};

const ERROR_LOGIN_INVALID = {
  message: "User login fails",
};

module.exports.create = async (req, res, next) => {
  const { username } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    // return is required: without it execution would continue into the else branch
    return next(createHttpError(409, ERROR_USER_ALREADY_EXIST));
  } else {
    user = await User.create(req.body);
    res.status(201).json(user);
  }
};

module.exports.login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(createHttpError(401, "user not found"));
  }

  const match = await user.checkPassword(req.body.password);

  if (!match) {
    return next(createHttpError(401, "invalid password"));
  }

  // Store the user's ID in the session so subsequent requests can identify the caller
  req.session.userId = user.id;

  res.json(user);
};

module.exports.logout = async (req, res, next) => {
  // Destroys the server-side session record; the browser cookie becomes orphaned and unusable
  req.session.destroy();
  res.status(204).send();
};
