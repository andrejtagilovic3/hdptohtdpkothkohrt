class UndertaleBattle {
    constructor() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.playerMaxHP = 100;
        this.enemyMaxHP = 100;
        this.currentTurn = 'player';
        this.battlePhase = 'menu';
        this.battleActive = false;
        this.playerNft = null;
        this.enemyNft = null;
        this.battleContainer = null;
        this.actionButtons = null;
        this.battleLog = [];
        this.playerDefending = false;
    }

    init(playerNft, enemyNft) {
        this.playerNft = playerNft;
        this.enemyHp = 100;
        this.playerHP = 100;
        this.battleActive = true;
        this.currentTurn = 'player';
        this.battlePhase = 'menu';
        this.battleLog = [];
        this.playerDefending = false;
        
        this.createBattleUI();
        this.updateDisplay();
        this.showPlayerActions();
    }

    createBattleUI() {
        const existing = document.getElementById('undertale-battle-container');
        if (existing) existing.remove();

        const battleHTML = `
            <div id="undertale-battle-container" class="battle-container">
                <!-- Enemy NFT Area (Red Frame in Sketch) -->
                <div class="enemy-area">
                    <button id="escape-btn" class="escape-btn">СБЕЖАТЬ (-50⭐)</button>
                    <img id="enemy-battle-img" class="nft-img">
                    <div id="enemy-name" class="nft-name">ВРАГ</div>
                    <div class="hp-bar-container">
                        <div id="enemy-hp-bar" class="hp-bar"></div>
                    </div>
                    <div id="enemy-hp-text" class="hp-text">100/100 HP</div>
                </div>

                <!-- Battle Log Area (Yellow Frame in Sketch) -->
                <div id="battle-log-container" class="battle-log-area"></div>

                <!-- Player Action Area -->
                <div class="action-area">
                    <!-- Player NFT Area (Blue Frame in Sketch) -->
                    <div class="player-area">
                        <img id="player-battle-img" class="nft-img">
                        <div id="player-name" class="nft-name">ИГРОК</div>
                        <div class="hp-bar-container">
                            <div id="player-hp-bar" class="hp-bar"></div>
                        </div>
                        <div id="player-hp-text" class="hp-text">100/100 HP</div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="buttons-container">
                        <button id="attack-btn" class="action-btn">АТАКА</button>
                        <button id="dodge-btn" class="action-btn">УКЛОНИТЬСЯ</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', battleHTML);
        this.battleContainer = document.getElementById('undertale-battle-container');
        this.actionButtons = {
            attack: document.getElementById('attack-btn'),
            dodge: document.getElementById('dodge-btn'),
            escape: document.getElementById('escape-btn')
        };

        this.actionButtons.attack.addEventListener('click', () => this.playerAttack());
        this.actionButtons.dodge.addEventListener('click', () => this.playerDefend());
        this.actionButtons.escape.addEventListener('click', () => this.attemptEscape());
    }

    updateDisplay() {
        document.getElementById('enemy-battle-img').src = this.enemyNft.img;
        document.getElementById('enemy-name').textContent = this.enemyNft.name;
        document.getElementById('enemy-hp-bar').style.width = (this.enemyHP / this.enemyMaxHP * 100) + '%';
        document.getElementById('enemy-hp-text').textContent = `${Math.round(this.enemyHP)}/100 HP`;

        document.getElementById('player-battle-img').src = this.playerNft.img;
        document.getElementById('player-name').textContent = this.playerNft.name;
        document.getElementById('player-hp-bar').style.width = (this.playerHP / this.playerMaxHP * 100) + '%';
        document.getElementById('player-hp-text').textContent = `${Math.round(this.playerHP)}/100 HP`;
    }

    addBattleLog(message) {
        this.battleLog.push(message);
        if (this.battleLog.length > 5) this.battleLog.shift();
        document.getElementById('battle-log-container').textContent = this.battleLog.join('\n');
    }

    showPlayerActions() {
        this.actionButtons.attack.disabled = this.currentTurn !== 'player' || !this.battleActive;
        this.actionButtons.dodge.disabled = this.currentTurn !== 'player' || !this.battleActive;
    }

    playerAttack() {
        if (this.currentTurn !== 'player' || !this.battleActive) return;

        let damage = Math.floor(Math.random() * 30) + 12;
        const isCrit = Math.random() < 0.15;

        if (isCrit) {
            damage *= 1.8;
            this.addBattleLog(`КРИТИЧЕСКИЙ УДАР! Нанесено ${Math.round(damage)} урона!`);
        } else {
            this.addBattleLog(`Нанесено ${Math.round(damage)} урона`);
        }

        this.enemyHP -= damage;
        this.enemyHP = Math.max(0, this.enemyHP);

        this.updateDisplay();
        this.checkBattleEnd();

        if (this.battleActive) {
            this.currentTurn = 'enemy';
            this.showPlayerActions();
            setTimeout(() => this.enemyTurn(), 2000);
        }
    }

    playerDefend() {
        if (this.currentTurn !== 'player' || !this.battleActive) return;

        this.addBattleLog('Вы приготовились к защите!');
        this.playerDefending = true;

        this.currentTurn = 'enemy';
        this.showPlayerActions();
        setTimeout(() => this.enemyTurn(), 1500);
    }

    enemyTurn() {
        if (this.currentTurn !== 'enemy' || !this.battleActive) return;

        this.addBattleLog('Враг атакует!');

        let damage = Math.floor(Math.random() * 30) + 12;
        const isCrit = Math.random() < 0.15;
        let playerDodgeChance = 0.08;

        if (this.playerDefending) {
            damage *= 0.5;
            this.addBattleLog(`Блок поглотил часть урона! Получено ${Math.round(damage)} урона`);
        } else if (Math.random() < playerDodgeChance) {
            this.addBattleLog('Вы уклонились от атаки!');
        } else {
            if (isCrit) {
                damage *= 1.8;
                this.addBattleLog(`КРИТИЧЕСКАЯ АТАКА! Получено ${Math.round(damage)} урона!`);
            } else {
                this.addBattleLog(`Получено ${Math.round(damage)} урона`);
            }
            this.playerHP -= damage;
            this.playerHP = Math.max(0, this.playerHP);
        }

        this.playerDefending = false;
        this.updateDisplay();
        this.checkBattleEnd();

        if (this.battleActive) {
            this.currentTurn = 'player';
            setTimeout(() => this.showPlayerActions(), 1500);
        }
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
        const resultContainer = document.createElement('div');
        resultContainer.className = 'battle-result';
        resultContainer.innerHTML = playerWon ? 
            '<div>🏆 ПОБЕДА!</div><div>NFT противника добавлен</div>' : 
            '<div>💀 ПОРАЖЕНИЕ!</div><div>Ваш NFT потерян</div>';
        this.battleContainer.appendChild(resultContainer);

        if (playerWon) {
            collection.push({...this.enemyNft, buyPrice: this.enemyNft.price || 100});
        } else {
            const index = collection.findIndex(nft => 
                nft.name === this.playerNft.name && nft.img === this.playerNft.img && nft.buyPrice === this.playerNft.buyPrice
            );
            if (index !== -1) {
                collection.splice(index, 1);
                activeBattleNft = null;
            }
        }

        battleHistory.push({
            playerNft: {...this.playerNft},
            opponentNft: {...this.enemyNft},
            won: playerWon,
            timestamp: new Date().toISOString()
        });

        updateUI();
        saveData();
        setTimeout(() => this.endBattle(), 2000);
    }

    attemptEscape() {
        if (stars < 50) {
            this.addBattleLog('Недостаточно звёзд для побега!');
            return;
        }

        stars -= 50;
        updateUI();
        this.addBattleLog('Вы сбежали из боя! (-50 звёзд)');
        this.endBattle();
    }

    endBattle() {
        if (this.battleContainer) {
            this.battleContainer.remove();
        }
        backToMainFromBattle();
    }
}

window.battleSystem = new UndertaleBattle();
window.startUndertaleBattle = function(playerNft, enemyNft) {
    console.log('Запуск боя:', playerNft.name, 'vs', enemyNft.name);
    battleSystem.init(playerNft, enemyNft);
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Undertale Battle System загружен!');
});
