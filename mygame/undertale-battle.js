// ==================== UNDERTALE BATTLE SYSTEM (ОБНОВЛЁННАЯ HP СИСТЕМА) ====================

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
        
        this.createBattleUI();
        this.updateDisplay();
        this.showPlayerActions();
        this.addBattleLog(`Битва началась! ${playerNft.name} против ${enemyNft.name}`);
        
        return true;
    }

    createBattleUI() {
        // Удаляем старый интерфейс если есть
        const existing = document.getElementById('undertale-battle-container');
        if (existing) existing.remove();

        const battleHTML = `
            <div id="undertale-battle-container" class="undertale-battle-container">
                <div class="enemy-battle-area">
                    <button class="escape-btn" onclick="battleSystem.attemptEscape()">
                        Сбежать (50⭐)
                    </button>

                    <img id="enemy-battle-img" class="enemy-battle-img" alt="Enemy NFT">
                    <div id="enemy-name" class="enemy-name">ВРАГ</div>

                    <div class="battle-hp-container enemy-hp-container">
                        <div id="enemy-hp-bar" class="battle-hp-bar" style="width: 100%;"></div>
                    </div>
                    <div id="enemy-hp-text" class="battle-hp-text">100/100 HP</div>
                </div>

                <div class="battle-bottom-area">
                    <div id="battle-log-container" class="battle-log-container"></div>

                    <div class="battle-actions-area">
                        <div class="battle-buttons">
                            <button id="attack-btn" class="battle-action-btn" onclick="battleSystem.playerAttack()">
                                <i class="fas fa-sword"></i>
                                АТАКА
                            </button>
                            <button id="dodge-btn" class="battle-action-btn" onclick="battleSystem.playerDodge()">
                                <i class="fas fa-running"></i>
                                УВЕРНУТЬСЯ
                            </button>
                        </div>

                        <div class="player-battle-area">
                            <img id="player-battle-img" class="player-battle-img" alt="Player NFT">
                            <div>
                                <div class="player-name">ВЫ</div>
                                <div id="player-nft-name" class="player-nft-name">NFT NAME</div>
                                <div class="battle-hp-container player-hp-container">
                                    <div id="player-hp-bar" class="battle-hp-bar" style="width: 100%;"></div>
                                </div>
                            </div>
                            <div id="player-hp-text" class="player-hp-text">100/100 HP</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', battleHTML);

        // Устанавливаем изображения
        document.getElementById('enemy-battle-img').src = this.enemyNft.img;
        document.getElementById('player-battle-img').src = this.playerNft.img;
        document.getElementById('player-nft-name').textContent = this.playerNft.name;
        document.getElementById('enemy-name').textContent = this.enemyNft.name;
    }

    showPlayerActions() {
        document.getElementById('attack-btn').disabled = false;
        document.getElementById('dodge-btn').disabled = false;
    }

    addBattleLog(message) {
        this.battleLog.push(message);
        const logContainer = document.getElementById('battle-log-container');
        logContainer.innerHTML = this.battleLog.slice(-5).join('<br>');
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    updateDisplay() {
        this.updateHPBar('player-hp-bar', this.playerHP, this.playerMaxHP);
        this.updateHPBar('enemy-hp-bar', this.enemyHP, this.enemyMaxHP);
        document.getElementById('player-hp-text').textContent = `${Math.max(0, this.playerHP)}/${this.playerMaxHP} HP`;
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, this.enemyHP)}/${this.enemyMaxHP} HP`;
    }

    updateHPBar(barId, currentHP, maxHP) {
        const bar = document.getElementById(barId);
        if (!bar) {
            console.error(`❌ HP бар ${barId} не найден`);
            return false;
        }

        const percent = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
        console.log(`🔧 Обновление ${barId}: ${currentHP}/${maxHP} = ${percent.toFixed(1)}%`);

        bar.style.width = percent + '%';
        if (currentHP <= 25) {
            bar.classList.add('critical');
        } else {
            bar.classList.remove('critical');
        }

        bar.offsetWidth; // Принудительный reflow

        return true;
    }

    checkWinCondition() {
        if (this.playerHP <= 0) {
            this.endBattle(false);
        } else if (this.enemyHP <= 0) {
            this.endBattle(true);
        }
    }

    playerAttack() {
        if (!this.battleActive || this.currentTurn !== 'player') return;

        const damage = Math.floor(Math.random() * 35) + 8; // Базовый урон 8-42
        this.enemyHP = Math.max(0, this.enemyHP - damage);
        this.addBattleLog(`Игрок атакует! Урон: ${damage}`);
        console.log(`Игрок нанёс урон: ${damage}, enemyHP: ${this.enemyHP}`);

        this.updateDisplay();
        this.currentTurn = 'enemy';
        document.getElementById('attack-btn').disabled = true;
        document.getElementById('dodge-btn').disabled = true;

        setTimeout(() => this.enemyTurn(), 1500);
    }

    playerDodge() {
        if (!this.battleActive || this.currentTurn !== 'player') return;

        this.playerDodging = true;
        this.addBattleLog('Игрок пытается увернуться!');
        console.log('Игрок активировал уклонение');

        this.updateDisplay();
        this.currentTurn = 'enemy';
        document.getElementById('attack-btn').disabled = true;
        document.getElementById('dodge-btn').disabled = true;

        setTimeout(() => this.enemyTurn(), 1500);
    }

    enemyTurn() {
        if (!this.battleActive || this.currentTurn !== 'enemy') return;

        console.log('=== Начало enemyTurn ===');
        console.log('Текущее playerHP перед расчётом:', this.playerHP);
        console.log('playerDodging:', this.playerDodging);

        let damage = Math.floor(Math.random() * 21) + 20; // Урон 20-40
        console.log('Расчитанный damage:', damage);

        if (this.playerDodging) {
            const missChance = Math.random();
            console.log('missChance:', missChance);
            if (missChance < 0.5) {
                damage = 0;
                this.addBattleLog('Игрок увернулся! Урон: 0');
                console.log('Увернулся! damage сброшен на 0');
            } else {
                this.addBattleLog('Увернуться не удалось!');
            }
            this.playerDodging = false;
        }

        console.log('Финальный damage перед применением:', damage);
        console.log('Before subtract: playerHP =', this.playerHP);
        this.playerHP = Math.max(0, this.playerHP - damage);
        console.log('After subtract: playerHP =', this.playerHP);

        this.addBattleLog(`Враг атакует! Урон: ${damage}`);

        this.updateDisplay();
        this.checkWinCondition();

        this.currentTurn = 'player';
        this.showPlayerActions();

        console.log('=== Конец enemyTurn ===');
    }

    endBattle(playerWon) {
        console.log('🎮 Завершение битвы, победа:', playerWon);
        this.battleActive = false;

        const resultOverlay = document.createElement('div');
        resultOverlay.id = 'battle-result-overlay';
        resultOverlay.className = 'battle-result-overlay';
        resultOverlay.innerHTML = `
            <div class="battle-result-modal">
                <div class="battle-result-text">${playerWon ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ!'}</div>
                <button class="result-back-btn" onclick="battleSystem.endBattleCleanup()">Вернуться</button>
            </div>
        `;
        document.body.appendChild(resultOverlay);

        // Удаляем NFT из коллекции при проигрыше
        if (!playerWon && window.collection) {
            const index = window.collection.findIndex(
                nft => nft.name === this.playerNft.name && 
                       nft.img === this.playerNft.img && 
                       nft.buyPrice === this.playerNft.buyPrice
            );
            if (index !== -1) {
                window.collection.splice(index, 1);
                console.log('❌ NFT удален из коллекции:', this.playerNft.name);
                if (window.activeBattleNft) {
                    window.activeBattleNft = null;
                }
            } else {
                console.error('❌ NFT не найден в коллекции для удаления');
            }
        }

        if (window.battleHistory && Array.isArray(window.battleHistory)) {
            window.battleHistory.push({
                playerNft: {...this.playerNft},
                opponentNft: {...this.enemyNft},
                won: playerWon,
                timestamp: new Date().toISOString()
            });
        }

        if (window.updateUI) {
            window.updateUI();
        }
        if (window.saveData) {
            setTimeout(() => {
                window.saveData();
                console.log('💾 Данные сохранены');
            }, 500);
        }
    }

    endBattleCleanup() {
        const container = document.getElementById('undertale-battle-container');
        if (container) container.remove();
        const overlay = document.getElementById('battle-result-overlay');
        if (overlay) overlay.remove();

        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) mainScreen.classList.add('active');

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[0]) navItems[0].classList.add('active');

        if (window.renderCenterArea) window.renderCenterArea();
        if (window.updateUI) window.updateUI();
    }

    attemptEscape() {
        if (window.stars < 50) {
            this.addBattleLog('Недостаточно звёзд для побега! (нужно 50)');
            return;
        }

        window.stars -= 50;
        this.addBattleLog('Вы сбежали из боя! Потеряно 50 звёзд.');
        
        if (window.updateUI) window.updateUI();
        if (window.saveData) window.saveData();
        
        setTimeout(() => this.endBattleCleanup(), 1500);
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

// Проверки загрузки
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Undertale Battle System загружен!');
});

setTimeout(() => {
    if (typeof window.startUndertaleBattle === 'function' && window.battleSystem) {
        console.log('🟢 ✅ Battle System готов!');
    } else {
        console.error('🔴 ❌ Ошибка загрузки Battle System!');
    }
}, 1000);
