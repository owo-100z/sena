const express = require('express');
const router = express.Router();
const guildService = require('../services/guild.service');
const { log, utils } = require('../utils/utils');

// 사용자 목록 조회
router.get('/users', async (req, res) => {
    try {
        const users = await guildService.getUserList();

        log(`Fetched user list: ${JSON.stringify(users)}`);
        
        res.status(200).json({
        status: 'success',
        data: users,
        });
    } catch (error) {
        log(`Error fetching user list: ${error.message}`);
        res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user list',
        error: error.message,
        });
    }
});

// 사용자 정보 저장
router.post('/users', async (req, res) => {
    const { username, level, remarks } = req.body;
    if (!username) {
        return res.status(400).json({
            status: 'fail',
            message: 'Username is required',
        });
    }
    try {
        await guildService.saveUser({ username, level, remarks });
        res.status(201).json({
            status: 'success',
            message: 'User saved successfully',
        });
    } catch (error) {
        log(`Error saving user: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to save user',
            error: error.message,
        });
    }
});

module.exports = router;