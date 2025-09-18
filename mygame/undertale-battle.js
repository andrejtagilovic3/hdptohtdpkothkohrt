window.battleSystem = {
    playerHP: 100,
    enemyHP: 100,
    isActive: false,
    playerDodging: false,
    
    init: function(playerNft, enemyNft) {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.isActive = true;
        this.playerDodging = false;
        this.playerNft = playerNft;
        this.enemyNft = enemyNft;
        
        this.createUI();
        return true;
    },
    
    createUI: function() {
        const old = document.getElementById('battle-container');
        if (old) old.remove();
        
        const html = `
        <div id="battle-container" class="battle-container">
            <div class="enemy-area">
                <button class="escape-btn" onclick="window.battleSystem.escape()">Сбежать (50⭐)</button>
                
                <img src="${this.enemyNft.img}" class="enemy-img" alt="${this.enemyNft.name}">
                <div class="enemy-name">${this.enemyNft.name.toUpperCase()}</div>
                
                <div class="hp-container enemy-hp-container">
                    <div id="enemy-hp-bar" class="hp-bar"></div>
                </div>
                <div id="enemy-hp-text" class="hp-text">100/100 HP</div>
            </div>
            
            <div class="bottom-area">
                <div id="battle-log" class="battle-log"></div>
                
                <div class="actions-area">
                    <div class="buttons-left">
                        <button id="attack-btn" class="action-btn" onclick="window.battleSystem.attack()">
                            <i class="fas fa-sword"></i>
                            АТАКА
                        </button>
                        <button id="dodge-btn" class="action-btn" onclick="window.battleSystem.dodge()">
                            <i class="fas fa-running"></i>
                            УКЛОНЕНИЕ
                        </button>
                    </div>
                    
                    <div class="player-area">
                        <img src="${this.playerNft.img}" class="player-img" alt="${this.playerNft.name}">
                        <div>
                            <div class="player-name">ВЫ</div>
                            <div class="player-nft-name">${this.playerNft.name}</div>
                            <div class="hp-container player-hp-container">
                                <div id="player-hp-bar" class="hp-bar"></div>
                            </div>
                            <div id="player-hp-text" class="hp-text player-hp-text">100/100 HP</div>
                        </div>
                    </div>
                    
                    <div class="buttons-right">
                        <div class="reserve-slot">Резерв</div>
                        <div class="reserve-slot">Резерв</div>
                    </div>
                </div>
            </div>
            
            <div id="battle-result" class="battle-result" style="display: none;">
                <div class="result-modal">
                    <div id="result-title" class="result-title"></div>
                    <div id="result-details" class="result-details"></div>
                    <button onclick="window.battleSystem.exit()" class="result-btn">Вернуться в меню</button>
                </div>
            </div>
        </div>`;
        
        document.body.innerHTML += html;
        this.updateBars();
        this.addLog('Битва началась!');
    },
    
    attack: function() {
        if (!this.isActive) return;
        
        this.disableButtons();
        this.addLog('Вы атакуете!');
        
        if (Math.random() < 0.5) {
            this.hitPlayer();
            setTimeout(() => {
                if (this.isActive) {
                    this.hitEnemy();
                    this.enableButtons();
                }
            }, 1200);
        } else {
            this.hitEnemy();
            setTimeout(() => {
                if (this.isActive) {
                    this.hitPlayer();
                    this.enableButtons();
                }
            }, 1200);
        }
    },
    
    dodge: function() {
        if (!this.isActive) return;
        
        this.disableButtons();
        this.addLog('Вы готовитесь увернуться!');
        this.playerDodging = true;
        
        setTimeout(() => {
            if (this.isActive) {
                this.hitPlayer();
                setTimeout(() => {
                    this.playerDodging = false;
                    this.enableButtons();
                }, 1000);
            }
        }, 1200);
    },
    
    hitPlayer: function() {
        let damage = Math.floor(Math.random() * 20) + 12;
        let dodged = false;
        
        if (this.playerDodging && Math.random() < 0.6) {
            dodged = true;
            this.addLog('Уклонение! Вы избежали атаки!');
        } else {
            this.playerHP -= damage;
            if (this.playerHP < 0) this.playerHP = 0;
            this.addLog(`Вы получаете ${damage} урона!`);
        }
        
        this.updateBars();
        
        if (this.playerHP <= 0) {
            setTimeout(() => this.gameOver(false), 800);
        }
    },
    
    hitEnemy: function() {
        const damage = Math.floor(Math.random() * 25) + 15;
        this.enemyHP -= damage;
        if (this.enemyHP < 0) this.enemyHP = 0;
        
        this.addLog(`Враг получает ${damage} урона!`);
        this.updateBars();
        
        if (this.enemyHP <= 0) {
            setTimeout(() => this.gameOver(true), 800);
        }
    },
    
    updateBars: function() {
        const playerPercent = (this.playerHP / 100) * 100;
        const enemyPercent = (this.enemyHP / 100) * 100;
        
        const playerBar = document.getElementById('player-hp-bar');
        const enemyBar = document.getElementById('enemy-hp-bar');
        
        if (playerBar) {
            playerBar.style.width = playerPercent + '%';
            if (playerPercent > 50) {
                playerBar.className = 'hp-bar hp-green';
            } else if (playerPercent > 25) {
                playerBar.className = 'hp-bar hp-orange';
            } else {
                playerBar.className = 'hp-bar hp-red';
            }
        }
        
        if (enemyBar) {
            enemyBar.style.width = enemyPercent + '%';
            if (enemyPercent > 50) {
                enemyBar.className = 'hp-bar hp-green';
            } else if (enemyPercent > 25) {
                enemyBar.className = 'hp-bar hp-orange';
            } else {
                enemyBar.className = 'hp-bar hp-red';
            }
        }
        
        const playerHPText = document.getElementById('player-hp-text');
        const enemyHPText = document.getElementById('enemy-hp-text');
        
        if (playerHPText) playerHPText.textContent = `${this.playerHP}/100 HP`;
        if (enemyHPText) enemyHPText.textContent = `${this.enemyHP}/100 HP`;
    },
    
    disableButtons: function() {
        const attackBtn = document.getElementById('attack-btn');
        const dodgeBtn = document.getElementById('dodge-btn');
        
        if (attackBtn) {
            attackBtn.disabled = true;
            attackBtn.textContent = '...';
        }
        if (dodgeBtn) {
            dodgeBtn.disabled = true;
            dodgeBtn.textContent = '...';
        }
    },
    
    enableButtons: function() {
        if (!this.isActive) return;
        
        const attackBtn = document.getElementById('attack-btn');
        const dodgeBtn = document.getElementById('dodge-btn');
        
        if (attackBtn) {
            attackBtn.disabled = false;
            attackBtn.innerHTML = '<i class="fas fa-sword"></i> АТАКА';
        }
        if (dodgeBtn) {
            dodgeBtn.disabled = false;
            dodgeBtn.innerHTML = '<i class="fas fa-running"></i> УКЛОНЕНИЕ';
        }
        
        this.addLog('Ваш ход!');
    },
    
    addLog: function(message) {
        const logDiv = document.getElementById('battle-log');
        if (!logDiv) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = '• ' + message;
        
        logDiv.appendChild(logEntry);
        
        const entries = logDiv.querySelectorAll('.log-entry');
        if (entries.length > 4) {
            entries[0].remove();
        }
        
        logDiv.scrollTop = logDiv.scrollHeight;
    },
    
    gameOver: function(playerWon) {
        this.isActive = false;
        
        const resultDiv = document.getElementById('battle-result');
        const titleDiv = document.getElementById('result-title');
        const detailsDiv = document.getElementById('result-details');
        
        if (playerWon) {
            titleDiv.textContent = '🏆 ПОБЕДА!';
            titleDiv.className = 'result-title win';
            detailsDiv.innerHTML = `<strong>Вы победили!</strong><br><br>Получен NFT: <strong>${this.enemyNft.name}</strong><br><em>NFT добавлен в коллекцию</em>`;
            
            if (window.collection) {
                window.collection.push({
                    ...this.enemyNft,
                    buyPrice: this.enemyNft.price || 150
                });
            }
        } else {
            titleDiv.textContent = '💀 ПОРАЖЕНИЕ!';
            titleDiv.className = 'result-title lose';
            detailsDiv.innerHTML = `<strong>Вы проиграли...</strong><br><br>Потерян NFT: <strong>${this.playerNft.name}</strong><br><em>NFT удален из коллекции</em>`;
            
            if (window.collection && window.activeBattleNft) {
                const index = window.collection.findIndex(nft => 
                    nft.name === this.playerNft.name && 
                    nft.img === this.playerNft.img && 
                    nft.buyPrice === this.playerNft.buyPrice
                );
                if (index !== -1) {
                    window.collection.splice(index, 1);
                    window.activeBattleNft = null;
                }
            }
        }
        
        if (window.battleHistory) {
            window.battleHistory.push({
                playerNft: {...this.playerNft},
                opponentNft: {...this.enemyNft},
                won: playerWon,
                timestamp: new Date().toISOString()
            });
        }
        
        resultDiv.style.display = 'flex';
        
        if (window.updateUI) window.updateUI();
        if (window.saveData) setTimeout(() => window.saveData(), 500);
    },
    
    escape: function() {
        if (window.stars < 50) {
            this.addLog('Недостаточно звёзд для побега! (нужно 50)');
            return;
        }
        
        window.stars -= 50;
        this.addLog('Вы сбежали из боя! Потеряно 50 звёзд.');
        
        if (window.updateUI) window.updateUI();
        if (window.saveData) window.saveData();
        
        setTimeout(() => this.exit(), 1500);
    },
    
    exit: function() {
        const battleContainer = document.getElementById('battle-container');
        if (battleContainer) battleContainer.remove();
        
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
};

window.startUndertaleBattle = function(playerNft, enemyNft) {
    return window.battleSystem.init(playerNft, enemyNft);
};

console.log('Боевая система с дизайном загружена');
