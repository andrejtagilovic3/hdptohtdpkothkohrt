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
        if (!playerNft || !enemyNft) {
            console.error('❌ Отсутствуют данные NFT для инициализации битвы!');
            return false;
        }

        console.log('🚀 Инициализация битвы:', playerNft.name, 'vs', enemyNft.name);

        this.playerNft = { ...playerNft };
        this.enemyNft = { ...enemyNft };
        this.playerHP = 100;
        this.enemyHP = 100;
        this.playerMaxHP = 100;
        this.enemyMaxHP = 100;
        this.battleActive = true;
        this.currentTurn = 'player';
        this.battleLog = [];
        this.playerDodging = false;

        this.updateStaticUI();
        this.updateDisplay();
        this.showPlayerActions();
        this.addBattleLog(`Битва началась! ${playerNft.name} против ${enemyNft.name}`);
        this.bindActionButtons();

        return true;
    }

    updateStaticUI() {
        document.getElementById('player-battle-img').src = this.playerNft.img;
        document.getElementById('player-battle-name').textContent = this.playerNft.name;
        document.getElementById('enemy-battle-img').src = this.enemyNft.img;
        document.getElementById('enemy-battle-name').textContent = this.enemyNft.name;
    }

    updateDisplay() {
        const playerHpPercent = (this.playerHP / this.playerMaxHP) * 100;
        const enemyHpPercent = (this.enemyHP / this.enemyMaxHP) * 100;

        const playerHpBar = document.getElementById('player-hp-bar');
        const enemyHpBar = document.getElementById('enemy-hp-bar');

        if (playerHpBar) {
            playerHpBar.style.width = `${Math.max(0, playerHpPercent)}%`;
            playerHpBar.style.backgroundColor = playerHpPercent > 50 ? '#4caf50' : playerHpPercent > 20 ? '#ff9800' : '#f44336';
        }
        if (enemyHpBar) {
            enemyHpBar.style.width = `${Math.max(0, enemyHpPercent)}%`;
            enemyHpBar.style.backgroundColor = enemyHpPercent > 50 ? '#4caf50' : enemyHpPercent > 20 ? '#ff9800' : '#f44336';
        }
    }

    addBattleLog(message) {
        const log = document.getElementById('battle-log');
        if (log) {
            log.innerHTML += `<div>${message}</div>`;
            log.scrollTop = log.scrollHeight;
        }
    }

    bindActionButtons() {
        const actionsArea = document.getElementById('battle-buttons-area');
        actionsArea.innerHTML = `
            <button class="battle-btn attack-btn" onclick="battleSystem.playerAction('attack')">Атака</button>
            <button class="battle-btn dodge-btn" onclick="battleSystem.playerAction('dodge')">Уклонение</button>
        `;
    }

    playerAction(action) {
        if (!this.battleActive || this.currentTurn !== 'player') return;

        switch (action) {
            case 'attack':
                this.playerAttack();
                break;
            case 'dodge':
                this.playerDodge();
                break;
        }

        setTimeout(() => {
            if (this.battleActive && this.currentTurn === 'enemy') {
                this.enemyAction();
            }
        }, 1500);
    }

    playerAttack() {
        const baseDamage = 10;
        const critChance = this.playerNft.stats.critChance;
        const isCritical = Math.random() < critChance;
        const damage = isCritical ? baseDamage * 2 : baseDamage;

        this.enemyHP -= damage;
        this.addBattleLog(`Вы атакуете врага! Нанесено ${damage} урона.`);
        if (isCritical) {
            this.addBattleLog('Критический удар!');
        }
        
        window.animateHitEffect(document.getElementById('enemy-battle-img'), isCritical);
        window.animateHPChange('enemy-hp-bar', this.enemyHP, this.enemyMaxHP);

        this.updateDisplay();

        if (this.enemyHP <= 0) {
            this.addBattleLog('Вы победили!');
            setTimeout(() => this.endBattle(true), 1500);
        } else {
            this.currentTurn = 'enemy';
        }
    }

    playerDodge() {
        this.playerDodging = true;
        this.addBattleLog('Вы приготовились уклоняться...');
        this.currentTurn = 'enemy';
    }

    enemyAction() {
        if (!this.battleActive) return;

        const baseDamage = 8;
        let damage = baseDamage;

        if (this.playerDodging) {
            if (Math.random() < 0.5) {
                this.addBattleLog('Вы успешно уклонились от атаки!');
                damage = 0;
            } else {
                this.addBattleLog('Вам не удалось уклониться!');
            }
        }

        this.playerHP -= damage;
        this.addBattleLog(`Враг атакует! Получено ${damage} урона.`);
        window.animateHitEffect(document.getElementById('player-battle-img'));
        window.animateHPChange('player-hp-bar', this.playerHP, this.playerMaxHP);

        this.playerDodging = false;
        this.updateDisplay();

        if (this.playerHP <= 0) {
            this.addBattleLog('Вы проиграли...');
            setTimeout(() => this.endBattle(false), 1500);
        } else {
            this.currentTurn = 'player';
            this.addBattleLog('Ваш ход!');
        }
    }

    endBattle(playerWon) {
        console.log('🏁 Битва завершена');
        this.battleActive = false;

        if (window.playerData) {
            const starsGained = playerWon ? Math.floor(Math.random() * 50) + 10 : 0;
            if (playerWon) {
                window.playerData.stars += starsGained;
                this.addBattleLog(`Вы получили ${starsGained} звёзд!`);
            }
            window.playerData.battleHistory.push({
                playerNft: { ...this.playerNft },
                opponentNft: { ...this.enemyNft },
                won: playerWon,
                starsGained: starsGained,
                timestamp: new Date().toISOString()
            });
        }

        if (window.updateUI) window.updateUI();
        if (window.saveData) setTimeout(() => window.saveData(), 500);

        // Возвращаемся на главный экран
        setTimeout(() => window.showScreen('main-screen'), 2000);
    }

    attemptEscape() {
        if (window.playerData.stars < 50) {
            this.addBattleLog('Недостаточно звёзд для побега! (нужно 50)');
            return;
        }

        window.playerData.stars -= 50;
        this.addBattleLog('Вы сбежали из боя! Потеряно 50 звёзд.');

        if (window.updateUI) window.updateUI();
        if (window.saveData) window.saveData();

        setTimeout(() => this.endBattle(), 1500);
    }
}

// Создаем глобальный экземпляр
window.battleSystem = new UndertaleBattle();

// Проверки загрузки
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Undertale Battle System загружен!');
});
