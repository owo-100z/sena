const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { log, utils } = require('../utils/utils');

module.exports = router;