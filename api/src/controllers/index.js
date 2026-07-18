const { Router } = require("express");
const events = require("./events.controller");
const users = require("./users.controller");
const { auth } = require("../middlewares/auth.mid");
const router = Router();

// Events CRUD
router.get("/events", auth, events.list);
router.post("/events", auth, events.create);
router.get("/events/:id", auth, events.detail);
router.delete("/events/:id", auth, events.delete);
router.patch("/events/:id", auth, events.update);

// Users CRUD
router.post("/users", users.create);
router.post("/sessions", users.login);

module.exports = router;
