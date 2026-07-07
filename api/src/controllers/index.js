const { Router } = require('express');
const events = require('./events.controller');

const router = Router();

// Events CRUD
router.get('/events', events.list);


module.exports = router;