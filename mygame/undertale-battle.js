// ==================== UNDERTALE BATTLE SYSTEM (ИСПРАВЛЕННАЯ ВЕРСИЯ HP) ====================

class BattleSystem {
    constructor() {
        this.reset();
    }

    // Сброс всех данных битвы
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
        this.elements = {}; // Кэш DOM элементов
    }

    // Инициализация битвы
    init(playerNft, enemyNft) {
        console.log('🚀 Инициализация битвы:', playerNft.name, 'vs', enemyNft.name);
        
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

    // Создание UI интерфейса
    createUI() {
        // Удаляем старый интерфейс
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
                                <div id="player-hp-text" class="player-hp-text">100/100 HP</div>
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

    // Кэширование DOM элементов для производительности
    cacheElements() {
        this.elements = {
            // Изображения
            playerImg: document.getElementById('player-battle-img'),
            enemyImg: document.getElementById('enemy-battle-img'),
            
            // Текст
            enemyName: document.getElementById('enemy-name'),
            playerNftName: document.getElementById('player-nft-name'),
            playerHPText: document.getElementById('player-hp-text'),
            enemyHPText: document.getElementById('enemy-hp-text'),
            
            // HP бары
            playerHPBar: document.getElementById('player-hp-bar'),
            enemyHPBar: document.getElementById('enemy-hp-bar'),
            
            // Кнопки
            attackBtn: document.getElementById('attack-btn'),
            dodgeBtn: document.getElementById('dodge-btn'),
            escapeBtn: document.getElementById('escape-btn'),
            resultBackBtn: document.getElementById('result-back-btn'),
            
            // Контейнеры
            battleLog: document.getElementById('battle-log-container'),
            resultOverlay: document.getElementById('battle-result-overlay'),
            resultTitle: document.getElementById('result-title'),
            resultDetails: document.getElementById('result-details')
        };
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        this.elements.attackBtn.addEventListener('click', () => this.playerAttack());
        this.elements.dodgeBtn.addEventListener('click', () => this.playerDodge());
        this.elements.escapeBtn.addEventListener('click', () => this.attemptEscape());
        this.elements.resultBackBtn.addEventListener('click', () => this.endBattle());
    }

    // === HP SYSTEM (ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ СИСТЕМА) ===
    updateHPBar(barElement, currentHP, maxHP, isPlayer = false) {
        if (!barElement) {
            console.error('❌ HP бар не найден');
            return false;
        }

        // Убеждаемся что HP не отрицательное и округляем
        currentHP = Math.max(0, Math.round(currentHP));
        const percent = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
        
        console.log(`🔧 Обновление HP бара (${isPlayer ? 'ИГРОК' : 'ВРАГ'}): ${currentHP}/${maxHP} = ${percent.toFixed(1)}%`);

        // Определяем класс CSS для цвета
        barElement.className = 'battle-hp-bar'; // Сбрасываем классы
        
        if (percent > 50) {
            barElement.classList.add('healthy');
        } else if (percent > 25) {
            barElement.classList.add('damaged');
        } else {
            barElement.classList.add('critical');
        }

        // ВАЖНО! Устанавливаем ширину напрямую через style
        barElement.style.width = `${percent}%`;
        
        // Логируем для отладки
        if (isPlayer) {
            console.log(`✅ HP бар ИГРОКА: ширина установлена на ${percent}%`);
            console.log(`   Реальная ширина: ${barElement.offsetWidth}px из ${barElement.parentElement.offsetWidth}px`);
        }
        
        return true;
    }

    // НОВАЯ система обновления HP
    updateHPBars() {
        console.log('🔄 === НАЧАЛО ОБНОВЛЕНИЯ HP БАРОВ ===');
        console.log(`   Текущее HP: Игрок=${this.playerHP}, Враг=${this.enemyHP}`);
        
        // Обновляем HP бары
        const playerSuccess = this.updateHPBar(this.elements.playerHPBar, this.playerHP, this.maxHP, true);
        const enemySuccess = this.updateHPBar(this.elements.enemyHPBar, this.enemyHP, this.maxHP, false);

        // Обновляем текстовые значения HP
        this.updateHPTexts();

        console.log(`🔄 === КОНЕЦ ОБНОВЛЕНИЯ HP БАРОВ ===`);
        return playerSuccess && enemySuccess;
    }

    // Отдельная функция для обновления текста HP
    updateHPTexts() {
        if (this.elements.playerHPText) {
            const displayPlayerHP = Math.max(0, Math.round(this.playerHP));
            this.elements.playerHPText.textContent = `${displayPlayerHP}/${this.maxHP} HP`;
            console.log(`📝 Текст HP игрока: ${displayPlayerHP}/${this.maxHP}`);
        }
        
        if (this.elements.enemyHPText) {
            const displayEnemyHP = Math.max(0, Math.round(this.enemyHP));
            this.elements.enemyHPText.textContent = `${displayEnemyHP}/${this.maxHP} HP`;
            console.log(`📝 Текст HP врага: ${displayEnemyHP}/${this.maxHP}`);
        }
    }

    // Обновление всего дисплея
    updateDisplay() {
        console.log('🔄 Обновление отображения');
        
        // Обновляем изображения и названия
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

        // Обновляем HP с принудительным обновлением
        this.forceUpdateHP();

        // Обновляем состояние кнопок
        this.updateActionButtons();
    }

    // НОВАЯ функция принудительного обновления HP
    forceUpdateHP() {
        console.log('💪 ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ HP');
        
        // Немедленное обновление HP баров
        this.updateHPBars();
        
        // Дополнительное обновление через микро-задачу
        Promise.resolve().then(() => {
            this.updateHPBars();
        });
        
        // И еще одно через setTimeout для гарантии
        setTimeout(() => {
            this.updateHPBars();
        }, 50);
    }

    // Обновление состояния кнопок действий
    updateActionButtons() {
        const canAct = this.currentTurn === 'player' && this.isActive;
        
        this.elements.attackBtn.disabled = !canAct;
        this.elements.dodgeBtn.disabled = !canAct;
        
        console.log('🎮 Кнопки обновлены. Ход:', this.currentTurn, 'Активна:', this.isActive);
    }

    // Добавление сообщения в лог
    addLog(message) {
        if (!this.elements.battleLog) return;

        this.battleLog.push(message);

        // Показываем только последние 5 сообщений
        const recentLogs = this.battleLog.slice(-5);
        this.elements.battleLog.innerHTML = recentLogs
            .map(log => `<div style="margin-bottom: 4px; padding: 2px 0;">• ${log}</div>`)
            .join('');
        
        // Прокручиваем вниз
        this.elements.battleLog.scrollTop = this.elements.battleLog.scrollHeight;
        
        console.log('📝 Лог добавлен:', message);
    }

    // === COMBAT SYSTEM ===
    
    // Атака игрока
    playerAttack() {
        if (!this.canPlayerAct()) {
            console.log('❌ Атака заблокирована');
            return;
        }

        console.log('⚔️ Игрок атакует!');
        this.addLog('Вы атакуете!');
        
        const attackResult = this.calculateDamage(true);
        this.applyAttackResult(attackResult, true);
        
        this.endPlayerTurn();
    }

    // Уклонение игрока
    playerDodge() {
        if (!this.canPlayerAct()) {
            console.log('❌ Уклонение заблокировано');
            return;
        }

        console.log('🏃 Игрок готовится к уклонению!');
        this.addLog('Вы готовитесь увернуться!');
        this.playerDodging = true;
        
        this.endPlayerTurn();
    }

    // Проверка возможности действий игрока
    canPlayerAct() {
        return this.currentTurn === 'player' && this.isActive;
    }

    // Завершение хода игрока
    endPlayerTurn() {
        this.currentTurn = 'enemy';
        this.updateActionButtons();
        
        setTimeout(() => {
            if (this.isActive) {
                this.enemyTurn();
            }
        }, 2000);
    }

    // Ход врага
    enemyTurn() {
        if (this.currentTurn !== 'enemy' || !this.isActive) {
            console.log('❌ Ход врага заблокирован');
            return;
        }

        console.log('=== НАЧАЛО ХОДА ВРАГА ===');
        console.log('👹 HP игрока ДО атаки:', this.playerHP);
        
        this.addLog('Враг атакует!');

        const attackResult = this.calculateDamage(false);
        this.applyAttackResult(attackResult, false);

        this.endEnemyTurn();
    }

    // Завершение хода врага
    endEnemyTurn() {
        this.playerDodging = false;
        
        console.log('👹 HP игрока ПОСЛЕ атаки:', this.playerHP);

        // КРИТИЧЕСКИ ВАЖНО: принудительно обновляем HP после атаки
        this.forceUpdateHP();

        // Проверяем окончание битвы
        setTimeout(() => {
            this.checkBattleEnd();
        }, 500);

        if (this.isActive) {
            this.currentTurn = 'player';
            setTimeout(() => {
                this.updateActionButtons();
                this.addLog('Ваш ход!');
            }, 1800);
        }
    }

    // Расчет урона
    calculateDamage(isPlayerAttack) {
        const attacker = isPlayerAttack ? this.playerNft : this.enemyNft;
        const defender = isPlayerAttack ? this.enemyNft : this.playerNft;
        const targetHP = isPlayerAttack ? this.enemyHP : this.playerHP;

        // Базовые параметры
        let damage = isPlayerAttack ? 
            Math.floor(Math.random() * 25) + 15 : 
            Math.floor(Math.random() * 22) + 12;

        const isLowHP = targetHP <= 25;
        let critChance = isLowHP ? 0.3 : (isPlayerAttack ? 0.15 : 0.12);
        let dodgeChance = 0.08;

        // Применяем апгрейды атакующего
        if (attacker.upgrades) {
            if (attacker.upgrades.damage) {
                damage *= attacker.upgrades.damage;
            }
            if (attacker.upgrades.crit) {
                critChance *= attacker.upgrades.crit;
            }
        }

        // Применяем апгрейды защищающегося
        if (defender.upgrades && defender.upgrades.dodge) {
            dodgeChance *= defender.upgrades.dodge;
        }

        // Специальный случай: игрок использовал уклонение
        if (!isPlayerAttack && this.playerDodging) {
            dodgeChance += 0.35;
        }

        // Балансировка для бота
        if (!isPlayerAttack) {
            damage *= 1.15; // Бот наносит больше урона
        } else {
            damage *= 0.90; // Игрок наносит меньше урона
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

    // Применение результата атаки
    applyAttackResult(result, isPlayerAttack) {
        const targetImg = isPlayerAttack ? this.elements.enemyImg : this.elements.playerImg;
        const { damage, isCritical, isMiss } = result;

        console.log(`💥 Применение атаки: урон=${damage}, крит=${isCritical}, промах=${isMiss}, атакует_игрок=${isPlayerAttack}`);

        if (isMiss) {
            if (isPlayerAttack) {
                this.addLog('Промах! Ваша атака не попала в цель!');
            } else {
                this.addLog('Уклонение! Вы избежали атаки оппонента!');
            }
            this.showDamageEffect(targetImg, 'МИМО', false);
        } else {
            // Применяем урон
            if (isPlayerAttack) {
                const oldHP = this.enemyHP;
                this.enemyHP = Math.max(0, this.enemyHP - damage);
                console.log(`⚔️ Урон врагу: ${oldHP} -> ${this.enemyHP} (урон: ${damage})`);
                
                if (isCritical) {
                    this.addLog(`💥 КРИТИЧЕСКИЙ УДАР! Вы наносите ${damage} урона оппоненту!`);
                } else {
                    this.addLog(`Вы наносите ${damage} урона оппоненту!`);
                }
            } else {
                const oldHP = this.playerHP;
                this.playerHP = Math.max(0, this.playerHP - damage);
                console.log(`💀 Урон игроку: ${oldHP} -> ${this.playerHP} (урон: ${damage})`);
                
                if (isCritical) {
                    this.addLog(`💥 КРИТИЧЕСКАЯ АТАКА ОППОНЕНТА! Вы получаете ${damage} урона!`);
                } else {
                    this.addLog(`Оппонент наносит вам ${damage} урона!`);
                }
            }

            this.showDamageEffect(targetImg, damage, isCritical);
            this.addShakeEffect(targetImg);
        }

        // КРИТИЧЕСКИ ВАЖНО: немедленно обновляем HP бары после урона
        console.log('🚨 НЕМЕДЛЕННОЕ ОБНОВЛЕНИЕ HP ПОСЛЕ УРОНА');
        this.forceUpdateHP();

        // Проверка критического состояния
        if ((this.playerHP <= 15 || this.enemyHP <= 15) && this.playerHP > 0 && this.enemyHP > 0) {
            setTimeout(() => {
                this.addLog('Критическое состояние! Следующий удар может быть решающим!');
            }, 1000);
        }
    }

    // Эффект урона
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

    // Эффект тряски
    addShakeEffect(element) {
        element.classList.add('battle-shake');
        setTimeout(() => {
            element.classList.remove('battle-shake');
        }, 500);
    }

    // Проверка окончания битвы
    checkBattleEnd() {
        console.log('🏁 Проверка конца битвы. Игрок HP:', this.playerHP, 'Враг HP:', this.enemyHP);
        
        if (this.playerHP <= 0) {
            console.log('💀 Игрок проиграл');
            this.isActive = false;
            setTimeout(() => this.showResult(false), 1000);
        } else if (this.enemyHP <= 0) {
            console.log('🏆 Игрок победил');
            this.isActive = false;
            setTimeout(() => this.showResult(true), 1000);
        }
    }

    // Показ результата битвы
    showResult(playerWon) {
        if (!this.elements.resultOverlay || !this.elements.resultTitle || !this.elements.resultDetails) {
            console.error('❌ Элементы результата не найдены');
            return;
        }

        if (playerWon) {
            this.elements.resultTitle.className = 'result-title win';
            this.elements.resultTitle.innerHTML = '🏆 ПОБЕДА!';
            this.elements.resultDetails.innerHTML = `
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
            }
        } else {
            this.elements.resultTitle.className = 'result-title lose';
            this.elements.resultTitle.innerHTML = '💀 ПОРАЖЕНИЕ!';
            this.elements.resultDetails.innerHTML = `
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
                    
                    // Сбрасываем активный NFT
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

        this.elements.resultOverlay.style.display = 'flex';

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

    // Попытка побега
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

    // Завершение битвы
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
        }
        if (window.updateUI) {
            window.updateUI();
        }
        
        console.log('✅ Возврат завершен');
    }
}

// Создаем глобальный экземпляр
window.battleSystem = new BattleSystem();

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

// Финальная проверка
setTimeout(() => {
    if (typeof window.startUndertaleBattle === 'function' && window.battleSystem) {
        console.log('🟢 ✅ Battle System готов!');
    } else {
        console.error('🔴 ❌ Ошибка загрузки Battle System!');
    }
}, 1000);
