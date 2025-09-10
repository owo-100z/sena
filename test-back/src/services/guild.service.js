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

    // 사용자 삭제
    async deleteUser(id) {
        if (!id) {
            throw new Error('ID is required for deletion');
        }
        try {
            await GuildRepository.deleteUser(id);
            return { status: 'success', message: 'User deleted successfully' };
        } catch (error) {
            log(`Error in deleteUser: ${error.message}`);
            throw new Error('Failed to delete user');
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

    // 공성전 기록 대시보드 조회
    async selectSiegeSummaryDashboard(stdDate) {
        try {
            const dashboard = await GuildRepository.selectSiegeSummaryDashboard(stdDate);
            return dashboard;
        } catch (error) {
            log(`Error in selectSiegeSummaryDashboard: ${error.message}`);
            throw new Error('Failed to fetch siege summary dashboard');
        }
    }

    // 공성전 기록 리스트 조회
    async selectSiegeSummaryList(stdDate) {
        try {
            const list = await GuildRepository.selectSiegeSummaryList(stdDate);
            return list;
        } catch (error) {
            log(`Error in selectSiegeSummaryList: ${error.message}`);
            throw new Error('Failed to fetch siege summary list');
        }
    }
}

module.exports = new GuildService();