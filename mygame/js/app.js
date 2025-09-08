// Основная логика NFT Battle Arena

class NFTGame {
    constructor() {
        // Инициализация Telegram WebApp
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
        }
        
        // Данные NFT
        this.nftTemplates = [
            { name: 'Календарь', img: 'assets/nft/calendar.gif', rarity: 'common' },
            { name: 'Doge Pop', img: 'assets/nft/doge.gif', rarity: 'rare' },
            { name: 'Pepe Master', img: 'assets/nft/pepe.gif', rarity: 'epic' },
            { name: 'Мистик NFT', img: 'assets/nft/other.gif', rarity: 'legendary' }
        ];
        
        this.nftPrices = [100, 150, 200, 250];
        
        // Состояние игры
        this.stars = 0;
        this.collection = [];
        this.activeBattleNft = null;
        this.currentScreen = 'main-menu';
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.loadGameData();
        this.updateStarsDisplay();
        this.renderCenterArea();
        this.renderCollection();
        this.renderShop();
        
        // Настройка Telegram WebApp
        this.setupTelegramWebApp();
        
        console.log('NFT Game initialized');
    }
    
    // Настройка Telegram WebApp
    setupTelegramWebApp() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            // Устанавливаем цвета темы
            Telegram.WebApp.setHeaderColor('#0a0a0b');
            Telegram.WebApp.setBackgroundColor('#0a0a0b');
            
            // Показываем кнопку "Назад" при необходимости
            Telegram.WebApp.onEvent('backButtonClicked', () => {
                this.handleBackButton();
            });
            
            // Обработка закрытия приложения
            Telegram.WebApp.onEvent('mainButtonClicked', () => {
                // Дополнительная логика при нажатии главной кнопки
            });
        }
    }
    
    // Загрузка данных игры
    loadGameData() {
        this.stars = parseInt(localStorage.getItem('nft_game_stars')) || 100;
        this.collection = JSON.parse(localStorage.getItem('nft_game_collection')) || [];
        this.activeBattleNft = JSON.parse(localStorage.getItem('nft_game_active_nft')) || null;
    }
    
    // Сохранение данных игры
    saveGameData() {
        localStorage.setItem('nft_game_stars', this.stars.toString());
        localStorage.setItem('nft_game_collection', JSON.stringify(this.collection));
        localStorage.setItem('nft_game_active_nft', JSON.stringify(this.activeBattleNft));
    }
    
    // Обновление отображения звёзд
    updateStarsDisplay() {
        const starElement = document.getElementById('star-count');
        if (starElement) {
            if (this.stars !== parseInt(starElement.textContent)) {
                animationManager.animateCounter(starElement, parseInt(starElement.textContent) || 0, this.stars);
            }
        }
    }
    
    // Покупка звёзд
    async buyStars() {
        // В реальном приложении здесь будет интеграция с Telegram Stars
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            // Пример интеграции с Telegram Stars (требует настройки бота)
            /*
            Telegram.WebApp.openInvoice('invoice_url', (status) => {
                if (status === 'paid') {
                    this.stars += 100;
                    this.updateStarsDisplay();
                    this.saveGameData();
                }
            });
            */
        }
        
        // Временно для тестирования
        this.stars += 100;
        this.updateStarsDisplay();
        this.saveGameData();
        
        // Анимация кнопки
        const button = event.target.closest('button');
        if (button) {
            animationManager.animateButtonPress(button);
        }
        
        this.showNotification('Куплено 100 ⭐!', 'success');
    }
    
    // Показ уведомлений
    showNotification(message, type = 'info') {
        // Создаём элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Добавляем стили для уведомлений
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    padding: 12px 20px;
                    color: var(--text-primary);
                    z-index: 1000;
                    backdrop-filter: blur(20px);
                    animation: notificationSlideIn 0.3s ease-out;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }
                .notification.success { border-left: 4px solid var(--neon-green); }
                .notification.error { border-left: 4px solid var(--neon-red); }
                .notification.info { border-left: 4px solid var(--neon-blue); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                @keyframes notificationSlideIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'notificationSlideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Начало игры/битвы
    async startBattle() {
        if (!this.activeBattleNft) {
            this.showNotification('Выбери NFT для битвы в коллекции!', 'error');
            return;
        }
        
        if (this.stars < 10) {
            this.showNotification('Недостаточно звёзд! Нужно 10 ⭐', 'error');
            return;
        }
        
        // Списываем звёзды
        this.stars -= 10;
        this.updateStarsDisplay();
        this.saveGameData();
        
        // Анимация кнопки
        const button = document.getElementById('play-button');
        if (button) {
            animationManager.animateButtonPress(button);
        }
        
        // Запускаем битву
        if (battleSystem) {
            await battleSystem.startBattle(this.activeBattleNft);
        }
    }
    
    // Переход к коллекции
    async openCollection() {
        await this.switchScreen('main-menu', 'collection-screen');
        this.renderCollection();
        
        // Показываем кнопку "Назад" в Telegram
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.BackButton.show();
        }
    }
    
    // Переход к магазину
    async openShop() {
        await this.switchScreen('collection-screen', 'shop-screen');
        this.renderShop();
    }
    
    // Возврат к коллекции из магазина
    async backToCollection() {
        await this.switchScreen('shop-screen', 'collection-screen');
        this.renderCollection();
    }
    
    // Возврат в главное меню
    async backToMenu() {
        const currentScreen = document.querySelector('.screen.active');
        await this.switchScreen(currentScreen.id, 'main-menu');
        this.renderCenterArea();
        
        // Скрываем кнопку "Назад" в Telegram
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.BackButton.hide();
        }
    }
    
    // Обработка кнопки "Назад" Telegram
    handleBackButton() {
        const currentScreen = document.querySelector('.screen.active');
        
        switch (currentScreen.id) {
            case 'collection-screen':
            case 'shop-screen':
            case 'result-screen':
                this.backToMenu();
                break;
            case 'battle-screen':
                // Во время битвы кнопка "Назад" отключена
                break;
            default:
                this.backToMenu();
        }
    }
    
    // Переключение экранов
    async switchScreen(fromScreenId, toScreenId) {
        const fromScreen = document.getElementById(fromScreenId);
        const toScreen = document.getElementById(toScreenId);
        
        if (fromScreen && toScreen && animationManager) {
            await animationManager.transitionToScreen(fromScreen, toScreen);
        }
        
        this.currentScreen = toScreenId;
    }
    
    // Рендер центральной области
    renderCenterArea() {
        const centerContent = document.getElementById('center-content');
        if (!centerContent) return;
        
        centerContent.innerHTML = '';
        
        if (this.activeBattleNft) {
            const nftContainer = document.createElement('div');
            nftContainer.className = 'center-nft';
            nftContainer.innerHTML = `
                <img src="${this.activeBattleNft.img}" alt="${this.activeBattleNft.name}" class="center-nft-img">
                <div class="center-nft-name">${this.activeBattleNft.name}</div>
                <div class="center-nft-price">Готов к битве!</div>
            `;
            centerContent.appendChild(nftContainer);
            
            // Анимация появления NFT
            if (animationManager) {
                animationManager.animateNFTAppearance(nftContainer.querySelector('.center-nft-img'));
            }
        } else {
            centerContent.innerHTML = `
                <div class="center-logo">
                    <i class="fas fa-gamepad"></i>
                    <p>Выбери NFT для боя в коллекции</p>
                </div>
            `;
        }
    }
    
    // Рендер коллекции
    renderCollection() {
        const collectionItems = document.getElementById('collection-items');
        const emptyState = document.getElementById('empty-collection');
        
        if (!collectionItems || !emptyState) return;
        
        if (this.collection.length === 0) {
            collectionItems.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            collectionItems.style.display = 'grid';
            emptyState.style.display = 'none';
            
            collectionItems.innerHTML = '';
            
            this.collection.forEach((nft, index) => {
                const nftElement = document.createElement('div');
                nftElement.className = 'nft-item';
                
                const isActive = this.activeBattleNft && this.activeBattleNft.name === nft.name;
                
                nftElement.innerHTML = `
                    <img src="${nft.img}" alt="${nft.name}">
                    <h4>${nft.name}</h4>
                    <div class="price">${nft.wonInBattle ? 'Выигран в битве' : `Куплен за ${nft.buyPrice} ⭐`}</div>
                    <div class="nft-actions">
                        <button class="btn-small btn-battle ${isActive ? 'active' : ''}" onclick="game.setToBattle(${index})">
                            <i class="fas fa-fist-raised"></i>
                            ${isActive ? 'В бою' : 'В бой'}
                        </button>
                        ${!nft.wonInBattle ? `
                            <button class="btn-small btn-sell" onclick="game.sellNft(${index})">
                                <i class="fas fa-dollar-sign"></i>
                                ${Math.floor(nft.buyPrice * 0.8)}⭐
                            </button>
                        ` : ''}
                    </div>
                `;
                
                collectionItems.appendChild(nftElement);
            });
        }
    }
    
    // Рендер магазина
    renderShop() {
        const shopItems = document.getElementById('shop-items');
        if (!shopItems) return;
        
        shopItems.innerHTML = '';
        
        this.nftTemplates.forEach((template, index) => {
            const price = this.nftPrices[index];
            const nftElement = document.createElement('div');
            nftElement.className = 'nft-item';
            
            nftElement.innerHTML = `
                <img src="${template.img}" alt="${template.name}">
                <h4>${template.name}</h4>
                <div class="price">${price} ⭐</div>
                <div class="nft-actions">
                    <button class="btn-small btn-buy" onclick="game.buyNft(${index}, ${price})">
                        <i class="fas fa-shopping-bag"></i>
                        Купить
                    </button>
                </div>
            `;
            
            shopItems.appendChild(nftElement);
        });
    }
    
    // Покупка NFT
    async buyNft(templateIndex, price) {
        if (this.stars < price) {
            this.showNotification('Недостаточно звёзд!', 'error');
            return;
        }
        
        // Списываем звёзды
        this.stars -= price;
        
        // Добавляем NFT в коллекцию
        const nft = {
            ...this.nftTemplates[templateIndex],
            buyPrice: price,
            buyDate: new Date().toISOString()
        };
        
        this.collection.push(nft);
        
        // Обновляем интерфейс
        this.updateStarsDisplay();
        this.saveGameData();
        
        this.showNotification(`Куплен ${nft.name}!`, 'success');
        
        // Возвращаемся к коллекции
        await this.backToCollection();
    }
    
    // Продажа NFT
    sellNft(index) {
        const nft = this.collection[index];
        
        if (nft.wonInBattle) {
            this.showNotification('Выигранные NFT нельзя продать!', 'error');
            return;
        }
        
        const sellPrice = Math.floor(nft.buyPrice * 0.8);
        
        // Убираем из активного NFT, если продаём его
        if (this.activeBattleNft && this.activeBattleNft.name === nft.name) {
            this.activeBattleNft = null;
        }
        
        // Возвращаем звёзды
        this.stars += sellPrice;
        
        // Удаляем из коллекции
        this.collection.splice(index, 1);
        
        // Обновляем интерфейс
        this.updateStarsDisplay();
        this.renderCollection();
        this.renderCenterArea();
        this.saveGameData();
        
        this.showNotification(`Продано за ${sellPrice} ⭐!`, 'success');
    }
    
    // Установка NFT для битвы
    setToBattle(index) {
        const nft = this.collection[index];
        
        if (this.activeBattleNft && this.activeBattleNft.name === nft.name) {
            // Убираем из битвы
            this.activeBattleNft = null;
            this.showNotification(`${nft.name} убран из битвы`, 'info');
        } else {
            // Ставим в битву
            this.activeBattleNft = nft;
            this.showNotification(`${nft.name} готов к битве!`, 'success');
        }
        
        // Обновляем интерфейс
        this.renderCollection();
        this.renderCenterArea();
        this.saveGameData();
    }
    
    // Пропуск битвы
    async skipBattle() {
        if (battleSystem) {
            await battleSystem.skipBattle();
        }
    }
}

// Глобальные функции для HTML
function buyStars() {
    if (game) game.buyStars();
}

function startBattle() {
    if (game) game.startBattle();
}

function openCollection() {
    if (game) game.openCollection();
}

function openShop() {
    if (game) game.openShop();
}

function backToCollection() {
    if (game) game.backToCollection();
}

function backToMenu() {
    if (game) game.backToMenu();
}

function skipBattle() {
    if (game) game.skipBattle();
}

// Глобальный экземпляр игры
let game;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    game = new NFTGame();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NFTGame;
}