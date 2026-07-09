const { Router } = require('express');
const events = require('./events.controller');

const router = Router();

// Events CRUD
router.get('/events', events.list);
router.post('/events', events.create);
router.get('/events/:id', events.detail);
router.delete('/events/:id', events.delete);
router.patch('/events/:id', events.update);

module.exports = router;