// ==================== UNDERTALE BATTLE SYSTEM (НОВАЯ HP СИСТЕМА) ====================

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
                <!-- ВРАГ - большая область сверху -->
                <div class="enemy-battle-area">
                    <button class="escape-btn" onclick="battleSystem.attemptEscape()">
                        Сбежать (50⭐)
                    </button>

                    <img id="enemy-battle-img" class="enemy-battle-img" alt="Enemy NFT">
                    <div id="enemy-name" class="enemy-name">ВРАГ</div>

                    <!-- HP врага - НОВАЯ СИСТЕМА -->
                    <div class="battle-hp-container enemy-hp-container">
                        <div id="enemy-hp-bar" class="battle-hp-bar"></div>
                    </div>
                    <div id="enemy-hp-text" class="battle-hp-text">100/100 HP</div>
                </div>

                <!-- НИЖНЯЯ ОБЛАСТЬ -->
                <div class="battle-bottom-area">
                    <!-- ЛОГ БОЯ -->
                    <div id="battle-log-container" class="battle-log-container"></div>

                    <!-- ОБЛАСТЬ ДЕЙСТВИЙ -->
                    <div class="battle-actions-area">
                        <!-- КНОПКИ СЛЕВА -->
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

                        <!-- ИГРОК В ЦЕНТРЕ -->
                        <div class="player-battle-area">
                            <img id="player-battle-img" class="player-battle-img" alt="Player NFT">
                            <div>
                                <div class="player-name">ВЫ</div>
                                <div id="player-nft-name" class="player-nft-name">NFT NAME</div>
                                <!-- HP игрока - НОВАЯ СИСТЕМА -->
                                <div class="battle-hp-container player-hp-container">
                                    <div id="player-hp-bar" class="battle-hp-bar"></div>
                                </div>
                            </div>
                            <div id="player-hp-text" class="player-hp-text">100/100 HP</div>
                        </div>

                        <!-- КНОПКИ СПРАВА -->
                        <div class="battle-buttons">
                            <div style="flex: 1; opacity: 0.3; background: #1a1a1a; border: 2px dashed #333333; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #666666; font-size: 12px;">
                                Резерв
                            </div>
                            <div style="flex: 1; opacity: 0.3; background: #1a1a1a; border: 2px dashed #333333; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #666666; font-size: 12px;">
                                Резерв
                            </div>
                        </div>
                    </div>
                </div>

                <!-- РЕЗУЛЬТАТ БИТВЫ -->
                <div id="battle-result-overlay" class="battle-result-overlay" style="display: none;">
                    <div class="battle-result-modal">
                        <div id="result-title" class="result-title"></div>
                        <div id="result-details" class="result-details"></div>
                        <button class="result-back-btn" onclick="battleSystem.endBattle()">
                            Вернуться в меню
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', battleHTML);
        console.log('✅ UI создан');
    }

    // === НОВЫЙ МЕТОД ОБНОВЛЕНИЯ HP БАРОВ ===
    updateHPBar(barId, currentHP, maxHP) {
        const bar = document.getElementById(barId);
        if (!bar) {
            console.error(`❌ HP бар ${barId} не найден`);
            return false;
        }

        const percent = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
    
    // Добавь лог для отладки — проверь в консоли, вызывается ли для 'player-hp-bar'
        console.log(`🔧 Обновление ${barId}: ${currentHP}/${maxHP} = ${percent.toFixed(1)}%`);

    // Упрощаем: устанавливаем только ширину, остальное берём из CSS
        bar.style.width = percent + '%';  // Без !important и перезаписи всего стиля

    // Управляем критическим состоянием через класс (CSS сам обработает background и анимацию)
        if (currentHP <= 25) {
            bar.classList.add('critical');
        } else {
            bar.classList.remove('critical');
        }

    // Принудительный reflow для браузера (если анимация не срабатывает)
        bar.offsetWidth;  // Это заставит браузер перерендерить элемент

        return true;
    }
        // Дополнительная проверка через 50мс
        setTimeout(() => {
            if (bar.style.width !== `${percent}%`) {
                console.warn(`⚠️ Дополнительное обновление ${barId}`);
                bar.setAttribute('style', `width: ${percent}% !important; transition: width 0.8s ease-out !important; height: 100% !important; background: linear-gradient(90deg, #d32f2f 0%, #f44336 100%) !important; position: relative !important;`);
                bar.offsetWidth;
            }
        }, 50);

        return true;
    }

    updateDisplay() {
        console.log('🔄 Обновление отображения. Игрок HP:', this.playerHP, 'Враг HP:', this.enemyHP);
        
        // Обновляем изображения и названия
        const playerImg = document.getElementById('player-battle-img');
        const enemyImg = document.getElementById('enemy-battle-img');
        const enemyName = document.getElementById('enemy-name');
        const playerNftName = document.getElementById('player-nft-name');

        if (playerImg && this.playerNft) {
            playerImg.src = this.playerNft.img;
            playerImg.alt = this.playerNft.name;
        }
        if (enemyImg && this.enemyNft) {
            enemyImg.src = this.enemyNft.img;
            enemyImg.alt = this.enemyNft.name;
            enemyName.textContent = this.enemyNft.name.toUpperCase();
        }
        if (playerNftName && this.playerNft) {
            playerNftName.textContent = this.playerNft.name;
        }

        // === ОБНОВЛЯЕМ HP БАРЫ НОВЫМ МЕТОДОМ ===
        this.updateHPBar('player-hp-bar', this.playerHP, this.playerMaxHP);
        this.updateHPBar('enemy-hp-bar', this.enemyHP, this.enemyMaxHP);

        // Обновляем текст HP
        const playerHPText = document.getElementById('player-hp-text');
        const enemyHPText = document.getElementById('enemy-hp-text');

        if (playerHPText) {
            const displayPlayerHP = Math.max(0, Math.round(this.playerHP));
            playerHPText.textContent = `${displayPlayerHP}/${this.playerMaxHP} HP`;
            console.log('✅ Обновлен текст HP игрока:', displayPlayerHP + '/' + this.playerMaxHP);
        }
        if (enemyHPText) {
            const displayEnemyHP = Math.max(0, Math.round(this.enemyHP));
            enemyHPText.textContent = `${displayEnemyHP}/${this.enemyMaxHP} HP`;
        }
    }

    addBattleLog(message) {
        const logContainer = document.getElementById('battle-log-container');
        if (!logContainer) return;

        this.battleLog.push(message);

        // Показываем только последние 5 сообщений
        const recentLogs = this.battleLog.slice(-5);
        logContainer.innerHTML = recentLogs
            .map(log => `<div style="margin-bottom: 4px; padding: 2px 0;">• ${log}</div>`)
            .join('');
        
        // Прокручиваем вниз
        logContainer.scrollTop = logContainer.scrollHeight;
        
        console.log('📝 Лог добавлен:', message);
    }

    showPlayerActions() {
        const attackBtn = document.getElementById('attack-btn');
        const dodgeBtn = document.getElementById('dodge-btn');
        
        if (!attackBtn || !dodgeBtn) return;
        
        if (this.currentTurn !== 'player' || !this.battleActive) {
            attackBtn.disabled = true;
            dodgeBtn.disabled = true;
        } else {
            attackBtn.disabled = false;
            dodgeBtn.disabled = false;
        }
        
        console.log('🎮 Кнопки обновлены. Ход:', this.currentTurn, 'Активна:', this.battleActive);
    }

    playerAttack() {
        if (this.currentTurn !== 'player' || !this.battleActive) {
            console.log('❌ Атака заблокирована');
            return;
        }

        console.log('⚔️ Игрок атакует!');
        this.addBattleLog('Вы атакуете!');
        
        let damage = Math.floor(Math.random() * 25) + 15;
        let isCrit = Math.random() < 0.15;
        const enemyDodge = Math.random() < 0.08;

        // Применяем апгрейды игрока
        if (this.playerNft.upgrades) {
            if (this.playerNft.upgrades.damage) {
                damage *= this.playerNft.upgrades.damage;
            }
            if (this.playerNft.upgrades.crit) {
                const critMultiplier = this.playerNft.upgrades.crit;
                if (Math.random() < (0.15 * critMultiplier)) {
                    isCrit = true;
                }
            }
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
            
            document.getElementById('enemy-battle-img').classList.add('battle-shake');
            setTimeout(() => {
                const img = document.getElementById('enemy-battle-img');
                if (img) img.classList.remove('battle-shake');
            }, 500);
        }

        this.updateDisplay();
        this.checkBattleEnd();

        if (this.battleActive) {
            this.currentTurn = 'enemy';
            this.showPlayerActions();
            
            setTimeout(() => {
                this.enemyTurn();
            }, 2000);
        }
    }

    playerDodge() {
        if (this.currentTurn !== 'player' || !this.battleActive) {
            console.log('❌ Уклонение заблокировано');
            return;
        }

        console.log('🏃 Игрок готовится к уклонению!');
        this.addBattleLog('Вы готовитесь увернуться!');
        this.playerDodging = true;

        this.currentTurn = 'enemy';
        this.showPlayerActions();

        setTimeout(() => {
            this.enemyTurn();
        }, 1500);
    }

    enemyTurn() {
        if (this.currentTurn !== 'enemy' || !this.battleActive) {
            console.log('❌ Ход врага заблокирован');
            return;
        }

        console.log('👹 Ход врага!');
        this.addBattleLog('Враг атакует!');

        let damage = Math.floor(Math.random() * 22) + 12;
        const isCrit = Math.random() < 0.12;

        // Применяем апгрейды врага
        if (this.enemyNft.upgrades && this.enemyNft.upgrades.damage) {
            damage *= this.enemyNft.upgrades.damage;
        }

        // Проверяем уклонение игрока
        let playerDodgeChance = 0.06;
        if (this.playerNft.upgrades && this.playerNft.upgrades.dodge) {
            playerDodgeChance *= this.playerNft.upgrades.dodge;
        }

        // Если игрок использовал уклонение
        if (this.playerDodging) {
            playerDodgeChance += 0.35;
        }

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
            
            console.log('💔 Урон игроку:', damage, 'Осталось HP:', this.playerHP);
            
            document.getElementById('player-battle-img').classList.add('battle-shake');
            setTimeout(() => {
                const img = document.getElementById('player-battle-img');
                if (img) img.classList.remove('battle-shake');
            }, 500);
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

    checkBattleEnd() {
        if (this.playerHP <= 0) {
            console.log('💀 Игрок проиграл');
            this.battleActive = false;
            this.showBattleResult(false);
        } else if (this.enemyHP <= 0) {
            console.log('🏆 Игрок победил');
            this.battleActive = false;
            this.showBattleResult(true);
        }
    }

    showBattleResult(playerWon) {
        const resultOverlay = document.getElementById('battle-result-overlay');
        const resultTitle = document.getElementById('result-title');
        const resultDetails = document.getElementById('result-details');

        if (!resultOverlay || !resultTitle || !resultDetails) {
            console.error('❌ Элементы результата не найдены');
            return;
        }

        if (playerWon) {
            resultTitle.className = 'result-title win';
            resultTitle.innerHTML = '🏆 ПОБЕДА!';
            resultDetails.innerHTML = `
                <strong>Вы победили!</strong><br><br>
                Получен NFT: <strong>${this.enemyNft.name}</strong><br>
                <em>NFT добавлен в вашу коллекцию</em>
            `;

            // Добавляем NFT в коллекцию
            if (window.collection && Array.isArray(window.collection)) {
                const newNft = {
                    ...this.enemyNft, 
                    buyPrice: this.enemyNft.price || 150
                };
                window.collection.push(newNft);
                console.log('✅ NFT добавлен в коллекцию:', this.enemyNft.name);
                console.log('📊 Размер коллекции:', window.collection.length);
            } else {
                console.error('❌ Коллекция не найдена или не является массивом');
            }
        } else {
            resultTitle.className = 'result-title lose';
            resultTitle.innerHTML = '💀 ПОРАЖЕНИЕ!';
            resultDetails.innerHTML = `
                <strong>Вы проиграли...</strong><br><br>
                Потерян NFT: <strong>${this.playerNft.name}</strong><br>
                <em>NFT удален из коллекции</em>
            `;

            // Удаляем NFT из коллекции
            if (window.collection && Array.isArray(window.collection)) {
                const index = window.collection.findIndex(nft => 
                    nft.name === this.playerNft.name && 
                    nft.img === this.playerNft.img && 
                    nft.buyPrice === this.playerNft.buyPrice
                );
                
                if (index !== -1) {
                    window.collection.splice(index, 1);
                    console.log('❌ NFT удален из коллекции:', this.playerNft.name);
                    console.log('📊 Размер коллекции:', window.collection.length);
                    
                    // Сбрасываем активный NFT
                    if (window.activeBattleNft) {
                        window.activeBattleNft = null;
                    }
                } else {
                    console.error('❌ NFT не найден в коллекции для удаления');
                }
            }
        }

        // Добавляем в историю битв
        if (window.battleHistory && Array.isArray(window.battleHistory)) {
            window.battleHistory.push({
                playerNft: {...this.playerNft},
                opponentNft: {...this.enemyNft},
                won: playerWon,
                timestamp: new Date().toISOString()
            });
        }

        resultOverlay.style.display = 'flex';

        // Обновляем UI и сохраняем
        if (window.updateUI) {
            window.updateUI();
        }
        if (window.saveData) {
            setTimeout(() => {
                window.saveData();
                console.log('💾 Данные сохранены');
            }, 500);
        }
        
        console.log('🎉 Результат битвы показан:', playerWon ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ');
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
        
        setTimeout(() => {
            this.endBattle();
        }, 1500);
    }

    endBattle() {
        console.log('🚪 Завершение битвы');
        
        const container = document.getElementById('undertale-battle-container');
        if (container) {
            container.remove();
            console.log('🗑️ Интерфейс битвы удален');
        }

        // Возврат в главное меню
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));
        
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
            mainScreen.classList.add('active');
            console.log('🏠 Возврат в главное меню');
        }

        // Обновляем навигацию
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[0]) {
            navItems[0].classList.add('active');
        }

        // Обновляем отображение
        if (window.renderCenterArea) {
            window.renderCenterArea();
            console.log('🖼️ Центральная область обновлена');
        }
        if (window.updateUI) {
            window.updateUI();
            console.log('🔄 UI обновлен');
        }
        
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

