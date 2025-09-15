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

        // Вместо создания UI, просто обновляем существующий
        this.updateStaticUI();
        this.updateDisplay();
        this.showPlayerActions();
        this.addBattleLog(`Битва началась! ${playerNft.name} против ${enemyNft.name}`);

        return true;
    }

    updateStaticUI() {
        const playerImg = document.getElementById('player-battle-img');
        const enemyImg = document.getElementById('enemy-battle-img');
        const enemyName = document.getElementById('enemy-name');
        const playerNftName = document.getElementById('player-nft-name');
        
        if (playerImg && this.playerNft) playerImg.src = this.playerNft.img;
        if (enemyImg && this.enemyNft) enemyImg.src = this.enemyNft.img;
        if (enemyName && this.enemyNft) enemyName.textContent = this.enemyNft.name.toUpperCase();
        if (playerNftName && this.playerNft) playerNftName.textContent = this.playerNft.name;
    }

    updateDisplay() {
        console.log('🔄 Обновление отображения. Игрок HP:', this.playerHP, 'Враг HP:', this.enemyHP);

        const playerHPPercent = Math.max(0, Math.min(100, (this.playerHP / this.playerMaxHP) * 100));
        const enemyHPPercent = Math.max(0, Math.min(100, (this.enemyHP / this.enemyMaxHP) * 100));

        const playerHPBar = document.getElementById('player-hp-bar');
        const enemyHPBar = document.getElementById('enemy-hp-bar');
        const playerHPText = document.getElementById('player-hp-text');
        const enemyHPText = document.getElementById('enemy-hp-text');
        const resultOverlay = document.getElementById('battle-result-overlay');

        if (playerHPBar) {
            playerHPBar.style.width = `${playerHPPercent}%`;
            playerHPBar.classList.toggle('critical', this.playerHP <= 25);
        }
        if (enemyHPBar) {
            enemyHPBar.style.width = `${enemyHPPercent}%`;
            enemyHPBar.classList.toggle('critical', this.enemyHP <= 25);
        }
        if (playerHPText) {
            playerHPText.textContent = `${Math.round(this.playerHP)}/${this.playerMaxHP} HP`;
        }
        if (enemyHPText) {
            enemyHPText.textContent = `${Math.round(this.enemyHP)}/${this.enemyMaxHP} HP`;
        }
        if (resultOverlay) {
            resultOverlay.style.display = this.battleActive ? 'none' : 'flex';
        }

        console.log('📊 HP проценты - Игрок:', playerHPPercent + '%', 'Враг:', enemyHPPercent + '%');
    }

    addBattleLog(message) {
        const logContainer = document.getElementById('battle-log-container');
        if (!logContainer) return;

        this.battleLog.push(message);
        const recentLogs = this.battleLog.slice(-5);
        logContainer.innerHTML = recentLogs
            .map(log => `<div style="margin-bottom: 4px; padding: 2px 0;">• ${log}</div>`)
            .join('');

        logContainer.scrollTop = logContainer.scrollHeight;
    }

    showPlayerActions() {
        const attackBtn = document.getElementById('attack-btn');
        const dodgeBtn = document.getElementById('dodge-btn');

        if (!attackBtn || !dodgeBtn) return;

        const isPlayerTurn = this.currentTurn === 'player' && this.battleActive;
        attackBtn.disabled = !isPlayerTurn;
        dodgeBtn.disabled = !isPlayerTurn;
    }

    playerAttack() {
        if (this.currentTurn !== 'player' || !this.battleActive) return;

        this.currentTurn = 'enemy';
        this.showPlayerActions();
        this.addBattleLog('Вы атакуете!');
        
        let damage = Math.floor(Math.random() * 25) + 15;
        let isCrit = Math.random() < 0.15;
        const enemyDodge = Math.random() < 0.08;

        if (this.playerNft.upgrades) {
            if (this.playerNft.upgrades.damage) damage *= this.playerNft.upgrades.damage;
            if (this.playerNft.upgrades.crit) if (Math.random() < (0.15 * this.playerNft.upgrades.crit)) isCrit = true;
        }

        if (enemyDodge) {
            this.addBattleLog('Враг уклонился от атаки!');
            this.showDamageEffect(document.getElementById('enemy-battle-img'), 'МИМО', false);
        } else {
            if (isCrit) {
                damage *= 1.8;
                this.addBattleLog(`💥 КРИТИЧЕСКИЙ УДАР! Нанесено ${Math.round(damage)} урона!`);
                this.showDamageEffect(document.getElementById('enemy-battle-img'), Math.round(damage), true);
            } else {
                this.addBattleLog(`Нанесено ${Math.round(damage)} урона`);
                this.showDamageEffect(document.getElementById('enemy-battle-img'), Math.round(damage), false);
            }
            this.enemyHP -= damage;
            this.enemyHP = Math.max(0, this.enemyHP);
            this.shakeElement('enemy-battle-img');
        }

        this.updateDisplay();
        this.checkBattleEnd();

        if (this.battleActive) {
            setTimeout(() => this.enemyTurn(), 2000);
        }
    }

    playerDodge() {
        if (this.currentTurn !== 'player' || !this.battleActive) return;
        
        this.addBattleLog('Вы готовитесь увернуться!');
        this.playerDodging = true;
        
        this.currentTurn = 'enemy';
        this.showPlayerActions();

        setTimeout(() => this.enemyTurn(), 1500);
    }

    enemyTurn() {
        if (this.currentTurn !== 'enemy' || !this.battleActive) return;

        this.addBattleLog('Враг атакует!');
        let damage = Math.floor(Math.random() * 22) + 12;
        const isCrit = Math.random() < 0.12;
        let playerDodgeChance = 0.06;

        if (this.playerNft.upgrades && this.playerNft.upgrades.dodge) playerDodgeChance *= this.playerNft.upgrades.dodge;
        if (this.playerDodging) playerDodgeChance += 0.35;

        const playerDodged = Math.random() < playerDodgeChance;

        if (playerDodged) {
            this.addBattleLog('Вы уклонились от атаки!');
            this.showDamageEffect(document.getElementById('player-battle-img'), 'МИМО', false);
        } else {
            if (isCrit) {
                damage *= 1.7;
                this.addBattleLog(`💥 КРИТИЧЕСКАЯ АТАКА ВРАГА! Получено ${Math.round(damage)} урона!`);
                this.showDamageEffect(document.getElementById('player-battle-img'), Math.round(damage), true);
            } else {
                this.addBattleLog(`Получено ${Math.round(damage)} урона`);
                this.showDamageEffect(document.getElementById('player-battle-img'), Math.round(damage), false);
            }
            this.playerHP -= damage;
            this.playerHP = Math.max(0, this.playerHP);
            this.shakeElement('player-battle-img');
        }

        this.playerDodging = false;
        this.updateDisplay();
        this.checkBattleEnd();

        if (this.battleActive) {
            this.currentTurn = 'player';
            setTimeout(() => {
                this.showPlayerActions();
                this.addBattleLog('Ваш ход!');
            }, 1800);
        }
    }
    
    shakeElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('battle-shake');
            setTimeout(() => {
                element.classList.remove('battle-shake');
            }, 500);
        }
    }

    showDamageEffect(targetElement, damage, isCrit = false) {
        if (!targetElement) return;
        const effect = document.createElement('div');
        effect.className = `damage-effect ${isCrit ? 'crit' : ''}`;
        effect.textContent = damage;
        targetElement.appendChild(effect);
        setTimeout(() => {
            if (effect.parentNode) effect.parentNode.removeChild(effect);
        }, 1200);
    }

    checkBattleEnd() {
        if (this.playerHP <= 0) {
            this.battleActive = false;
            this.showBattleResult(false);
        } else if (this.enemyHP <= 0) {
            this.battleActive = false;
            this.showBattleResult(true);
        }
    }

    showBattleResult(playerWon) {
        const resultOverlay = document.getElementById('battle-result-overlay');
        const resultTitle = document.getElementById('result-title');
        const resultDetails = document.getElementById('result-details');
        
        if (!resultOverlay || !resultTitle || !resultDetails) return;

        resultOverlay.style.display = 'flex';
        
        if (playerWon) {
            resultTitle.className = 'result-title win';
            resultTitle.innerHTML = '🏆 ПОБЕДА!';
            resultDetails.innerHTML = `<strong>Вы победили!</strong><br><br>Получен NFT: <strong>${this.enemyNft.name}</strong>`;
            if (window.collection && Array.isArray(window.collection)) {
                window.collection.push({...this.enemyNft, buyPrice: this.enemyNft.price || 150});
            }
        } else {
            resultTitle.className = 'result-title lose';
            resultTitle.innerHTML = '💀 ПОРАЖЕНИЕ!';
            resultDetails.innerHTML = `<strong>Вы проиграли...</strong><br><br>Потерян NFT: <strong>${this.playerNft.name}</strong>`;
            if (window.collection && Array.isArray(window.collection)) {
                const index = window.collection.findIndex(nft => nft.name === this.playerNft.name);
                if (index !== -1) window.collection.splice(index, 1);
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
        
        if (window.updateUI) window.updateUI();
        if (window.saveData) setTimeout(() => window.saveData(), 500);
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

        setTimeout(() => this.endBattle(), 1500);
    }

    endBattle() {
        const battleScreen = document.getElementById('battle-screen');
        if (battleScreen) {
            battleScreen.classList.remove('active');
        }

        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
            mainScreen.classList.add('active');
        }
        
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[0]) navItems[0].classList.add('active');

        if (window.renderCenterArea) window.renderCenterArea();
        if (window.updateUI) window.updateUI();
    }
}

window.battleSystem = new UndertaleBattle();
