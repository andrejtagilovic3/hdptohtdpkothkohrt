// ==================== undertale-battle.js ====================

class UndertaleBattle {
    constructor() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.playerMaxHP = 100;
        this.enemyMaxHP = 100;
        this.currentTurn = 'player';
        this.battlePhase = 'menu'; // 'menu', 'attack', 'defend', 'enemy_turn'
        this.battleActive = false;
        this.playerNft = null;
        this.enemyNft = null;
        this.battleContainer = null;
        this.actionButtons = null;
        this.battleLog = [];
    }

    init(playerNft, enemyNft) {
        this.playerNft = playerNft;
        this.enemyNft = enemyNft;
        this.playerHP = 100;
        this.enemyHP = 100;
        this.battleActive = true;
        this.currentTurn = 'player';
        this.battlePhase = 'menu';
        this.battleLog = [];
        
        this.createBattleUI();
        this.updateDisplay();
        this.showPlayerActions();
    }

    createBattleUI() {
        // Убираем старый интерфейс если есть
        const existing = document.getElementById('undertale-battle-container');
        if (existing) existing.remove();

        const battleHTML = `
            <div id="undertale-battle-container" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #000;
                color: #fff;
                font-family: monospace;
                display: flex;
                flex-direction: column;
                z-index: 9999;
            ">
                <!-- Верхняя панель с кнопкой побега -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 20px;
                    border-bottom: 2px solid #333;
                    background: #111;
                ">
                    <div style="color: #fff; font-size: 18px; font-weight: bold;">⚔️ ДУЭЛЬ</div>
                    <button id="escape-btn" style="
                        background: #d32f2f;
                        border: 2px solid #fff;
                        color: #fff;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: monospace;
                        font-weight: bold;
                        font-size: 14px;
                    ">СБЕЖАТЬ (50⭐)</button>
                </div>

                <!-- HP области -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 20px;
                    background: #111;
                ">
                    <!-- HP игрока (синий) -->
                    <div style="
                        border: 3px solid #2196f3;
                        background: rgba(33, 150, 243, 0.1);
                        padding: 15px;
                        border-radius: 12px;
                        min-width: 45%;
                    ">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <img id="player-battle-img" style="
                                width: 50px;
                                height: 50px;
                                border-radius: 8px;
                                margin-right: 12px;
                                border: 2px solid #2196f3;
                                object-fit: cover;
                            ">
                            <div>
                                <div style="font-weight: bold; color: #2196f3; font-size: 16px;">ВЫ</div>
                                <div id="player-hp-text" style="font-size: 14px; color: #ccc;">100/100 HP</div>
                            </div>
                        </div>
                        <div style="background: #000; border-radius: 6px; height: 16px; overflow: hidden; border: 1px solid #2196f3;">
                            <div id="player-hp-bar" style="
                                height: 100%;
                                background: linear-gradient(90deg, #2196f3, #64b5f6);
                                width: 100%;
                                transition: width 0.5s ease;
                            "></div>
                        </div>
                    </div>

                    <!-- HP врага (красный) -->
                    <div style="
                        border: 3px solid #f44336;
                        background: rgba(244, 67, 54, 0.1);
                        padding: 15px;
                        border-radius: 12px;
                        min-width: 45%;
                    ">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <div>
                                <div style="font-weight: bold; color: #f44336; font-size: 16px;">ВРАГ</div>
                                <div id="enemy-hp-text" style="font-size: 14px; color: #ccc;">100/100 HP</div>
                            </div>
                            <img id="enemy-battle-img" style="
                                width: 50px;
                                height: 50px;
                                border-radius: 8px;
                                margin-left: 12px;
                                border: 2px solid #f44336;
                                object-fit: cover;
                            ">
                        </div>
                        <div style="background: #000; border-radius: 6px; height: 16px; overflow: hidden; border: 1px solid #f44336;">
                            <div id="enemy-hp-bar" style="
                                height: 100%;
                                background: linear-gradient(90deg, #e91e63, #f06292);
                                width: 100%;
                                transition: width 0.5s ease;
                            "></div>
                        </div>
                    </div>
                </div>

                <!-- Лог боя (желтый) -->
                <div id="battle-log-container" style="
                    background: #1a1a00;
                    border: 3px solid #ffc107;
                    border-radius: 12px;
                    margin: 0 20px 20px 20px;
                    padding: 15px;
                    min-height: 80px;
                    max-height: 120px;
                    overflow-y: auto;
                    font-size: 16px;
                    color: #fff3c4;
                    line-height: 1.4;
                "></div>

                <!-- Область действий -->
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div id="action-buttons-container" style="
                        display: flex;
                        gap: 20px;
                        flex-wrap: wrap;
                        justify-content: center;
                    ">
                        <!-- Кнопки будут добавлены динамически -->
                    </div>
                </div>

                <!-- Результат битвы -->
                <div id="battle-result-container" style="
                    display: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.9);
                    border: 4px solid;
                    border-radius: 16px;
                    padding: 30px;
                    text-align: center;
                    min-width: 300px;
                ">
                    <div id="result-text" style="font-size: 24px; font-weight: bold; margin-bottom: 20px;"></div>
                    <div id="result-details" style="font-size: 16px; margin-bottom: 25px; line-height: 1.4;"></div>
                    <button id="result-back-btn" style="
                        background: #fff;
                        color: #000;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Вернуться в меню</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', battleHTML);

        // Устанавливаем обработчики
        document.getElementById('escape-btn').onclick = () => this.attemptEscape();
        document.getElementById('result-back-btn').onclick = () => this.endBattle();
    }

    updateDisplay() {
        // Обновляем изображения
        document.getElementById('player-battle-img').src = this.playerNft.img;
        document.getElementById('enemy-battle-img').src = this.enemyNft.img;

        // Обновляем HP
        const playerHPPercent = (this.playerHP / this.playerMaxHP) * 100;
        const enemyHPPercent = (this.enemyHP / this.enemyMaxHP) * 100;

        document.getElementById('player-hp-bar').style.width = playerHPPercent + '%';
        document.getElementById('enemy-hp-bar').style.width = enemyHPPercent + '%';

        document.getElementById('player-hp-text').textContent = `${Math.max(0, Math.round(this.playerHP))}/${this.playerMaxHP} HP`;
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, Math.round(this.enemyHP))}/${this.enemyMaxHP} HP`;

        // Цвет HP бара при низком здоровье
        if (this.playerHP <= 25) {
            document.getElementById('player-hp-bar').style.background = 'linear-gradient(90deg, #f44336, #e57373)';
        }
        if (this.enemyHP <= 25) {
            document.getElementById('enemy-hp-bar').style.background = 'linear-gradient(90deg, #d32f2f, #f44336)';
        }
    }

    addBattleLog(message) {
        const logContainer = document.getElementById('battle-log-container');
        this.battleLog.push(message);

        // Показываем только последние 4 сообщения
        const recentLogs = this.battleLog.slice(-4);
        logContainer.innerHTML = recentLogs.map(log => `<div style="margin-bottom: 5px;">• ${log}</div>`).join('');
        
        // Прокручиваем вниз
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    showPlayerActions() {
        const container = document.getElementById('action-buttons-container');
        
        if (this.currentTurn !== 'player' || !this.battleActive) {
            container.innerHTML = '<div style="color: #ccc; font-size: 18px;">Ход противника...</div>';
            return;
        }

        container.innerHTML = `
            <button onclick="battleSystem.playerAttack()" style="
                background: #4caf50;
                border: 3px solid #2e7d32;
                color: #fff;
                padding: 20px 30px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                font-family: monospace;
                min-width: 150px;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='#66bb6a'" onmouseout="this.style.background='#4caf50'">
                ⚔️ АТАКА
            </button>
            <button onclick="battleSystem.playerDefend()" style="
                background: #00bcd4;
                border: 3px solid #0097a7;
                color: #fff;
                padding: 20px 30px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                font-family: monospace;
                min-width: 150px;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='#26c6da'" onmouseout="this.style.background='#00bcd4'">
                🛡️ БЛОК
            </button>
        `;
    }

    playerAttack() {
        if (this.currentTurn !== 'player' || !this.battleActive) return;

        this.addBattleLog('Вы атакуете!');
        
        // Расчет урона игрока
        let damage = Math.floor(Math.random() * 35) + 15; // 15-50 урона
        const isCrit = Math.random() < 0.2; // 20% шанс крита
        const enemyDodge = Math.random() < 0.1; // 10% шанс уклонения

        // Применяем апгрейды игрока
        if (this.playerNft.upgrades) {
            if (this.playerNft.upgrades.damage) {
                damage *= this.playerNft.upgrades.damage;
            }
            if (this.playerNft.upgrades.crit && isCrit) {
                damage *= 1.5; // Дополнительный множитель при крите
            }
        }

        if (enemyDodge) {
            this.addBattleLog('Враг уклонился от атаки!');
        } else {
            if (isCrit) {
                damage *= 2;
                this.addBattleLog(`КРИТИЧЕСКИЙ УДАР! Нанесено ${Math.round(damage)} урона!`);
            } else {
                this.addBattleLog(`Нанесено ${Math.round(damage)} урона`);
            }
            
            this.enemyHP -= damage;
            this.enemyHP = Math.max(0, this.enemyHP);
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
        if (this.currentTurn !== 'player' || !this.battleActive) return;

        this.addBattleLog('Вы приготовились к защите!');
        this.playerDefending = true;

        this.currentTurn = 'enemy';
        this.showPlayerActions();

        setTimeout(() => {
            this.enemyTurn();
        }, 1500);
    }

    enemyTurn() {
        if (this.currentTurn !== 'enemy' || !this.battleActive) return;

        this.addBattleLog('Враг атакует!');

        let damage = Math.floor(Math.random() * 30) + 12; // 12-42 урона
        const isCrit = Math.random() < 0.15; // 15% шанс крита
        const playerDodge = Math.random() < 0.08; // 8% базовый шанс уклонения

        // Применяем апгрейды врага
        if (this.enemyNft.upgrades) {
            if (this.enemyNft.upgrades.damage) {
                damage *= this.enemyNft.upgrades.damage;
            }
        }

        // Проверяем уклонение игрока
        let finalDodgeChance = playerDodge;
        if (this.playerNft.upgrades && this.playerNft.upgrades.dodge) {
            finalDodgeChance = Math.random() < (0.08 * this.playerNft.upgrades.dodge);
        }

        if (finalDodgeChance) {
            this.addBattleLog('Вы уклонились от атаки!');
        } else {
            // Если игрок защищался, урон уменьшается
            if (this.playerDefending) {
                damage *= 0.5;
                this.addBattleLog(`Блок частично поглотил урон! Получено ${Math.round(damage)} урона`);
            } else {
                if (isCrit) {
                    damage *= 1.8;
                    this.addBattleLog(`КРИТИЧЕСКАЯ АТАКА ВРАГА! Получено ${Math.round(damage)} урона!`);
                } else {
                    this.addBattleLog(`Получено ${Math.round(damage)} урона`);
                }
            }
            
            this.playerHP -= damage;
            this.playerHP = Math.max(0, this.playerHP);
        }

        this.playerDefending = false;
        this.updateDisplay();
        this.checkBattleEnd();

        if (this.battleActive) {
            this.currentTurn = 'player';
            setTimeout(() => {
                this.showPlayerActions();
            }, 1500);
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
        const resultContainer = document.getElementById('battle-result-container');
        const resultText = document.getElementById('result-text');
        const resultDetails = document.getElementById('result-details');

        if (playerWon) {
            resultContainer.style.borderColor = '#4caf50';
            resultText.style.color = '#4caf50';
            resultText.textContent = '🏆 ПОБЕДА!';
            resultDetails.innerHTML = `
                Вы победили и получили:<br>
                <strong>${this.enemyNft.name}</strong><br>
                <em>NFT добавлен в вашу коллекцию</em>
            `;

            // Добавляем NFT в коллекцию
            collection.push({...this.enemyNft, buyPrice: this.enemyNft.price || 100});
        } else {
            resultContainer.style.borderColor = '#f44336';
            resultText.style.color = '#f44336';
            resultText.textContent = '💀 ПОРАЖЕНИЕ!';
            resultDetails.innerHTML = `
                Вы проиграли и потеряли:<br>
                <strong>${this.playerNft.name}</strong><br>
                <em>NFT удален из коллекции</em>
            `;

            // Удаляем NFT из коллекции
            const index = collection.findIndex(nft => 
                nft.name === this.playerNft.name && 
                nft.img === this.playerNft.img && 
                nft.buyPrice === this.playerNft.buyPrice
            );
            if (index !== -1) {
                collection.splice(index, 1);
                activeBattleNft = null;
            }
        }

        // Добавляем в историю
        battleHistory.push({
            playerNft: {...this.playerNft},
            opponentNft: {...this.enemyNft},
            won: playerWon,
            timestamp: new Date().toISOString()
        });

        resultContainer.style.display = 'block';
        updateUI();
        saveData();
    }

    attemptEscape() {
        if (stars < 50) {
            this.addBattleLog('Недостаточно звёзд для побега!');
            return;
        }

        stars -= 50;
        this.addBattleLog('Вы сбежали из боя! (-50 звёзд)');
        
        setTimeout(() => {
            this.endBattle();
        }, 1000);
    }

    endBattle() {
        const container = document.getElementById('undertale-battle-container');
        if (container) {
            container.remove();
        }

        // Возвращаемся в главное меню
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('main-screen').classList.add('active');

        // Обновляем навигацию
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.nav-item')[0].classList.add('active');

        renderCenterArea();
        updateUI();
    }
}

// Создаем глобальный экземпляр
window.battleSystem = new UndertaleBattle();

// Функция для запуска новой битвы (заменяет старую)
window.startUndertaleBattle = function(playerNft, enemyNft) {
    battleSystem.init(playerNft, enemyNft);
};