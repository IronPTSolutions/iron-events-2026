const config = require("./config");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;

module.exports = session({
  // Signs the session cookie to prevent tampering; must come from an env variable in production
  secret: config.get("session.secret"),
  // Avoids unnecessary writes to the store when the session data has not changed
  resave: false,
  // Only creates a session once something is stored in it (e.g. after login)
  saveUninitialized: false,
  // Persists sessions in MongoDB so they survive server restarts
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    // Prevents client-side JavaScript from reading the cookie, blocking XSS-based session theft
    httpOnly: true,
    // Session lifetime in milliseconds (24 hours)
    maxAge: 24 * 60 * 60 * 1000,
    // Only send the cookie over HTTPS; set SESSION_SECURE=true in production
    secure: config.get("session.secure"),
  },
});
