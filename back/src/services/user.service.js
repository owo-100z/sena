//const api = require('../utils/apiClient');
const UserRepository = require('../repositories/user.repository');
const { log } = require('../utils/utils');

class UserService {
    // 사용자 목록 조회
    async getUserList(searchOptions) {
        try {
            const users = await UserRepository.getUserList(searchOptions);
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
            await UserRepository.saveUser(user);
            return { status: 'success', message: 'User saved successfully' };
        } catch (error) {
            log(`Error in saveUser: ${error.message}`);
            throw new Error('Failed to save user');
        }
    }

    // 공성전 점수 저장
    async saveUserSiege(user) {
        if (!user || !user.username || !user.std_date || user.score === undefined) {
            throw new Error('Username, date and score are required');
        }
        try {
            await UserRepository.saveUser(user);
            await UserRepository.saveUserScore(user);
            return { status: 'success', message: 'User score saved successfully' };
        } catch (error) {
            log(`Error in saveUserSiege: ${error.message}`);
            throw new Error('Failed to save user siege score');
        }
    }

    // 공성전 점수 삭제
    async deleteUserSiege(id) {
        if (!id) {
            throw new Error('ID is required for deletion');
        }
        try {
            await UserRepository.deleteUserScore(id);
            return { status: 'success', message: 'User siege score deleted successfully' };
        } catch (error) {
            log(`Error in deleteUserSiege: ${error.message}`);
            throw new Error('Failed to delete user siege score');
        }
    }
}

module.exports = new UserService();