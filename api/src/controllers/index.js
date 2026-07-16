const { Router } = require('express');
const events = require('./events.controller');
const users = require('./users.controller');

const router = Router();

// Events CRUD
router.get('/events', events.list);
router.post('/events', events.create);
router.get('/events/:id', events.detail);
router.delete('/events/:id', events.delete);
router.patch('/events/:id', events.update);

// Users CRUD
router.post('/users', users.create);

module.exports = router;