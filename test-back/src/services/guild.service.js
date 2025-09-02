//const api = require('../utils/apiClient');
const GuildRepository = require('../repositories/guild.repository');
const { log } = require('../utils/utils');

class GuildService {
    // 사용자 목록 조회
    async getUserList() {
        try {
            const users = await GuildRepository.getUserList();
            return users;
        } catch (error) {
            log(`Error in getUserList: ${error.message}`);
            throw new Error('Failed to fetch user list');
        }
    }

    // 사용자 목록 조회 (공성전)
    async getUserListSiege(searchOptions) {
        try {
            const users = await GuildRepository.getUserListSiege(searchOptions);
            return users;
        } catch (error) {
            log(`Error in getUserList: ${error.message}`);
            throw new Error('Failed to fetch user list');
        }
    }

    // 사용자 정보 저장
    async saveUser(user) {
        if (!user || !user.username) {
            throw new Error('Username is required');
        }
        try {
            await GuildRepository.saveUser(user);
            return { status: 'success', message: 'User saved successfully' };
        } catch (error) {
            log(`Error in saveUser: ${error.message}`);
            throw new Error('Failed to save user');
        }
    }

    // 공성전 점수 저장
    async saveSiege(user) {
        if (!user || !user.userId || !user.stdDate || !user.score) {
            throw new Error('required parameter is null');
        }
        try {
            await GuildRepository.saveSiege(user);
            return { status: 'success', message: 'User Siege Record saved successfully' };
        } catch (error) {
            log(`Error in saveSiege: ${error.message}`);
            throw new Error('Failed to save user siege record');
        }
    }
}

module.exports = new GuildService();