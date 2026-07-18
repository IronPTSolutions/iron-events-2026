const createHttpError = require("http-errors");
const User = require("../lib/models/user.model");
const Session = require("../lib/models/session.model");

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

  // 24-hour TTL; Mongoose TTL index on Session will auto-delete the document after this date
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1_000);

  const session = await Session.create({
    user: user.id,
    expiresAt,
  });

  res.cookie("sessionid", session.getSignedId(), {
    httpOnly: true,   // blocks JS access to the cookie — mitigates XSS token theft
    sameSite: "strict", // cookie is not sent on cross-site requests — mitigates CSRF
    path: "/",
    expires: expiresAt,
  });

  res.json({ msg: "OK" });
};
