const createHttpError = require("http-errors");
const Session = require("../lib/models/session.model");
const User = require("../lib/models/user.model");

module.exports.auth = async (req, res, next) => {
  // Fallback to "" prevents a crash when the request has no Cookie header at all
  const cookieHeader = req.headers.cookie ?? "";

  // find() + slice() instead of split("=")[1] so that values containing "=" (e.g. signed tokens) are not truncated
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("sessionid="))
    ?.slice("sessionid=".length);

  if (!token) return next(createHttpError(401, "no session cookie"));

  // Look up the session document — MongoDB TTL index auto-deletes expired ones,
  // but we also check expiresAt explicitly to catch edge cases within the same second
  const session = await Session.findById(token);
  if (!session) return next(createHttpError(401, "session not found"));

  if (session.expiresAt < new Date()) {
    return next(createHttpError(401, "session expired"));
  }

  const user = await User.findById(session.user);
  if (!user) return next(createHttpError(401, "user not found"));

  // Attach the full user document so downstream handlers can read req.user
  req.user = user;
  next();
};
