// ==================== НОВАЯ UNDERTALE BATTLE SYSTEM ====================

class NewUndertaleBattle {
    constructor() {
        this.reset();
    }

    reset() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.maxHP = 100;
        this.currentTurn = 'player';
        this.battleActive = false;
        this.playerNft = null;
        this.enemyNft = null;
        this.battleLog = [];
        this.playerDodging = false;
        this.battleContainer = null;
    }

    // Запуск новой битвы
    startBattle(playerNft, enemyNft) {
        console.log('🚀 Запуск новой битвы:', playerNft.name, 'vs', enemyNft.name);
        
        // Полный сброс состояния
        this.reset();
        
        // Инициализация данных
        this.playerNft = { ...playerNft };
        this.enemyNft = { ...enemyNft };
        this.battleActive = true;
        this.currentTurn = 'player';
        
        // Создание интерфейса
        this.buildUI();
        
        // Обновление всех элементов
        this.refreshUI();
        this.updateButtons();
        this.logMessage(`Битва началась! ${playerNft.name} против ${enemyNft.name}`);
        
        console.log('✅ Битва инициализирована');
        return true;
    }

    // Создание HTML интерфейса
    buildUI() {
        // Удаляем старый интерфейс
        const oldContainer = document.getElementById('battle-container');
        if (oldContainer) {
            oldContainer.remove();
        }

        // Создаем новый интерфейс
        const html = `
            <div id="battle-container" class="undertale-battle-container">
                <!-- ВРАГ -->
                <div class="enemy-battle-area">
                    <button class="escape-btn" onclick="newBattleSystem.escapeBattle()">
                        Сбежать (50⭐)
                    </button>

                    <img id="enemy-img" class="enemy-battle-img" alt="Enemy NFT">
                    <div id="enemy-name" class="enemy-name">ВРАГ</div>

                    <!-- HP ВРАГ -->
                    <div class="hp-container">
                        <div id="enemy-hp-bar" class="hp-bar"></div>
                    </div>
                    <div id="enemy-hp-text" class="hp-text">100/100 HP</div>
                </div>

                <!-- НИЖНЯЯ ОБЛАСТЬ -->
                <div class="battle-bottom-area">
                    <!-- ЛОГ -->
                    <div id="battle-log" class="battle-log-container"></div>

                    <!-- ДЕЙСТВИЯ -->
                    <div class="battle-actions-area">
                        <!-- КНОПКИ СЛЕВА -->
                        <div class="battle-buttons">
                            <button id="attack-button" class="battle-action-btn" onclick="newBattleSystem.attackAction()">
                                <i class="fas fa-sword"></i>
                                АТАКА
                            </button>
                            <button id="dodge-button" class="battle-action-btn" onclick="newBattleSystem.dodgeAction()">
                                <i class="fas fa-running"></i>
                                УВЕРНУТЬСЯ
                            </button>
                        </div>

                        <!-- ИГРОК В ЦЕНТРЕ -->
                        <div class="player-battle-area">
                            <img id="player-img" class="player-battle-img" alt="Player NFT">
                            <div>
                                <div class="player-name">ВЫ</div>
                                <div id="player-nft-name" class="player-nft-name">NFT NAME</div>
                                <div class="player-hp-container">
                                    <div id="player-hp-bar" class="hp-bar"></div>
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

                <!-- РЕЗУЛЬТАТ -->
                <div id="battle-result" class="battle-result-overlay" style="display: none;">
                    <div class="battle-result-modal">
                        <div id="result-title" class="result-title"></div>
                        <div id="result-details" class="result-details"></div>
                        <button class="result-back-btn" onclick="newBattleSystem.closeBattle()">
                            Вернуться в меню
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.battleContainer = document.getElementById('battle-container');
        console.log('🎨 Интерфейс создан');
    }

    // Обновление всего UI
    refreshUI() {
        this.updateImages();
        this.updateHPBars();
        this.updateHPTexts();
    }

    // Обновление изображений и имен
    updateImages() {
        const playerImg = document.getElementById('player-img');
        const enemyImg = document.getElementById('enemy-img');
        const enemyName = document.getElementById('enemy-name');
        const playerName = document.getElementById('player-nft-name');

        if (playerImg && this.playerNft) {
            playerImg.src = this.playerNft.img;
            playerImg.alt = this.playerNft.name;
        }
        
        if (enemyImg && this.enemyNft) {
            enemyImg.src = this.enemyNft.img;
            enemyImg.alt = this.enemyNft.name;
        }
        
        if (enemyName && this.enemyNft) {
            enemyName.textContent = this.enemyNft.name.toUpperCase();
        }
        
        if (playerName && this.playerNft) {
            playerName.textContent = this.playerNft.name;
        }

        console.log('🖼️ Изображения обновлены');
    }

    // КРИТИЧЕСКИ ВАЖНАЯ ФУНКЦИЯ - Обновление HP баров
    updateHPBars() {
        const playerBar = document.getElementById('player-hp-bar');
        const enemyBar = document.getElementById('enemy-hp-bar');

        if (!playerBar || !enemyBar) {
            console.error('❌ HP бары не найдены!');
            return;
        }

        // Вычисляем проценты
        const playerPercent = Math.max(0, Math.min(100, (this.playerHP / this.maxHP) * 100));
        const enemyPercent = Math.max(0, Math.min(100, (this.enemyHP / this.maxHP) * 100));

        console.log('📊 Обновление HP баров:');
        console.log('   Игрок:', this.playerHP + '/' + this.maxHP + ' (' + playerPercent.toFixed(1) + '%)');
        console.log('   Враг:', this.enemyHP + '/' + this.maxHP + ' (' + enemyPercent.toFixed(1) + '%)');

        // ПРИНУДИТЕЛЬНОЕ обновление стилей
        this.setBarWidth(playerBar, playerPercent, 'игрока');
        this.setBarWidth(enemyBar, enemyPercent, 'врага');

        // Критическое HP
        if (this.playerHP <= 25) {
            playerBar.classList.add('critical');
        } else {
            playerBar.classList.remove('critical');
        }

        if (this.enemyHP <= 25) {
            enemyBar.classList.add('critical');
        } else {
            enemyBar.classList.remove('critical');
        }

        // Дополнительная проверка через задержку
        setTimeout(() => {
            this.verifyBars(playerBar, playerPercent, 'игрока');
            this.verifyBars(enemyBar, enemyPercent, 'врага');
        }, 50);
    }

    // Установка ширины HP бара
    setBarWidth(barElement, percent, name) {
        if (!barElement) return;

        const width = percent + '%';
        
        // Множественные способы установки ширины
        barElement.style.width = width;
        barElement.style.setProperty('width', width, 'important');
        barElement.setAttribute('style', `width: ${width} !important; transition: width 0.8s ease-out;`);
        
        console.log(`✅ HP бар ${name} установлен: ${width}`);
        console.log(`   Реальный style.width: "${barElement.style.width}"`);
    }

    // Проверка корректности установки ширины
    verifyBars(barElement, expectedPercent, name) {
        if (!barElement) return;

        const currentWidth = barElement.style.width;
        const expectedWidth = expectedPercent + '%';

        if (currentWidth !== expectedWidth) {
            console.log(`⚠️ HP бар ${name} сбросился! Перестановка...`);
            console.log(`   Ожидалось: ${expectedWidth}, Реально: ${currentWidth}`);
            
            // Повторная принудительная установка
            barElement.style.removeProperty('width');
            setTimeout(() => {
                barElement.style.width = expectedWidth;
                barElement.style.setProperty('width', expectedWidth, 'important');
            }, 10);
        } else {
            console.log(`✅ HP бар ${name} корректен: ${currentWidth}`);
        }
    }

    // Обновление текста HP
    updateHPTexts() {
        const playerText = document.getElementById('player-hp-text');
        const enemyText = document.getElementById('enemy-hp-text');

        if (playerText) {
            playerText.textContent = `${Math.max(0, Math.round(this.playerHP))}/${this.maxHP} HP`;
        }

        if (enemyText) {
            enemyText.textContent = `${Math.max(0, Math.round(this.enemyHP))}/${this.maxHP} HP`;
        }
    }

    // Обновление состояния кнопок
    updateButtons() {
        const attackBtn = document.getElementById('attack-button');
        const dodgeBtn = document.getElementById('dodge-button');

        if (attackBtn && dodgeBtn) {
            const enabled = (this.currentTurn === 'player' && this.battleActive);
            attackBtn.disabled = !enabled;
            dodgeBtn.disabled = !enabled;
            
            console.log('🎮 Кнопки:', enabled ? 'включены' : 'выключены');
        }
    }

    // Добавление сообщения в лог
    logMessage(message) {
        const logContainer = document.getElementById('battle-log');
        if (!logContainer) return;

        this.battleLog.push(message);
        
        // Показываем последние 5 сообщений
        const recent = this.battleLog.slice(-5);
        logContainer.innerHTML = recent
            .map(msg => `<div style="margin-bottom: 4px; padding: 2px 0;">• ${msg}</div>`)
            .join('');
        
        logContainer.scrollTop = logContainer.scrollHeight;
        console.log('📝 Лог:', message);
    }

    // ДЕЙСТВИЕ: Атака игрока
    attackAction() {
        if (this.currentTurn !== 'player' || !this.battleActive) {
            console.log('❌ Атака недоступна');
            return;
        }

        console.log('⚔️ Атака игрока');
        this.logMessage('Вы атакуете!');

        let damage = this.calculateDamage(15, 25);
        let isCrit = Math.random() < 0.15;
        const missed = Math.random() < 0.08;

        // Апгрейды игрока
        if (this.playerNft.upgrades) {
            if (this.playerNft.upgrades.damage) {
                damage *= this.playerNft.upgrades.damage;
            }
            if (this.playerNft.upgrades.crit && Math.random() < (0.15 * this.playerNft.upgrades.crit)) {
                isCrit = true;
            }
        }

        if (missed) {
            this.logMessage('Враг уклонился от атаки!');
            this.showDamageEffect('enemy-img', 'МИМО', false);
        } else {
            if (isCrit) {
                damage *= 1.8;
                this.logMessage(`💥 КРИТИЧЕСКИЙ УДАР! Нанесено ${Math.round(damage)} урона!`);
                this.showDamageEffect('enemy-img', Math.round(damage), true);
            } else {
                this.logMessage(`Нанесено ${Math.round(damage)} урона`);
                this.showDamageEffect('enemy-img', Math.round(damage), false);
            }

            this.enemyHP -= damage;
            this.enemyHP = Math.max(0, this.enemyHP);
            this.shakeElement('enemy-img');
        }

        this.endPlayerTurn();
    }

    // ДЕЙСТВИЕ: Уклонение игрока
    dodgeAction() {
        if (this.currentTurn !== 'player' || !this.battleActive) {
            console.log('❌ Уклонение недоступно');
            return;
        }

        console.log('🏃 Подготовка к уклонению');
        this.logMessage('Вы готовитесь увернуться!');
        this.playerDodging = true;

        this.endPlayerTurn();
    }

    // Завершение хода игрока
    endPlayerTurn() {
        this.refreshUI();
        
        if (this.checkGameEnd()) {
            return;
        }

        this.currentTurn = 'enemy';
        this.updateButtons();

        setTimeout(() => {
            this.enemyTurn();
        }, 2000);
    }

    // Ход противника
    enemyTurn() {
        if (this.currentTurn !== 'enemy' || !this.battleActive) {
            console.log('❌ Ход врага недоступен');
            return;
        }

        console.log('👹 Ход врага');
        this.logMessage('Враг атакует!');

        let damage = this.calculateDamage(12, 22);
        const isCrit = Math.random() < 0.12;

        // Апгрейды врага
        if (this.enemyNft.upgrades && this.enemyNft.upgrades.damage) {
            damage *= this.enemyNft.upgrades.damage;
        }

        // Проверка уклонения игрока
        let dodgeChance = 0.06;
        if (this.playerNft.upgrades && this.playerNft.upgrades.dodge) {
            dodgeChance *= this.playerNft.upgrades.dodge;
        }
        if (this.playerDodging) {
            dodgeChance += 0.35;
        }

        const dodged = Math.random() < dodgeChance;

        if (dodged) {
            this.logMessage('Вы уклонились от атаки!');
            this.showDamageEffect('player-img', 'МИМО', false);
        } else {
            if (isCrit) {
                damage *= 1.7;
                this.logMessage(`💥 КРИТИЧЕСКАЯ АТАКА ВРАГА! Получено ${Math.round(damage)} урона!`);
                this.showDamageEffect('player-img', Math.round(damage), true);
            } else {
                this.logMessage(`Получено ${Math.round(damage)} урона`);
                this.showDamageEffect('player-img', Math.round(damage), false);
            }

            this.playerHP -= damage;
            this.playerHP = Math.max(0, this.playerHP);
            this.shakeElement('player-img');
            
            console.log('💔 Урон игроку:', Math.round(damage), 'HP осталось:', this.playerHP);
        }

        this.playerDodging = false;
        this.endEnemyTurn();
    }

    // Завершение хода врага
    endEnemyTurn() {
        this.refreshUI();
        
        if (this.checkGameEnd()) {
            return;
        }

        this.currentTurn = 'player';
        
        setTimeout(() => {
            this.updateButtons();
            this.logMessage('Ваш ход!');
        }, 1800);
    }

    // Расчет урона
    calculateDamage(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Проверка окончания игры
    checkGameEnd() {
        if (this.playerHP <= 0) {
            this.endGame(false);
            return true;
        } else if (this.enemyHP <= 0) {
            this.endGame(true);
            return true;
        }
        return false;
    }

    // Окончание игры
    endGame(playerWon) {
        console.log('🎯 Конец игры:', playerWon ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ');
        this.battleActive = false;
        this.updateButtons();

        const resultOverlay = document.getElementById('battle-result');
        const resultTitle = document.getElementById('result-title');
        const resultDetails = document.getElementById('result-details');

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
                const newNft = { ...this.enemyNft, buyPrice: this.enemyNft.price || 150 };
                window.collection.push(newNft);
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
                    if (window.activeBattleNft) {
                        window.activeBattleNft = null;
                    }
                }
            }
        }

        // Добавляем в историю
        if (window.battleHistory && Array.isArray(window.battleHistory)) {
            window.battleHistory.push({
                playerNft: { ...this.playerNft },
                opponentNft: { ...this.enemyNft },
                won: playerWon,
                timestamp: new Date().toISOString()
            });
        }

        resultOverlay.style.display = 'flex';

        // Обновляем и сохраняем
        if (window.updateUI) window.updateUI();
        if (window.saveData) {
            setTimeout(() => window.saveData(), 500);
        }
    }

    // Показать эффект урона
    showDamageEffect(targetId, damage, isCrit = false) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const effect = document.createElement('div');
        effect.className = `damage-effect ${isCrit ? 'crit' : ''}`;
        effect.textContent = damage;
        effect.style.position = 'absolute';
        effect.style.top = '50%';
        effect.style.left = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';

        target.style.position = 'relative';
        target.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1200);
    }

    // Эффект тряски
    shakeElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.classList.add('battle-shake');
        setTimeout(() => {
            element.classList.remove('battle-shake');
        }, 500);
    }

    // Побег из битвы
    escapeBattle() {
        if (window.stars < 50) {
            this.logMessage('Недостаточно звёзд для побега! (нужно 50)');
            return;
        }

        window.stars -= 50;
        this.logMessage('Вы сбежали из боя! Потеряно 50 звёзд.');

        if (window.updateUI) window.updateUI();
        if (window.saveData) window.saveData();

        setTimeout(() => {
            this.closeBattle();
        }, 1500);
    }

    // Закрытие битвы
    closeBattle() {
        console.log('🚪 Закрытие битвы');

        if (this.battleContainer) {
            this.battleContainer.remove();
            this.battleContainer = null;
        }

        // Возврат в главное меню
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
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

        console.log('✅ Возврат в меню завершен');
    }
}

// Создаем глобальный экземпляр новой системы
window.newBattleSystem = new NewUndertaleBattle();

// Функция запуска для интеграции со старым кодом
window.startUndertaleBattle = function(playerNft, enemyNft) {
    console.log('🚀 === ЗАПУСК НОВОЙ BATTLE СИСТЕМЫ ===');
    
    if (!playerNft || !enemyNft) {
        console.error('❌ Отсутствуют данные NFT!');
        alert('Ошибка: не выбран NFT для битвы!');
        return false;
    }
    
    const success = window.newBattleSystem.startBattle(playerNft, enemyNft);
    console.log(success ? '✅ Битва запущена!' : '❌ Ошибка запуска!');
    return success;
};

// Совместимость со старой системой
window.battleSystem = {
    init: function(playerNft, enemyNft) {
        return window.newBattleSystem.startBattle(playerNft, enemyNft);
    }
};

console.log('✅ Новая Battle System загружена!');
