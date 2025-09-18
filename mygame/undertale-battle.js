// ==================== UNDERTALE BATTLE SYSTEM (УПРОЩЕННАЯ HP СИСТЕМА) ====================

class BattleSystem {
    constructor() {
        this.reset();
    }

    reset() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.maxHP = 100;
        this.currentTurn = 'player';
        this.isActive = false;
        this.playerNft = null;
        this.enemyNft = null;
        this.battleLog = [];
        this.playerDodging = false;
        this.elements = {};
    }

    init(playerNft, enemyNft) {
        console.log('🚀 Запуск битвы:', playerNft.name, 'vs', enemyNft.name);
        
        this.reset();
        this.playerNft = {...playerNft};
        this.enemyNft = {...enemyNft};
        this.isActive = true;
        
        this.createUI();
        this.cacheElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.addLog(`Битва началась! ${playerNft.name} против ${enemyNft.name}`);
        
        return true;
    }

    createUI() {
        const existing = document.getElementById('undertale-battle-container');
        if (existing) existing.remove();

        const battleHTML = `
            <div id="undertale-battle-container" class="undertale-battle-container">
                <div class="enemy-battle-area">
                    <button class="escape-btn" id="escape-btn">
                        Сбежать (50⭐)
                    </button>

                    <img id="enemy-battle-img" class="enemy-battle-img" alt="Enemy NFT">
                    <div id="enemy-name" class="enemy-name">ВРАГ</div>

                    <div class="battle-hp-container enemy-hp-container">
                        <div id="enemy-hp-bar" class="battle-hp-bar"></div>
                    </div>
                    <div id="enemy-hp-text" class="battle-hp-text">100/100 HP</div>
                </div>

                <div class="battle-bottom-area">
                    <div id="battle-log-container" class="battle-log-container"></div>

                    <div class="battle-actions-area">
                        <div class="battle-buttons">
                            <button id="attack-btn" class="battle-action-btn">
                                <i class="fas fa-sword"></i>
                                АТАКА
                            </button>
                            <button id="dodge-btn" class="battle-action-btn">
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
                                    <div id="player-hp-bar" class="battle-hp-bar"></div>
                                </div>
                                <div id="player-hp-text" class="battle-hp-text">100/100 HP</div>
                            </div>
                        </div>

                        <div class="battle-buttons">
                            <div class="battle-reserve-slot">Резерв</div>
                            <div class="battle-reserve-slot">Резерв</div>
                        </div>
                    </div>
                </div>

                <div id="battle-result-overlay" class="battle-result-overlay" style="display: none;">
                    <div class="battle-result-modal">
                        <div id="result-title" class="result-title"></div>
                        <div id="result-details" class="result-details"></div>
                        <button id="result-back-btn" class="result-back-btn">
                            Вернуться в меню
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', battleHTML);
        console.log('✅ UI создан');
    }

    cacheElements() {
        this.elements = {
            playerImg: document.getElementById('player-battle-img'),
            enemyImg: document.getElementById('enemy-battle-img'),
            enemyName: document.getElementById('enemy-name'),
            playerNftName: document.getElementById('player-nft-name'),
            playerHPText: document.getElementById('player-hp-text'),
            enemyHPText: document.getElementById('enemy-hp-text'),
            playerHPBar: document.getElementById('player-hp-bar'),
            enemyHPBar: document.getElementById('enemy-hp-bar'),
            attackBtn: document.getElementById('attack-btn'),
            dodgeBtn: document.getElementById('dodge-btn'),
            escapeBtn: document.getElementById('escape-btn'),
            resultBackBtn: document.getElementById('result-back-btn'),
            battleLog: document.getElementById('battle-log-container'),
            resultOverlay: document.getElementById('battle-result-overlay'),
            resultTitle: document.getElementById('result-title'),
            resultDetails: document.getElementById('result-details')
        };
    }

    setupEventListeners() {
        this.elements.attackBtn.addEventListener('click', () => this.playerAttack());
        this.elements.dodgeBtn.addEventListener('click', () => this.playerDodge());
        this.elements.escapeBtn.addEventListener('click', () => this.attemptEscape());
        this.elements.resultBackBtn.addEventListener('click', () => this.endBattle());
    }

    // УПРОЩЕННАЯ HP СИСТЕМА (СТАТИЧНЫЕ ПОЛОСКИ, ПОКАЗЫВАЮТ УРОН)
    updateHPBar(barElement, currentHP, maxHP) {
        if (!barElement) return;

        currentHP = Math.max(0, Math.round(currentHP));
        const percent = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));

        // Просто статичный бар без анимаций и градиентов
        barElement.style.width = `${percent}%`;

        // Цвет меняется просто на основе процента
        if (percent > 50) {
            barElement.style.backgroundColor = '#4caf50'; // Зеленый
        } else if (percent > 25) {
            barElement.style.backgroundColor = '#ff9800'; // Оранжевый
        } else {
            barElement.style.backgroundColor = '#ff1744'; // Красный
        }
    }

    updateHPTexts() {
        if (this.elements.playerHPText) {
            const displayPlayerHP = Math.max(0, Math.round(this.playerHP));
            this.elements.playerHPText.textContent = `${displayPlayerHP}/${this.maxHP} HP`;
        }
        
        if (this.elements.enemyHPText) {
            const displayEnemyHP = Math.max(0, Math.round(this.enemyHP));
            this.elements.enemyHPText.textContent = `${displayEnemyHP}/${this.maxHP} HP`;
        }
    }

    updateHPBars() {
        this.updateHPBar(this.elements.playerHPBar, this.playerHP, this.maxHP);
        this.updateHPBar(this.elements.enemyHPBar, this.enemyHP, this.maxHP);
        this.updateHPTexts();
    }

    updateDisplay() {
        if (this.elements.playerImg && this.playerNft) {
            this.elements.playerImg.src = this.playerNft.img;
            this.elements.playerImg.alt = this.playerNft.name;
        }
        if (this.elements.enemyImg && this.enemyNft) {
            this.elements.enemyImg.src = this.enemyNft.img;
            this.elements.enemyImg.alt = this.enemyNft.name;
            this.elements.enemyName.textContent = this.enemyNft.name.toUpperCase();
        }
        if (this.elements.playerNftName && this.playerNft) {
            this.elements.playerNftName.textContent = this.playerNft.name;
        }

        this.updateHPBars();
        this.updateActionButtons();
    }

    updateActionButtons() {
        if (this.elements.attackBtn && this.elements.dodgeBtn) {
            if (this.currentTurn === 'player') {
                this.elements.attackBtn.disabled = false;
                this.elements.dodgeBtn.disabled = false;
            } else {
                this.elements.attackBtn.disabled = true;
                this.elements.dodgeBtn.disabled = true;
            }
        }
    }

    addLog(message) {
        this.battleLog.push(message);
        if (this.elements.battleLog) {
            this.elements.battleLog.innerHTML += `<div>${message}</div>`;
            this.elements.battleLog.scrollTop = this.elements.battleLog.scrollHeight;
        }
    }

    playerAttack() {
        if (!this.isActive || this.currentTurn !== 'player') return;
        this.currentTurn = 'enemy';

        const result = this.calculateAttack(true);
        this.applyAttackResult(result, true);
        this.updateHPBars();
        this.checkBattleEnd();

        if (this.isActive) {
            setTimeout(() => this.enemyTurn(), 1500);
        }
    }

    playerDodge() {
        if (!this.isActive || this.currentTurn !== 'player') return;
        this.playerDodging = true;
        this.currentTurn = 'enemy';

        this.addLog('Вы готовитесь к уклонению!');
        setTimeout(() => this.enemyTurn(), 1000);
    }

    enemyTurn() {
        if (!this.isActive) return;

        const actions = ['attack', 'dodge', 'attack'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        if (action === 'dodge') {
            this.addLog('Оппонент готовится к уклонению!');
        } else {
            const result = this.calculateAttack(false);
            this.applyAttackResult(result, false);
            this.updateHPBars();
            this.checkBattleEnd();
        }

        this.playerDodging = false;
        this.currentTurn = 'player';
        this.updateActionButtons();
    }

    calculateAttack(isPlayerAttack) {
        let damage = Math.floor(Math.random() * 20) + 10;
        let critChance = 0.15;
        let dodgeChance = 0.15;

        const attacker = isPlayerAttack ? this.playerNft : this.enemyNft;
        const defender = isPlayerAttack ? this.enemyNft : this.playerNft;

        if (attacker.upgrades) {
            if (attacker.upgrades.damage) {
                damage *= attacker.upgrades.damage;
            }
            if (attacker.upgrades.crit) {
                critChance *= attacker.upgrades.crit;
            }
        }

        if (defender.upgrades && defender.upgrades.dodge) {
            dodgeChance *= defender.upgrades.dodge;
        }

        if (!isPlayerAttack && this.playerDodging) {
            dodgeChance += 0.35;
        }

        if (!isPlayerAttack) {
            damage *= 1.15;
        } else {
            damage *= 0.90;
        }

        const isCritical = Math.random() < critChance;
        const isMiss = Math.random() < dodgeChance;

        if (isCritical && !isMiss) {
            damage *= isPlayerAttack ? 1.8 : 1.7;
        }

        return {
            damage: Math.floor(damage),
            isCritical,
            isMiss
        };
    }

    applyAttackResult(result, isPlayerAttack) {
        const targetImg = isPlayerAttack ? this.elements.enemyImg : this.elements.playerImg;
        const { damage, isCritical, isMiss } = result;

        if (isMiss) {
            if (isPlayerAttack) {
                this.addLog('Промах! Ваша атака не попала в цель!');
            } else {
                this.addLog('Уклонение! Вы избежали атаки оппонента!');
            }
            this.showDamageEffect(targetImg, 'МИМО', false);
        } else {
            if (isPlayerAttack) {
                this.enemyHP = Math.max(0, this.enemyHP - damage);
                if (isCritical) {
                    this.addLog(`💥 КРИТИЧЕСКИЙ УДАР! Вы наносите ${damage} урона оппоненту!`);
                } else {
                    this.addLog(`Вы наносите ${damage} урона оппоненту!`);
                }
            } else {
                this.playerHP = Math.max(0, this.playerHP - damage);
                if (isCritical) {
                    this.addLog(`💥 КРИТИЧЕСКАЯ АТАКА ОППОНЕНТА! Вы получаете ${damage} урона!`);
                } else {
                    this.addLog(`Оппонент наносит вам ${damage} урона!`);
                }
            }

            this.showDamageEffect(targetImg, damage, isCritical);
            this.addShakeEffect(targetImg);
        }

        this.updateHPBars();
    }

    showDamageEffect(targetElement, damage, isCrit = false) {
        if (!targetElement) return;

        const effect = document.createElement('div');
        effect.className = `damage-effect ${isCrit ? 'crit' : ''}`;
        effect.textContent = damage;
        
        targetElement.style.position = 'relative';
        targetElement.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1200);
    }

    addShakeEffect(element) {
        element.classList.add('battle-shake');
        setTimeout(() => {
            element.classList.remove('battle-shake');
        }, 500);
    }

    checkBattleEnd() {
        if (this.playerHP <= 0) {
            setTimeout(() => this.showResult(false), 1000);
        } else if (this.enemyHP <= 0) {
            setTimeout(() => this.showResult(true), 1000);
        }
    }

    showResult(playerWon) {
        this.isActive = false;

        if (playerWon) {
            this.elements.resultTitle.className = 'result-title win';
            this.elements.resultTitle.innerHTML = '🏆 ПОБЕДА!';
            this.elements.resultDetails.innerHTML = `
                <strong>Вы победили!</strong><br><br>
                Получен NFT: <strong>${this.enemyNft.name}</strong><br>
                <em>NFT добавлен в вашу коллекцию</em>
            `;

            if (window.collection && Array.isArray(window.collection)) {
                const newNft = {
                    ...this.enemyNft, 
                    buyPrice: this.enemyNft.price || 150
                };
                window.collection.push(newNft);
            }
        } else {
            this.elements.resultTitle.className = 'result-title lose';
            this.elements.resultTitle.innerHTML = '💀 ПОРАЖЕНИЕ!';
            this.elements.resultDetails.innerHTML = `
                <strong>Вы проиграли...</strong><br><br>
                Потерян NFT: <strong>${this.playerNft.name}</strong><br>
                <em>NFT удален из коллекции</em>
            `;

            if (window.collection && Array.isArray(window.collection)) {
                const index = window.collection.findIndex(nft => 
                    nft.name === this.playerNft.name && 
                    nft.img === this.playerNft.img && 
                    nft.buyPrice === this.playerNft.buyPrice
                );
                
                if (index !== -1) {
                    window.collection.splice(index, 1);
                    if (window.activeBattleNft) {
                        window.activeBattleNft = null;
                    }
                }
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

        this.elements.resultOverlay.style.display = 'flex';

        if (window.updateUI) {
            window.updateUI();
        }
        if (window.saveData) {
            setTimeout(() => {
                window.saveData();
            }, 500);
        }
    }

    attemptEscape() {
        if (window.stars < 50) {
            this.addLog('Недостаточно звёзд для побега! (нужно 50)');
            return;
        }

        window.stars -= 50;
        this.addLog('Вы сбежали из боя! Потеряно 50 звёзд.');
        
        if (window.updateUI) window.updateUI();
        if (window.saveData) window.saveData();
        
        setTimeout(() => {
            this.endBattle();
        }, 1500);
    }

    endBattle() {
        const container = document.getElementById('undertale-battle-container');
        if (container) {
            container.remove();
        }

        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));
        
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
            mainScreen.classList.add('active');
        }

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[0]) {
            navItems[0].classList.add('active');
        }

        if (window.renderCenterArea) {
            window.renderCenterArea();
        }
        if (window.updateUI) {
            window.updateUI();
        }
    }
}

window.battleSystem = new BattleSystem();

window.startUndertaleBattle = function(playerNft, enemyNft) {
    if (!playerNft || !enemyNft) {
        alert('Ошибка: не выбран NFT для битвы!');
        return false;
    }
    
    return window.battleSystem.init(playerNft, enemyNft);
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Undertale Battle System загружен!');
});
