// API Service для работы с бэкендом
class ApiService {
    constructor() {
        // 🔥 ЗАМЕНИТЕ НА ВАШ ДОМЕН ПОСЛЕ ДЕПЛОЯ БЭКЕНДА:
        // После деплоя будет что-то вроде: https://nft-game-backend-username.vercel.app/api
        this.baseURL = 'https://apidsasadsdsad-eqod.vercel.app/api'; 
        this.token = localStorage.getItem('authToken');
    }

    // Установка токена аутентификации
    setAuthToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Удаление токена
    clearAuthToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Базовый запрос
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Добавляем токен авторизации если есть
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // === АУТЕНТИФИКАЦИЯ ===
    async authenticate(initData, user, referredBy = null) {
        const response = await this.request('/auth/telegram', {
            method: 'POST',
            body: JSON.stringify({ initData, user, referredBy })
        });

        if (response.success) {
            this.setAuthToken(response.token);
        }

        return response;
    }

    // === ПОЛЬЗОВАТЕЛЬ ===
    async getUserProfile() {
        return await this.request('/user/profile');
    }

    async updateUserProfile(data) {
        return await this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async updateUserStars(stars) {
        return await this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ stars })
        });
    }

    // === NFT КОЛЛЕКЦИЯ ===
    async getCollection() {
        return await this.request('/nft/collection');
    }

    async buyNFT(templateId, price) {
        return await this.request('/nft/collection', {
            method: 'POST',
            body: JSON.stringify({ action: 'buy', templateId, price })
        });
    }

    async sellNFT(nftId) {
        return await this.request('/nft/collection', {
            method: 'POST',
            body: JSON.stringify({ action: 'sell', nftId })
        });
    }

    async setActiveBattleNFT(nftId) {
        return await this.request('/nft/collection', {
            method: 'POST',
            body: JSON.stringify({ action: 'setActive', nftId })
        });
    }

    // === АПГРЕЙДЫ ===
    async upgradeNFT(nftId, upgradeType, upgradeValue) {
        return await this.request('/nft/upgrade', {
            method: 'POST',
            body: JSON.stringify({ nftId, upgradeType, upgradeValue })
        });
    }

    // === БИТВЫ ===
    async saveBattleResult(battleData) {
        return await this.request('/battle/result', {
            method: 'POST',
            body: JSON.stringify(battleData)
        });
    }

    async getBattleHistory() {
        return await this.request('/battle/history');
    }

    // === РЕФЕРАЛЬНАЯ СИСТЕМА ===
    async getReferralInfo() {
        return await this.request('/referral/info');
    }

    async getReferralFriends() {
        return await this.request('/referral/friends');
    }

    // === МАГАЗИН ===
    async getNFTTemplates() {
        return await this.request('/nft/templates');
    }

    // === ПОКУПКА ЗВЁЗД ===
    async purchaseStars(amount) {
        return await this.request('/shop/stars', {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
    }
}

// Создаём глобальный экземпляр
window.apiService = new ApiService();
