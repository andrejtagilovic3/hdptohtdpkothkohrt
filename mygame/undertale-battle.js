// КРАСИВАЯ БОЕВАЯ СИСТЕМА - ПОЛНОСТЬЮ ПЕРЕРАБОТАННАЯ

window.battleSystem = {
    playerHP: 100,
    enemyHP: 100,
    maxPlayerHP: 100,
    maxEnemyHP: 100,
    isActive: false,
    
    init: function(playerNft, enemyNft) {
        console.log('🎮 Запуск красивой битвы');
        
        this.playerHP = 100;
        this.enemyHP = 100;
        this.maxPlayerHP = 100;
        this.maxEnemyHP = 100;
        this.isActive = true;
        this.playerNft = playerNft;
        this.enemyNft = enemyNft;
        
        this.createUI();
        this.playSound('battle-start');
        return true;
    },
    
    createUI: function() {
        // Убираем старое
        const old = document.getElementById('battle-screen');
        if (old) old.remove();
        
        // Создаем новый интерфейс
        const html = `
        <div id="battle-screen">
            <!-- Верхняя панель -->
            <div class="battle-header">
                <div class="battle-title">⚔️ ДУЭЛЬ</div>
                <button class="battle-exit-btn" onclick="window.battleSystem.exit()">
                    <i class="fas fa-times"></i> Выход
                </button>
            </div>
            
            <!-- Основная область битвы -->
            <div class="battle-main">
                <!-- Враг -->
                <div class="battle-enemy-section">
                    <div class="battle-enemy-title">Противник</div>
                    <img id="enemy-battle-img" src="${this.enemyNft.img}" class="battle-enemy-img" alt="${this.enemyNft.name}">
                    
                    <div class="battle-hp-section">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #ff6b6b;">
                            ${this.enemyNft.name}
                        </div>
                        <div class="battle-hp-container">
                            <div id="enemy-hp-bar" class="battle-hp-bar healthy"></div>
                        </div>
                        <div id="enemy-hp-text" class="battle-hp-text">${this.enemyHP}/${this.maxEnemyHP} HP</div>
                    </div>
                </div>
                
                <!-- Центральная кнопка -->
                <div class="battle-center">
                    <button id="battle-fight-btn" class="battle-fight-btn">
                        ⚔️ АТАКА!
                    </button>
                </div>
                
                <!-- Игрок -->
                <div class="battle-player-section">
                    <div class="battle-hp-section">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #4caf50;">
                            ${this.playerNft.name}
                        </div>
                        <div class="battle-hp-container">
                            <div id="player-hp-bar" class="battle-hp-bar healthy"></div>
                        </div>
                        <div id="player-hp-text" class="battle-hp-text">${this.playerHP}/${this.maxPlayerHP} HP</div>
                    </div>
                    
                    <img id="player-battle-img" src="${this.playerNft.img}" class="battle-player-img" alt="${this.playerNft.name}">
                    <div class="battle-player-title">Ваш NFT</div>
                </div>
            </div>
        </div>`;
        
        document.body.innerHTML += html;
        
        // Привязываем обработчик кнопки
        document.getElementById('battle-fight-btn').onclick = () => this.fight();
    },
    
    fight: function() {
        if (!this.isActive) return;
        
        console.log('⚔️ НАЧИНАЕМ БОЙ!');
        
        // Отключаем кнопку
        const btn = document.getElementById('battle-fight-btn');
        btn.disabled = true;
        btn.textContent = '⚔️ Бой идет...';
        
        // Случайно определяем порядок ходов
        if (Math.random() < 0.5) {
            // Первый ходит игрок
            setTimeout(() => this.playerAttack(), 500);
        } else {
            // Первый ходит враг
            setTimeout(() => this.enemyAttack(), 500);
        }
    },
    
    playerAttack: function() {
        if (!this.isActive) return;
        
        // Анимация атаки игрока
        const playerImg = document.getElementById('player-battle-img');
        playerImg.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            playerImg.style.transform = 'scale(1)';
            
            // Расчет урона
            let damage = Math.floor(Math.random() * 20) + 15;
            let isCritical = Math.random() < 0.15; // 15% шанс крита
            
            if (isCritical) {
                damage = Math.floor(damage * 1.5);
            }
            
            // Применяем урон
            this.enemyHP -= damage;
            if (this.enemyHP < 0) this.enemyHP = 0;
            
            // Эффекты
            this.showDamage('enemy', damage, isCritical);
            this.shakeEnemy();
            this.updateBars();
            this.playSound(isCritical ? 'critical-hit' : 'hit');
            
            console.log(`🗡️ Игрок нанес ${damage} урона${isCritical ? ' (КРИТИЧЕСКИЙ!)' : ''}. HP врага: ${this.enemyHP}`);
            
            // Проверяем победу
            if (this.enemyHP <= 0) {
                setTimeout(() => this.gameOver(true), 1000);
            } else {
                // Ход врага
                setTimeout(() => this.enemyAttack(), 1500);
            }
        }, 300);
    },
    
    enemyAttack: function() {
        if (!this.isActive) return;
        
        // Анимация атаки врага
        const enemyImg = document.getElementById('enemy-battle-img');
        enemyImg.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            enemyImg.style.transform = 'scale(1)';
            
            // Расчет урона
            let damage = Math.floor(Math.random() * 18) + 12;
            let isCritical = Math.random() < 0.12; // 12% шанс крита у врага
            
            if (isCritical) {
                damage = Math.floor(damage * 1.5);
            }
            
            // Применяем урон
            this.playerHP -= damage;
            if (this.playerHP < 0) this.playerHP = 0;
            
            // Эффекты
            this.showDamage('player', damage, isCritical);
            this.shakePlayer();
            this.updateBars();
            this.playSound(isCritical ? 'critical-hit' : 'hit');
            
            console.log(`💀 Враг нанес ${damage} урона${isCritical ? ' (КРИТИЧЕСКИЙ!)' : ''}. HP игрока: ${this.playerHP}`);
            
            // Проверяем поражение
            if (this.playerHP <= 0) {
                setTimeout(() => this.gameOver(false), 1000);
            } else {
                // Включаем кнопку для следующего хода
                this.enableButton();
            }
        }, 300);
    },
    
    showDamage: function(target, damage, isCritical) {
        const targetElement = document.getElementById(target === 'enemy' ? 'enemy-battle-img' : 'player-battle-img');
        const rect = targetElement.getBoundingClientRect();
        
        const damageEl = document.createElement('div');
        damageEl.className = `damage-effect ${target}-damage${isCritical ? ' critical' : ''}`;
        damageEl.textContent = `-${damage}${isCritical ? ' КРИТ!' : ''}`;
        damageEl.style.left = (rect.left + rect.width / 2) + 'px';
        damageEl.style.top = rect.top + 'px';
        
        document.body.appendChild(damageEl);
        
        setTimeout(() => {
            if (damageEl.parentNode) {
                damageEl.parentNode.removeChild(damageEl);
            }
        }, 1500);
    },
    
    shakeEnemy: function() {
        const enemyImg = document.getElementById('enemy-battle-img');
        enemyImg.classList.add('battle-shake');
        setTimeout(() => {
            enemyImg.classList.remove('battle-shake');
        }, 600);
    },
    
    shakePlayer: function() {
        const playerImg = document.getElementById('player-battle-img');
        playerImg.classList.add('battle-shake');
        setTimeout(() => {
            playerImg.classList.remove('battle-shake');
        }, 600);
    },
    
    updateBars: function() {
        const playerPercent = Math.max(0, (this.playerHP / this.maxPlayerHP) * 100);
        const enemyPercent = Math.max(0, (this.enemyHP / this.maxEnemyHP) * 100);
        
        // Обновляем бары
        const playerBar = document.getElementById('player-hp-bar');
        const enemyBar = document.getElementById('enemy-hp-bar');
        
        if (playerBar) {
            playerBar.style.width = playerPercent + '%';
            
            // Меняем цвет в зависимости от HP
            playerBar.classList.remove('healthy', 'damaged', 'critical');
            if (playerPercent > 60) {
                playerBar.classList.add('healthy');
            } else if (playerPercent > 30) {
                playerBar.classList.add('damaged');
            } else {
                playerBar.classList.add('critical');
            }
        }
        
        if (enemyBar) {
            enemyBar.style.width = enemyPercent + '%';
            
            // Меняем цвет в зависимости от HP
            enemyBar.classList.remove('healthy', 'damaged', 'critical');
            if (enemyPercent > 60) {
                enemyBar.classList.add('healthy');
            } else if (enemyPercent > 30) {
                enemyBar.classList.add('damaged');
            } else {
                enemyBar.classList.add('critical');
            }
        }
        
        // Обновляем текст
        const playerHPText = document.getElementById('player-hp-text');
        const enemyHPText = document.getElementById('enemy-hp-text');
        
        if (playerHPText) playerHPText.textContent = `${this.playerHP}/${this.maxPlayerHP} HP`;
        if (enemyHPText) enemyHPText.textContent = `${this.enemyHP}/${this.maxEnemyHP} HP`;
    },
    
    enableButton: function() {
        if (!this.isActive) return;
        const btn = document.getElementById('battle-fight-btn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '⚔️ АТАКА!';
        }
    },
    
    gameOver: function(playerWon) {
        this.isActive = false;
        
        const resultIcon = playerWon ? '🏆' : '💀';
        const resultTitle = playerWon ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ!';
        const resultMessage = playerWon ? 
            `Вы победили ${this.enemyNft.name}! NFT добавлен в вашу коллекцию.` :
            `${this.enemyNft.name} победил вас. NFT ${this.playerNft.name} потерян.`;
        
        // Создаем оверлей результата
        const resultHTML = `
        <div class="battle-result-overlay">
            <div class="battle-result-content">
                <div class="battle-result-icon">${resultIcon}</div>
                <div class="battle-result-title ${playerWon ? 'win' : 'lose'}">${resultTitle}</div>
                <div class="battle-result-message">${resultMessage}</div>
                <button class="battle-result-btn" onclick="window.battleSystem.exit()">
                    Вернуться в меню
                </button>
            </div>
        </div>`;
        
        document.getElementById('battle-screen').innerHTML += resultHTML;
        
        this.playSound(playerWon ? 'victory' : 'defeat');
        
        // Обновляем коллекцию
        if (playerWon && window.collection) {
            window.collection.push({
                ...this.enemyNft,
                buyPrice: this.enemyNft.price || 150
            });
        } else if (!playerWon && window.collection && window.activeBattleNft) {
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
        
        if (window.updateUI) window.updateUI();
    },
    
    playSound: function(type) {
        // Звуковые эффекты (опционально)
        try {
            const sounds = {
                'battle-start': '🎵',
                'hit': '💥',
                'critical-hit': '⚡',
                'victory': '🎉',
                'defeat': '😵'
            };
            console.log(`🔊 Звук: ${sounds[type] || '🎵'} (${type})`);
        } catch (e) {
            // Игнорируем ошибки звука
        }
    },
    
    exit: function() {
        console.log('👋 Выход из битвы');
        
        // Удаляем экран битвы
        const battleScreen = document.getElementById('battle-screen');
        if (battleScreen) {
            battleScreen.style.opacity = '0';
            battleScreen.style.transform = 'scale(0.9)';
            battleScreen.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                battleScreen.remove();
            }, 300);
        }
        
        // Возвращаемся в главное меню
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));
        
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
            mainScreen.classList.add('active');
        }
        
        // Обновляем навигацию
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[0]) navItems[0].classList.add('active');
        
        // Обновляем интерфейс
        if (window.renderCenterArea) window.renderCenterArea();
        if (window.updateUI) window.updateUI();
    },
    
    // Дополнительные эффекты
    createParticles: function(x, y, color) {
        // Создаем частицы для крутых эффектов
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x + Math.random() * 40 - 20}px;
                top: ${y + Math.random() * 40 - 20}px;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 11000;
                animation: particleFade 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    },
    
    // Улучшенная анимация атаки
    animateAttack: function(attacker, target) {
        const attackerEl = document.getElementById(attacker + '-battle-img');
        const targetEl = document.getElementById(target + '-battle-img');
        
        // Анимация атакующего
        attackerEl.style.transition = 'all 0.2s ease';
        attackerEl.style.transform = 'scale(1.2) translateY(-10px)';
        attackerEl.style.filter = 'brightness(1.3)';
        
        setTimeout(() => {
            attackerEl.style.transform = 'scale(1) translateY(0)';
            attackerEl.style.filter = 'brightness(1)';
            
            // Анимация цели
            targetEl.style.transition = 'all 0.1s ease';
            targetEl.style.filter = 'brightness(1.5) hue-rotate(60deg)';
            
            setTimeout(() => {
                targetEl.style.filter = 'brightness(1)';
            }, 100);
        }, 200);
    }
};

// Совместимость с существующим кодом
window.startUndertaleBattle = function(playerNft, enemyNft) {
    return window.battleSystem.init(playerNft, enemyNft);
};

// Добавляем стили для частиц в CSS
const particleStyles = document.createElement('style');
particleStyles.textContent = `
@keyframes particleFade {
    0% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
    100% {
        opacity: 0;
        transform: scale(0.3) translateY(-50px);
    }
}
`;
document.head.appendChild(particleStyles);

console.log('✨ КРАСИВАЯ боевая система загружена!');
