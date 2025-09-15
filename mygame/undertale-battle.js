// ==================== UNDERTALE BATTLE SYSTEM (ИСПРАВЛЕННАЯ ВЕРСИЯ) ====================

class UndertaleBattle {
    constructor() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.playerMaxHP = 100;
        this.enemyMaxHP = 100;
        this.currentTurn = 'player';
        this.battleActive = false;
        this.playerNft = null;
        this.enemyNft = null;
        this.battleLog = [];
        this.playerDodging = false;
    }

    init(playerNft, enemyNft) {
        console.log('🚀 Инициализация битвы:', playerNft.name, 'vs', enemyNft.name);
        
        this.playerNft = {...playerNft};
        this.enemyNft = {...enemyNft};
        this.playerHP = 100;
        this.enemyHP = 100;
        this.playerMaxHP = 100;
        this.enemyMaxHP = 100;
        this.battleActive = true;
        this.currentTurn = 'player';
        this.battleLog = [];
        this.playerDodging = false;
        
        // Пересоздаем UI при каждом запуске битвы
        this.createBattleUI(); 
        this.updateDisplay();
        this.showPlayerActions();
        this.addBattleLog(`Битва началась! ${playerNft.name} против ${enemyNft.name}`);
        
        return true;
    }

    createBattleUI() {
        console.log('🏗️ Создание интерфейса битвы');
        // Очищаем старый интерфейс, если он есть
        const battleContainer = document.getElementById('battle-container');
        if (!battleContainer) {
            console.error('❌ Не найден контейнер #battle-container!');
            return;
        }
        battleContainer.innerHTML = '';

        const battleHtml = `
            <div class="battle-arena">
                <div class="battle-participants">
                    <div class="participant left">
                        <img id="player-img" class="participant-img" src="${this.playerNft.img}" alt="Player NFT">
                        <div class="participant-name">Вы</div>
                        <div class="hp-container">
                            <div id="player-hp-bar" class="hp-bar" style="width: 100%;"></div>
                        </div>
                        <div class="hp-text" id="player-hp-text">HP: ${this.playerHP}/${this.playerMaxHP}</div>
                    </div>
                    <div class="vs-text">VS</div>
                    <div class="participant right">
                        <img id="enemy-img" class="participant-img" src="${this.enemyNft.img}" alt="Enemy NFT">
                        <div class="participant-name">Противник</div>
                        <div class="hp-container">
                            <div id="enemy-hp-bar" class="hp-bar" style="width: 100%;"></div>
                        </div>
                        <div class="hp-text" id="enemy-hp-text">HP: ${this.enemyHP}/${this.enemyMaxHP}</div>
                    </div>
                </div>
            </div>

            <div class="battle-bottom-area">
                <div class="battle-log" id="battle-log">Готовьтесь к бою!</div>
                <div class="battle-actions-area" id="battle-actions">
                    </div>
            </div>
            <div id="end-battle-overlay" class="end-battle-overlay" style="display: none;">
                <div class="battle-result-container">
                    <div id="battle-result-text" class="battle-result"></div>
                    <div class="reward-info" id="reward-info" style="display: none;"></div>
                    <button id="close-battle-btn" class="battle-btn" style="background: #4caf50;">
                        Вернуться
                    </button>
                </div>
            </div>
        `;
        
        // Вставляем разметку в контейнер
        battleContainer.innerHTML = battleHtml;
        document.getElementById('close-battle-btn').onclick = () => this.endBattle();
        console.log('✅ UI битвы создан');
    }
    
    updateDisplay() {
        const playerHpBar = document.getElementById('player-hp-bar');
        const playerHpText = document.getElementById('player-hp-text');
        const enemyHpBar = document.getElementById('enemy-hp-bar');
        const enemyHpText = document.getElementById('enemy-hp-text');

        if (playerHpBar) {
            const playerHpPercent = (this.playerHP / this.playerMaxHP) * 100;
            playerHpBar.style.width = `${playerHpPercent}%`;
            playerHpBar.classList.toggle('low', playerHpPercent <= 20);
            console.log(`✅ HP игрока: ${this.playerHP}, процент: ${playerHpPercent.toFixed(2)}%, ширина: ${playerHpBar.style.width}`);
        }
        if (playerHpText) {
            playerHpText.textContent = `HP: ${this.playerHP}/${this.playerMaxHP}`;
        }

        if (enemyHpBar) {
            const enemyHpPercent = (this.enemyHP / this.enemyMaxHP) * 100;
            enemyHpBar.style.width = `${enemyHpPercent}%`;
            enemyHpBar.classList.toggle('low', enemyHpPercent <= 20);
            console.log(`✅ HP врага: ${this.enemyHP}, процент: ${enemyHpPercent.toFixed(2)}%, ширина: ${enemyHpBar.style.width}`);
        }
        if (enemyHpText) {
            enemyHpText.textContent = `HP: ${this.enemyHP}/${this.enemyMaxHP}`;
        }
    }
    
    // ... остальной код класса без изменений ...

    addBattleLog(message) {
        const logElement = document.getElementById('battle-log');
        if (logElement) {
            logElement.textContent = message;
        }
    }
    
    // ...
    
    endBattle() {
        console.log('🏁 Завершение битвы...');
        this.battleActive = false;
        
        // Удаляем интерфейс битвы
        const battleContainer = document.getElementById('battle-container');
        if (battleContainer) {
            battleContainer.innerHTML = '';
        }
        
        const battleScreen = document.getElementById('battle-screen');
        if (battleScreen) {
            battleScreen.style.display = 'none';
        }

        // Возвращаемся на главный экран
        showScreen('main-screen', document.querySelector('.nav-item.active'));

        console.log('✅ Возврат завершен');
    }
}

// Создаем глобальный экземпляр
window.battleSystem = new UndertaleBattle();

// Функция для запуска битвы
window.startUndertaleBattle = function(playerNft, enemyNft) {
    console.log('🚀 === ЗАПУСК UNDERTALE БИТВЫ ===');
    
    if (!playerNft || !enemyNft) {
        console.error('❌ Отсутствуют данные NFT!');
        alert('Ошибка: не выбран NFT для битвы!');
        return false;
    }
    
    const success = window.battleSystem.init(playerNft, enemyNft);
    console.log(success ? '✅ Битва запущена!' : '❌ Ошибка запуска!');
    return success;
};
