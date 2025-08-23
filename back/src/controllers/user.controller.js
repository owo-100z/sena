const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { log, utils } = require('../utils/utils');

// 사용자 목록 조회
router.get('/', async (req, res) => {
    try {
        const { username, fr_dt, to_dt } = req.query;
        const searchOptions = {};
        if (username) searchOptions.username = username;
        if (fr_dt) searchOptions.fr_dt = fr_dt;
        if (to_dt) searchOptions.to_dt = to_dt;

        const users = await userService.getUserList(searchOptions);

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
router.post('/', async (req, res) => {
    const { username, remarks } = req.body;
    if (!username) {
        return res.status(400).json({
            status: 'fail',
            message: 'Username is required',
        });
    }
    try {
        await userService.saveUser({ username, remarks });
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

// 공성전 점수 저장
router.post('/siege', async (req, res) => {
    const { username, std_date, score, remarks } = req.body;
    if (!username || !std_date || score === undefined) {
        return res.status(400).json({
            status: 'fail',
            message: 'Username, date and score are required',
        });
    }
    try {
        await userService.saveUserSiege({ username, std_date, score, remarks });
        res.status(201).json({
            status: 'success',
            message: 'User score saved successfully',
        });
    } catch (error) {
        log(`Error saving user score: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to save user score',
            error: error.message,
        });
    }
});

module.exports = router;