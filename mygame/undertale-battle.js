// ==================== UNDERTALE BATTLE SYSTEM ====================
// Строгий черно-белый дизайн в стиле приложения

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
        this.playerDefending = false;
    }

    init(playerNft, enemyNft) {
        console.log('Инициализация битвы:', playerNft.name, 'vs', enemyNft.name);
        
        this.playerNft = {...playerNft};
        this.enemyNft = {...enemyNft};
        this.playerHP = 100;
        this.enemyHP = 100;
        this.playerMaxHP = 100;
        this.enemyMaxHP = 100;
        this.battleActive = true;
        this.currentTurn = 'player';
        this.battleLog = [];
        this.playerDefending = false;
        
        this.createBattleUI();
        this.updateDisplay();
        this.showPlayerActions();
        this.addBattleLog(`Битва началась! ${playerNft.name} против ${enemyNft.name}`);
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

                    <!-- HP врага -->
                    <div class="hp-container">
                        <div id="enemy-hp-bar" class="hp-bar"></div>
                    </div>
                    <div id="enemy-hp-text" class="hp-text">100/100 HP</div>
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
                            <button id="defend-btn" class="battle-action-btn" onclick="battleSystem.playerDefend()">
                                <i class="fas fa-shield-alt"></i>
                                БЛОК
                            </button>
                        </div>

                        <!-- ИГРОК В ЦЕНТРЕ (маленькое окно) -->
                        <div class="player-battle-area">
                            <img id="player-battle-img" class="player-battle-img" alt="Player NFT">
                            <div>
                                <div class="player-name">ВЫ</div>
                                <div class="player-hp-container">
                                    <div id="player-hp-bar" class="hp-bar"></div>
                                </div>
                                <div id="player-hp-text" class="player-hp-text">100/100 HP</div>
                            </div>
                        </div>

                        <!-- КНОПКИ СПРАВА (пустое место для симметрии) -->
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

                <!-- РЕЗУЛЬТАТ БИТВЫ (скрыт по умолчанию) -->
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
        
        console.log('UI создан');
    }

    updateDisplay() {
        // Обновляем изображения
        const playerImg = document.getElementById('player-battle-img');
        const enemyImg = document.getElementById('enemy-battle-img');
        const enemyName = document.getElementById('enemy-name');

        if (playerImg && this.playerNft) {
            playerImg.src = this.playerNft.img;
        }
        if (enemyImg && this.enemyNft) {
            enemyImg.src = this.enemyNft.img;
            enemyName.textContent = this.enemyNft.name.toUpperCase();
        }

        // Обновляем HP
        const playerHPPercent = Math.max(0, (this.playerHP / this.playerMaxHP) * 100);
        const enemyHPPercent = Math.max(0, (this.enemyHP / this.enemyMaxHP) * 100);

        const playerHPBar = document.getElementById('player-hp-bar');
        const enemyHPBar = document.getElementById('enemy-hp-bar');
        const playerHPText = document.getElementById('player-hp-text');
        const enemyHPText = document.getElementById('enemy-hp-text');

        if (playerHPBar) {
            playerHPBar.style.width = playerHPPercent + '%';
            if (this.playerHP <= 25) {
                playerHPBar.classList.add('critical');
            } else {
                playerHPBar.classList.remove('critical');
            }
        }

        if (enemyHPBar) {
            enemyHPBar.style.width = enemyHPPercent + '%';
            if (this.enemyHP <= 25) {
                enemyHPBar.classList.add('critical');
            } else {
                enemyHPBar.classList.remove('critical');
            }
        }

        if (playerHPText) {
            playerHPText.textContent = `${Math.max(0, Math.round(this.playerHP))}/${this.playerMaxHP}`;
        }
        if (enemyHPText) {
            enemyHPText.textContent = `${Math.max(0, Math.round(this.enemyHP))}/${this.enemyMaxHP}`;
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
        
        console.log('Лог добавлен:', message);
    }

    showPlayerActions() {
        const attackBtn = document.getElementById('attack-btn');
        const defendBtn = document.getElementById('defend-btn');
        
        if (!attackBtn || !defendBtn) return;
        
        if (this.currentTurn !== 'player' || !this.battleActive) {
            attackBtn.disabled = true;
            defendBtn.disabled = true;
        } else {
            attackBtn.disabled = false;
            defendBtn.disabled = false;
        }
        
        console.log('Кнопки обновлены. Ход:', this.currentTurn, 'Активна:', this.battleActive);
    }

    playerAttack() {
        if (this.currentTurn !== 'player' || !this.battleActive) {
            console.log('Атака заблокирована. Ход:', this.currentTurn, 'Активна:', this.battleActive);
            return;
        }

        console.log('Игрок атакует!');
        this.addBattleLog('Вы атакуете!');
        
        // Расчет урона
        let damage = Math.floor(Math.random() * 25) + 15; // 15-40 базового урона
        const isCrit = Math.random() < 0.15; // 15% шанс крита
        const enemyDodge = Math.random() < 0.08; // 8% шанс уклонения врага

        // Применяем апгрейды игрока
        if (this.playerNft.upgrades) {
            if (this.playerNft.upgrades.damage) {
                damage *= this.playerNft.upgrades.damage;
                console.log('Урон с апгрейдом:', damage);
            }
            if (this.playerNft.upgrades.crit && isCrit) {
                damage *= 1.3;
                console.log('Крит с апгрейдом:', damage);
            }
        }

        if (enemyDodge) {
            this.addBattleLog('Враг уклонился от атаки!');
            this.showDamageEffect(document.getElementById('enemy-battle-img'), 'МИМО', false);
        } else {
            if (isCrit) {
                damage *= 1.8;
                this.addBattleLog(`КРИТИЧЕСКИЙ УДАР! Нанесено ${Math.round(damage)} урона!`);
                this.showDamageEffect(document.getElementById('enemy-battle-img'), Math.round(damage), true);
            } else {
                this.addBattleLog(`Нанесено ${Math.round(damage)} урона`);
                this.showDamageEffect(document.getElementById('enemy-battle-img'), Math.round(damage), false);
            }
            
            this.enemyHP -= damage;
            this.enemyHP = Math.max(0, this.enemyHP);
            
            // Эффект встряски для врага
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

    playerDefend() {
        if (this.currentTurn !== 'player' || !this.battleActive) {
            console.log('Защита заблокирована. Ход:', this.currentTurn, 'Активна:', this.battleActive);
            return;
        }

        console.log('Игрок защищается!');
        this.addBattleLog('Вы приготовились к защите!');
        this.playerDefending = true;

        this.currentTurn = 'enemy';
        this.showPlayerActions();

        setTimeout(() => {
            this.enemyTurn();
        }, 1500);
    }

    enemyTurn() {
        if (this.currentTurn !== 'enemy' || !this.battleActive) {
            console.log('Ход врага заблокирован. Ход:', this.currentTurn, 'Активна:', this.battleActive);
            return;
        }

        console.log('Ход врага!');
        this.addBattleLog('Враг атакует!');

        let damage = Math.floor(Math.random() * 22) + 12; // 12-34 базового урона
        const isCrit = Math.random() < 0.12; // 12% шанс крита у врага

        // Применяем апгрейды врага (если есть)
        if (this.enemyNft.upgrades && this.enemyNft.upgrades.damage) {
            damage *= this.enemyNft.upgrades.damage;
        }

        // Проверяем уклонение игрока
        let playerDodgeChance = 0.06; // 6% базовый шанс уклонения
        if (this.playerNft.upgrades && this.playerNft.upgrades.dodge) {
            playerDodgeChance *= this.playerNft.upgrades.dodge;
        }

        const playerDodged = Math.random() < playerDodgeChance;

        if (playerDodged) {
            this.addBattleLog('Вы уклонились от атаки!');
            this.showDamageEffect(document.getElementById('player-battle-img'), 'МИМО', false);
        } else {
            // Если игрок защищался, урон уменьшается на 50%
            if (this.playerDefending) {
                damage *= 0.5;
                this.addBattleLog(`Блокировка поглотила часть урона! Получено ${Math.round(damage)} урона`);
                this.showDamageEffect(document.getElementById('player-battle-img'), Math.round(damage), false);
            } else {
                if (isCrit) {
                    damage *= 1.7;
                    this.addBattleLog(`КРИТИЧЕСКАЯ АТАКА ВРАГА! Получено ${Math.round(damage)} урона!`);
                    this.showDamageEffect(document.getElementById('player-battle-img'), Math.round(damage), true);
                } else {
                    this.addBattleLog(`Получено ${Math.round(damage)} урона`);
                    this.showDamageEffect(document.getElementById('player-battle-img'), Math.round(damage), false);
                }
            }
            
            // ИСПРАВЛЕНИЕ БАГА: применяем урон к игроку
            this.playerHP -= damage;
            this.playerHP = Math.max(0, this.playerHP);
            
            console.log('Урон игроку:', damage, 'Осталось HP:', this.playerHP);
            
            // Эффект встряски для игрока
            document.getElementById('player-battle-img').classList.add('battle-shake');
            setTimeout(() => {
                const img = document.getElementById('player-battle-img');
                if (img) img.classList.remove('battle-shake');
            }, 500);
        }

        this.playerDefending = false; // Сбрасываем защиту
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
            console.log('Игрок проиграл');
            this.battleActive = false;
            this.showBattleResult(false);
        } else if (this.enemyHP <= 0) {
            console.log('Игрок победил');
            this.battleActive = false;
            this.showBattleResult(true);
        }
    }

    showBattleResult(playerWon) {
        const resultOverlay = document.getElementById('battle-result-overlay');
        const resultTitle = document.getElementById('result-title');
        const resultDetails = document.getElementById('result-details');

        if (!resultOverlay || !resultTitle || !resultDetails) {
            console.error('Элементы результата не найдены');
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

            // Добавляем вражеский NFT в коллекцию
            if (window.collection && Array.isArray(window.collection)) {
                window.collection.push({
                    ...this.enemyNft, 
                    buyPrice: this.enemyNft.price || 100
                });
                console.log('NFT добавлен в коллекцию:', this.enemyNft.name);
            }
        } else {
            resultTitle.className = 'result-title lose';
            resultTitle.innerHTML = '💀 ПОРАЖЕНИЕ!';
            resultDetails.innerHTML = `
                <strong>Вы проиграли...</strong><br><br>
                Потерян NFT: <strong>${this.playerNft.name}</strong><br>
                <em>NFT удален из коллекции</em>
            `;

            // Удаляем NFT игрока из коллекции
            if (window.collection && Array.isArray(window.collection)) {
                const index = window.collection.findIndex(nft => 
                    nft.name === this.playerNft.name && 
                    nft.img === this.playerNft.img && 
                    nft.buyPrice === this.playerNft.buyPrice
                );
                if (index !== -1) {
                    window.collection.splice(index, 1);
                    console.log('NFT удален из коллекции:', this.playerNft.name);
                    
                    // Сбрасываем активный NFT для битвы
                    if (window.activeBattleNft) {
                        window.activeBattleNft = null;
                    }
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

        // Показываем результат
        resultOverlay.style.display = 'flex';

        // Обновляем UI и сохраняем данные
        if (window.updateUI) window.updateUI();
        if (window.saveData) {
            window.saveData();
            console.log('💾 Данные сохранены');
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
        
        // Удаляем интерфейс битвы
        const container = document.getElementById('undertale-battle-container');
        if (container) {
            container.remove();
            console.log('🗑️ Интерфейс битвы удален');
        }

        // Возвращаемся в главное меню
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
        
        console.log('✅ Возврат в главное меню завершен');
    }
}

// Создаем глобальный экземпляр
console.log('🏗️ Создание глобального экземпляра battleSystem...');
window.battleSystem = new UndertaleBattle();

// Функция для запуска битвы
window.startUndertaleBattle = function(playerNft, enemyNft) {
    console.log('🚀 === ЗАПУСК UNDERTALE БИТВЫ ===');
    console.log('👤 Игрок NFT:', {
        name: playerNft?.name,
        img: playerNft?.img?.substring(0, 50) + '...',
        upgrades: playerNft?.upgrades
    });
    console.log('🤖 Враг NFT:', {
        name: enemyNft?.name,
        img: enemyNft?.img?.substring(0, 50) + '...',
        upgrades: enemyNft?.upgrades
    });
    
    if (!playerNft || !enemyNft) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Отсутствуют данные NFT!');
        alert('Ошибка: не выбран NFT для битвы!');
        return false;
    }
    
    if (!playerNft.name || !playerNft.img) {
        console.error('❌ ОШИБКА: Некорректные данные playerNft!', playerNft);
        alert('Ошибка: некорректные данные игрока!');
        return false;
    }
    
    if (!enemyNft.name || !enemyNft.img) {
        console.error('❌ ОШИБКА: Некорректные данные enemyNft!', enemyNft);
        alert('Ошибка: некорректные данные противника!');
        return false;
    }
    
    const success = window.battleSystem.init(playerNft, enemyNft);
    console.log(success ? '✅ Битва запущена успешно!' : '❌ Ошибка запуска битвы!');
    return success;
};

// Проверка загрузки при готовности DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, проверяем Battle System...');
    console.log('✅ Undertale Battle System загружен!');
    console.log('🔧 Доступные функции:', {
        startUndertaleBattle: typeof window.startUndertaleBattle,
        battleSystem: typeof window.battleSystem,
        battleSystemInit: typeof window.battleSystem?.init
    });
});

// Дополнительная проверка через 1 секунду
setTimeout(() => {
    console.log('⏰ Финальная проверка Battle System через 1 секунду...');
    if (typeof window.startUndertaleBattle === 'function' && window.battleSystem) {
        console.log('🟢 ✅ Battle System готов к использованию!');
        console.log('📊 Статус компонентов:', {
            battleSystem: !!window.battleSystem,
            startFunction: typeof window.startUndertaleBattle,
            initMethod: typeof window.battleSystem.init,
            DOM: !!document.body
        });
    } else {
        console.error('🔴 ❌ Ошибка загрузки Battle System!');
        console.error('💥 Проблемы:', {
            battleSystem: !!window.battleSystem,
            startFunction: typeof window.startUndertaleBattle,
            window_battleSystem: window.battleSystem
        });
    }
}, 1000);();
        
        console.log('Результат битвы показан:', playerWon ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ');
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
        console.log('Завершение битвы');
        
        // Удаляем интерфейс битвы
        const container = document.getElementById('undertale-battle-container');
        if (container) {
            container.remove();
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
        if (navItems[0]) {
            navItems[0].classList.add('active');
        }

        // Обновляем отображение
        if (window.renderCenterArea) window.renderCenterArea();
        if (window.updateUI) window.updateUI();
        
        console.log('Возврат в главное меню');
    }
}

// Создаем глобальный экземпляр
window.battleSystem = new UndertaleBattle();

// Функция для запуска битвы
window.startUndertaleBattle = function(playerNft, enemyNft) {
    console.log('=== ЗАПУСК БИТВЫ ===');
    console.log('Игрок:', playerNft);
    console.log('Враг:', enemyNft);
    
    if (!playerNft || !enemyNft) {
        console.error('Ошибка: отсутствуют данные NFT для битвы');
        return;
    }
    
    window.battleSystem.init(playerNft, enemyNft);
};

// Проверка загрузки
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Undertale Battle System загружен!');
    console.log('Доступные функции:', {
        startUndertaleBattle: typeof window.startUndertaleBattle,
        battleSystem: typeof window.battleSystem
    });
});

// Дополнительная проверка через 1 секунду
setTimeout(() => {
    if (typeof window.startUndertaleBattle === 'function') {
        console.log('✅ Battle System готов к использованию');
    } else {
        console.error('❌ Ошибка загрузки Battle System');
    }
}, 1000);
