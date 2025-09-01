//const api = require('../utils/apiClient');
const GuildRepository = require('../repositories/guild.repository');
const { log } = require('../utils/utils');

class GuildService {
    // 사용자 목록 조회
    async getUserList(searchOptions) {
        try {
            const users = await GuildRepository.getUserList(searchOptions);
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
}

module.exports = new GuildService();