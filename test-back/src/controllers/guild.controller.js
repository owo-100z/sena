const express = require('express');
const router = express.Router();
const guildService = require('../services/guild.service');
const { log, utils } = require('../utils/utils');

// 사용자 목록 조회
router.get('/users', async (req, res) => {
    try {
        const { isSiege, stdDate } = req.query;
        log(`isSiege: ${isSiege}`);
        const users = isSiege ? await guildService.getUserListSiege({ isSiege, stdDate }) : await guildService.getUserList();

        // log(`Fetched user list: ${JSON.stringify(users)}`);
        
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
    const { username, lv, remarks } = req.body;
    if (!username) {
        return res.status(400).json({
            status: 'fail',
            message: 'Username is required',
        });
    }
    try {
        await guildService.saveUser({ username, lv, remarks });
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
    const { userId, stdDate, score, remarks } = req.body;
    if (!userId || !stdDate || !score) {
        return res.status(400).json({
            status: 'fail',
            message: `required parameter is null [userId: ${userId}, stdDate: ${stdDate}, score: ${score}]`,
        });
    }

    try {
        await guildService.saveSiege({ userId, stdDate, score, remarks });
        res.status(201).json({
            status: 'success',
            message: 'User Siege Record saved successfully',
        });
    } catch (error) {
        log(`Error saving user: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to save user siege record',
            error: error.message,
        });
    }
});

module.exports = router;