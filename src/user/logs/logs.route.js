const express = require('express');
const { saveALogHandler } = require('./logs.controller');
const router = express.Router();

router.post('/logs', saveALogHandler);

module.exports = router;