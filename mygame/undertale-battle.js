// УЛЬТРА ПРОСТАЯ БОЕВАЯ СИСТЕМА - С НУЛЯ БЕЗ ВСЯКОЙ ФИГНИ

window.battleSystem = {
    playerHP: 100,
    enemyHP: 100,
    isActive: false,
    
    init: function(playerNft, enemyNft) {
        console.log('Запуск простой битвы');
        
        this.playerHP = 100;
        this.enemyHP = 100;
        this.isActive = true;
        this.playerNft = playerNft;
        this.enemyNft = enemyNft;
        
        this.createUI();
        return true;
    },
    
    createUI: function() {
        // Убираем старое
        const old = document.getElementById('battle-screen');
        if (old) old.remove();
        
        // Создаем новое
        const html = `
        <div id="battle-screen" style="position:fixed; top:0; left:0; right:0; bottom:0; background:#000; color:#fff; z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:Arial;">
            
            <h1>БИТВА</h1>
            
            <div style="margin:20px;">
                <h3>ВРАГ: ${this.enemyNft.name}</h3>
                <div style="width:300px; height:30px; background:#333; border:2px solid #666; margin:10px 0;">
                    <div id="enemy-bar" style="width:100%; height:100%; background:#00ff00;"></div>
                </div>
                <div id="enemy-hp">${this.enemyHP}/100 HP</div>
            </div>
            
            <button id="fight-btn" style="padding:20px 40px; font-size:20px; background:#ff0000; color:#fff; border:none; cursor:pointer; margin:20px;">
                БИТ!
            </button>
            
            <div style="margin:20px;">
                <h3>ИГРОК: ${this.playerNft.name}</h3>
                <div style="width:300px; height:30px; background:#333; border:2px solid #666; margin:10px 0;">
                    <div id="player-bar" style="width:100%; height:100%; background:#00ff00;"></div>
                </div>
                <div id="player-hp">${this.playerHP}/100 HP</div>
            </div>
            
            <button onclick="window.battleSystem.exit()" style="position:absolute; top:20px; right:20px; padding:10px; background:#666; color:#fff; border:none; cursor:pointer;">
                ВЫХОД
            </button>
            
        </div>`;
        
        document.body.innerHTML += html;
        
        // Кнопка боя
        document.getElementById('fight-btn').onclick = () => this.fight();
    },
    
    fight: function() {
        if (!this.isActive) return;
        
        console.log('БОЙ!');
        
        // Отключаем кнопку
        document.getElementById('fight-btn').disabled = true;
        document.getElementById('fight-btn').textContent = 'БОЙ...';
        
        // Случайно выбираем кто первый
        if (Math.random() < 0.5) {
            // Первый игрок
            this.hitPlayer();
            setTimeout(() => {
                if (this.isActive) {
                    this.hitEnemy();
                    this.enableButton();
                }
            }, 1000);
        } else {
            // Первый враг
            this.hitEnemy();
            setTimeout(() => {
                if (this.isActive) {
                    this.hitPlayer();
                    this.enableButton();
                }
            }, 1000);
        }
    },
    
    hitPlayer: function() {
        const damage = Math.floor(Math.random() * 20) + 10;
        this.playerHP -= damage;
        if (this.playerHP < 0) this.playerHP = 0;
        
        console.log(`Игрок получил ${damage} урона. HP: ${this.playerHP}`);
        this.updateBars();
        
        if (this.playerHP <= 0) {
            setTimeout(() => this.gameOver(false), 500);
        }
    },
    
    hitEnemy: function() {
        const damage = Math.floor(Math.random() * 20) + 10;
        this.enemyHP -= damage;
        if (this.enemyHP < 0) this.enemyHP = 0;
        
        console.log(`Враг получил ${damage} урона. HP: ${this.enemyHP}`);
        this.updateBars();
        
        if (this.enemyHP <= 0) {
            setTimeout(() => this.gameOver(true), 500);
        }
    },
    
    updateBars: function() {
        const playerPercent = (this.playerHP / 100) * 100;
        const enemyPercent = (this.enemyHP / 100) * 100;
        
        // ОБНОВЛЯЕМ БАРЫ ПРИНУДИТЕЛЬНО
        const playerBar = document.getElementById('player-bar');
        const enemyBar = document.getElementById('enemy-bar');
        
        if (playerBar) {
            playerBar.style.width = playerPercent + '%';
            console.log(`Бар игрока: ${playerPercent}%`);
        }
        
        if (enemyBar) {
            enemyBar.style.width = enemyPercent + '%';
            console.log(`Бар врага: ${enemyPercent}%`);
        }
        
        // ОБНОВЛЯЕМ ТЕКСТ
        const playerHPText = document.getElementById('player-hp');
        const enemyHPText = document.getElementById('enemy-hp');
        
        if (playerHPText) playerHPText.textContent = `${this.playerHP}/100 HP`;
        if (enemyHPText) enemyHPText.textContent = `${this.enemyHP}/100 HP`;
    },
    
    enableButton: function() {
        if (!this.isActive) return;
        const btn = document.getElementById('fight-btn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'БИТ!';
        }
    },
    
    gameOver: function(playerWon) {
        this.isActive = false;
        
        let message = playerWon ? '🏆 ВЫ ВЫИГРАЛИ!' : '💀 ВЫ ПРОИГРАЛИ!';
        
        setTimeout(() => {
            alert(message);
            this.exit();
        }, 1000);
        
        // Обновляем коллекцию
        if (playerWon && window.collection) {
            window.collection.push({
                ...this.enemyNft,
                buyPrice: this.enemyNft.price || 150
            });
        } else if (!playerWon && window.collection && window.activeBattleNft) {
            const index = window.collection.findIndex(nft => 
                nft.name === this.playerNft.name && nft.img === this.playerNft.img
            );
            if (index !== -1) {
                window.collection.splice(index, 1);
                window.activeBattleNft = null;
            }
        }
        
        if (window.updateUI) window.updateUI();
    },
    
    exit: function() {
        const battleScreen = document.getElementById('battle-screen');
        if (battleScreen) battleScreen.remove();
        
        // Возврат в меню
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));
        
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) mainScreen.classList.add('active');
        
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[0]) navItems[0].classList.add('active');
        
        if (window.renderCenterArea) window.renderCenterArea();
        if (window.updateUI) window.updateUI();
        
        console.log('Выход из битвы');
    }
};

// Совместимость
window.startUndertaleBattle = function(playerNft, enemyNft) {
    return window.battleSystem.init(playerNft, enemyNft);
};

console.log('✅ ПРОСТЕЙШАЯ битва загружена');
