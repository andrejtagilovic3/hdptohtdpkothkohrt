// Система боёв с анимациями

class BattleSystem {
    constructor() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.maxHP = 100;
        this.currentRound = 1;
        this.isPlayerTurn = true;
        this.battleActive = false;
        this.battleSpeed = 1000; // мс между ходами
        this.battleLog = [];
        this.enemyNFT = null;
        
        this.initializeBattleElements();
    }
    
    initializeBattleElements() {
        // Получаем элементы DOM для битвы
        this.elements = {
            searchScreen: document.getElementById('search-screen'),
            battleScreen: document.getElementById('battle-screen'),
            resultScreen: document.getElementById('result-screen'),
            playerFighter: document.getElementById('player-fighter'),
            enemyFighter: document.getElementById('enemy-fighter'),
            playerHP: document.getElementById('player-hp'),
            enemyHP: document.getElementById('enemy-hp'),
            playerHPText: document.getElementById('player-hp-text'),
            enemyHPText: document.getElementById('enemy-hp-text'),
            playerNFT: document.getElementById('player-nft'),
            enemyNFT: document.getElementById('enemy-nft'),
            playerName: document.getElementById('player-name'),
            enemyName: document.getElementById('enemy-name'),
            battleRound: document.getElementById('battle-round'),
            battleLog: document.getElementById('battle-log'),
            resultTitle: document.getElementById('result-title'),
            resultAnimation: document.getElementById('result-animation'),
            rewardNFT: document.getElementById('reward-nft'),
            rewardName: document.getElementById('reward-name')
        };
    }
    
    // Начало битвы
    async startBattle(playerNFT) {
        if (!playerNFT) {
            alert('Выбери NFT для битвы!');
            return;
        }
        
        // Показываем экран поиска
        await animationManager.transitionToScreen(
            document.getElementById('main-menu'),
            this.elements.searchScreen
        );
        
        // Симулируем поиск противника (2 секунды)
        await this.simulateSearch();
        
        // Генерируем противника
        this.generateEnemy();
        
        // Переходим к битве
        await this.initializeBattle(playerNFT);
        
        // Запускаем битву
        await this.runBattle();
    }
    
    // Симуляция поиска противника
    async simulateSearch() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }
    
    // Генерация случайного противника
    generateEnemy() {
        const enemies = [
            { name: 'Календарь Бота', img: 'assets/nft/calendar.gif' },
            { name: 'Doge Воин', img: 'assets/nft/doge.gif' },
            { name: 'Pepe Мастер', img: 'assets/nft/pepe.gif' },
            { name: 'Мистик NFT', img: 'assets/nft/other.gif' }
        ];
        
        this.enemyNFT = enemies[Math.floor(Math.random() * enemies.length)];
    }
    
    // Инициализация битвы
    async initializeBattle(playerNFT) {
        // Переходим на экран битвы
        await animationManager.transitionToScreen(
            this.elements.searchScreen,
            this.elements.battleScreen
        );
        
        // Сбрасываем состояние
        this.playerHP = this.maxHP;
        this.enemyHP = this.maxHP;
        this.currentRound = 1;
        this.isPlayerTurn = Math.random() < 0.5; // Случайно кто начинает
        this.battleActive = true;
        this.battleLog = [];
        
        // Устанавливаем данные бойцов
        this.elements.playerNFT.src = playerNFT.img;
        this.elements.playerNFT.alt = playerNFT.name;
        this.elements.playerName.textContent = playerNFT.name;
        
        this.elements.enemyNFT.src = this.enemyNFT.img;
        this.elements.enemyNFT.alt = this.enemyNFT.name;
        this.elements.enemyName.textContent = this.enemyNFT.name;
        
        // Обновляем HP бары
        this.updateHPBars();
        
        // Обновляем раунд
        this.elements.battleRound.textContent = this.currentRound;
        
        // Очищаем лог
        this.elements.battleLog.innerHTML = '<p>Битва началась!</p>';
        
        // Анимация появления бойцов
        await animationManager.animateFightersEntry(
            this.elements.playerFighter,
            this.elements.enemyFighter
        );
        
        // Добавляем лог о том, кто начинает
        this.addToBattleLog(
            `${this.isPlayerTurn ? 'Ты' : this.enemyNFT.name} ${this.isPlayerTurn ? 'начинаешь' : 'начинает'} первым!`
        );
    }
    
    // Основной цикл битвы
    async runBattle() {
        while (this.battleActive && this.playerHP > 0 && this.enemyHP > 0) {
            await this.processTurn();
            await this.sleep(this.battleSpeed);
        }
        
        // Определяем победителя
        await this.endBattle();
    }
    
    // Обработка хода
    async processTurn() {
        const damage = this.calculateDamage();
        const attacker = this.isPlayerTurn ? 'player' : 'enemy';
        const target = this.isPlayerTurn ? 'enemy' : 'player';
        
        // Выполняем атаку
        await this.executeAttack(attacker, target, damage);
        
        // Переключаем ход
        this.isPlayerTurn = !this.isPlayerTurn;
        
        // Увеличиваем раунд, если прошёл полный цикл
        if (this.isPlayerTurn) {
            this.currentRound++;
            this.elements.battleRound.textContent = this.currentRound;
        }
    }
    
    // Расчёт урона
    calculateDamage() {
        const baseDamage = 10;
        const randomDamage = Math.floor(Math.random() * 51); // 0-50
        const totalDamage = baseDamage + randomDamage;
        
        // Шанс критического удара (15%)
        const isCritical = Math.random() < 0.15;
        return isCritical ? Math.floor(totalDamage * 1.5) : totalDamage;
    }
    
    // Выполнение атаки
    async executeAttack(attacker, target, damage) {
        const attackerElement = attacker === 'player' ? this.elements.playerFighter : this.elements.enemyFighter;
        const targetElement = target === 'player' ? this.elements.playerFighter : this.elements.enemyFighter;
        const attackerName = attacker === 'player' ? 'Ты' : this.enemyNFT.name;
        const targetName = target === 'player' ? 'тебя' : this.enemyNFT.name;
        
        // Анимация атаки
        await animationManager.animateAttack(attackerElement, targetElement, damage);
        
        // Обновляем HP
        if (target === 'player') {
            this.playerHP = Math.max(0, this.playerHP - damage);
        } else {
            this.enemyHP = Math.max(0, this.enemyHP - damage);
        }
        
        // Обновляем HP бары
        this.updateHPBars();
        
        // Добавляем в лог
        const isCritical = damage > 50;
        const logClass = isCritical ? 'critical' : 'damage';
        const criticalText = isCritical ? ' (Критический удар!)' : '';
        
        this.addToBattleLog(
            `${attackerName} атакует ${targetName} на ${damage} урона${criticalText}`,
            logClass
        );
        
        // Проверяем смерть
        if (target === 'player' && this.playerHP <= 0) {
            await animationManager.animateDeath(this.elements.playerFighter);
            this.addToBattleLog('Ты проиграл...', 'damage');
            this.battleActive = false;
        } else if (target === 'enemy' && this.enemyHP <= 0) {
            await animationManager.animateDeath(this.elements.enemyFighter);
            this.addToBattleLog(`${this.enemyNFT.name} повержен!`, 'critical');
            this.battleActive = false;
            await animationManager.animateVictory(this.elements.playerFighter);
        }
    }
    
    // Обновление HP баров
    updateHPBars() {
        animationManager.animateHPChange(
            this.elements.playerHP,
            this.elements.playerHPText,
            this.playerHP,
            this.maxHP
        );
        
        animationManager.animateHPChange(
            this.elements.enemyHP,
            this.elements.enemyHPText,
            this.enemyHP,
            this.maxHP
        );
    }
    
    // Добавление записи в лог битвы
    addToBattleLog(message, className = '') {
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        if (className) {
            logEntry.className = className;
        }
        
        this.elements.battleLog.appendChild(logEntry);
        
        // Прокручиваем вниз
        this.elements.battleLog.scrollTop = this.elements.battleLog.scrollHeight;
        
        // Ограничиваем количество записей
        const entries = this.elements.battleLog.children;
        if (entries.length > 10) {
            this.elements.battleLog.removeChild(entries[0]);
        }
    }
    
    // Завершение битвы
    async endBattle() {
        const playerWon = this.playerHP > 0;
        
        // Ждём немного перед показом результата
        await this.sleep(1000);
        
        // Переходим к экрану результата
        await animationManager.transitionToScreen(
            this.elements.battleScreen,
            this.elements.resultScreen
        );
        
        // Настраиваем экран результата
        if (playerWon) {
            this.elements.resultTitle.textContent = 'Победа!';
            this.elements.resultTitle.className = 'victory';
            this.elements.resultAnimation.innerHTML = '<i class="fas fa-trophy"></i>';
            this.elements.resultAnimation.className = 'result-animation';
            
            // Показываем выигранный NFT
            this.elements.rewardNFT.src = this.enemyNFT.img;
            this.elements.rewardName.textContent = this.enemyNFT.name;
            
            // Анимация награды
            await animationManager.animateReward(this.elements.rewardNFT);
            
            // Добавляем NFT в коллекцию
            this.addNFTToCollection(this.enemyNFT);
            
        } else {
            this.elements.resultTitle.textContent = 'Поражение...';
            this.elements.resultTitle.className = 'defeat';
            this.elements.resultAnimation.innerHTML = '<i class="fas fa-skull"></i>';
            this.elements.resultAnimation.className = 'result-animation defeat';
            
            // Скрываем информацию о награде
            document.querySelector('.reward-info').style.display = 'none';
        }
    }
    
    // Добавление NFT в коллекцию
    addNFTToCollection(nft) {
        let collection = JSON.parse(localStorage.getItem('collection')) || [];
        
        // Добавляем NFT с информацией о том, что он был выигран
        const wonNFT = {
            ...nft,
            buyPrice: 0, // Выигранный NFT
            wonInBattle: true,
            wonDate: new Date().toISOString()
        };
        
        collection.push(wonNFT);
        localStorage.setItem('collection', JSON.stringify(collection));
    }
    
    // Пропуск битвы (быстрое завершение)
    async skipBattle() {
        if (!this.battleActive) return;
        
        this.battleActive = false;
        
        // Быстро определяем победителя
        const playerWins = Math.random() < 0.6; // 60% шанс победы игрока
        
        if (playerWins) {
            this.playerHP = Math.floor(Math.random() * 50) + 1; // 1-50 HP остаётся
            this.enemyHP = 0;
        } else {
            this.enemyHP = Math.floor(Math.random() * 50) + 1;
            this.playerHP = 0;
        }
        
        this.updateHPBars();
        await this.endBattle();
    }
    
    // Вспомогательная функция задержки
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Сброс системы битвы
    reset() {
        this.battleActive = false;
        this.playerHP = this.maxHP;
        this.enemyHP = this.maxHP;
        this.currentRound = 1;
        this.isPlayerTurn = true;
        this.battleLog = [];
        this.enemyNFT = null;
    }
}

// Глобальный экземпляр системы боёв
let battleSystem;

document.addEventListener('DOMContentLoaded', () => {
    battleSystem = new BattleSystem();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleSystem;
}