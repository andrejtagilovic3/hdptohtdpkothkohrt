// ==================== undertale-battle.js ====================

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
        this.enemyNft = enemyNft;
        this.playerHP = 100;
        this.enemyHP = 100;
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
                background: #000000;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                z-index: 9999;
            ">
                <!-- ВЕРХНЯЯ ОБЛАСТЬ - NFT ВРАГА (красная рамка) -->
                <div style="
                    flex: 1;
                    border: 3px solid #f44336;
                    margin: 10px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #1a1a1a;
                    position: relative;
                ">
                    <!-- Кнопка побега в углу -->
                    <button id="escape-btn" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: #333333;
                        border: 1px solid #666666;
                        color: #ffffff;
                        padding: 8px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 600;
                    ">СБЕЖАТЬ (50⭐)</button>

                    <!-- NFT врага -->
                    <img id="enemy-battle-img" style="
                        width: 120px;
                        height: 120px;
                        border-radius: 12px;
                        border: 2px solid #f44336;
                        object-fit: cover;
                        margin-bottom: 15px;
                    ">
                    
                    <div id="enemy-name" style="
                        font-size: 18px;
                        font-weight: 700;
                        color: #f44336;
                        margin-bottom: 10px;
                    ">ВРАГ</div>

                    <!-- HP врага (розовый) -->
                    <div style="
                        background: #000000;
                        border: 2px solid #e91e63;
                        border-radius: 8px;
                        width: 200px;
                        height: 20px;
                        overflow: hidden;
                        margin-bottom: 5px;
                    ">
                        <div id="enemy-hp-bar" style="
                            height: 100%;
                            background: #e91e63;
                            width: 100%;
                            transition: width 0.5s ease;
                        "></div>
                    </div>
                    <div id="enemy-hp-text" style="
                        font-size: 14px;
                        color: #e91e63;
                        font-weight: 600;
                    ">100/100 HP</div>
                </div>

                <!-- НИЖНЯЯ ОБЛАСТЬ -->
                <div style="
                    height: 350px;
                    margin: 0 10px 10px 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                ">
                    <!-- ЛОГ БОЯ (желтая рамка) -->
                    <div id="battle-log-container" style="
                        border: 3px solid #ffc107;
                        border-radius: 12px;
                        background: #1a1a1a;
                        padding: 15px;
                        height: 120px;
                        overflow-y: auto;
                        font-size: 14px;
                        color: #ffffff;
                        line-height: 1.4;
                    "></div>

                    <!-- ДЕЙСТВИЯ ИГРОКА -->
                    <div style="
                        display: flex;
                        gap: 10px;
                        height: 200px;
                    ">
                        <!-- ЛЕВАЯ ЧАСТЬ - NFT игрока и HP (синяя рамка) -->
                        <div style="
                            border: 3px solid #2196f3;
                            border-radius: 12px;
                            background: #1a1a1a;
                            padding: 15px;
                            width: 200px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        ">
                            <img id="player-battle-img" style="
                                width: 80px;
                                height: 80px;
                                border-radius: 8px;
                                border: 2px solid #2196f3;
                                object-fit: cover;
                                margin-bottom: 10px;
                            ">
                            
                            <div style="
                                font-size: 14px;
                                font-weight: 700;
                                color: #2196f3;
                                margin-bottom: 8px;
                            ">ВЫ</div>

                            <!-- HP игрока -->
                            <div style="
                                background: #000000;
                                border: 2px solid #2196f3;
                                border-radius: 6px;
                                width: 120px;
                                height: 16px;
                                overflow: hidden;
                                margin-bottom: 5px;
                            ">
                                <div id="player-hp-bar" style="
                                    height: 100%;
                                    background: #2196f3;
                                    width: 100%;
                                    transition: width 0.5s ease;
                                "></div>
                            </div>
                            <div id="player-hp-text" style="
                                font-size: 12px;
                                color: #2196f3;
                                font-weight: 600;
                            ">100/100 HP</div>
                        </div>

                        <!-- ПРАВАЯ ЧАСТЬ - Кнопки действий -->
                        <div style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                        ">
                            <!-- АТАКА (зеленая) -->
                            <button id="attack-btn" style="
                                flex: 1;
                                background: #4caf50;
                                border: 2px solid #388e3c;
                                color: #ffffff;
                                border-radius: 12px;
                                font-size: 18px;
                                font-weight: 700;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.2s ease;
                            ">⚔️ АТАКА</button>

                            <!-- УКЛОНЕНИЕ (голубое) -->
                            <button id="defend-btn" style="
                                flex: 1;
                                background: #00bcd4;
                                border: 2px solid #0097a7;
                                color: #ffffff;
                                border-radius: 12px;
                                font-size: 18px;
                                font-weight: 700;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.2s ease;
                            ">🛡️ БЛОК</button>
                        </div>
                    </div>
                </div>

                <!-- Результат битвы (скрыт по умолчанию) -->
                <div id="battle-result-container" style="
                    display: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #1a1a1a;
                    border: 4px solid #333333;
                    border-radius: 16px;
                    padding: 30px;
                    text-align: center;
                    min-width: 300px;
                    z-index: 10000;
                ">
                    <div id="result-text" style="font-size: 24px; font-weight: bold; margin-bottom: 15px;"></div>
                    <div id="result-details" style="font-size: 16px; margin-bottom: 20px; line-height: 1.4;"></div>
                    <button id="result-back-btn" style="
                        background: #ffffff;
                        color: #000000;
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
        document.getElementById('attack-btn').onclick = () => this.playerAttack();
        document.getElementById('defend-btn').onclick = () => this.playerDefend();
        document.getElementById('result-back-btn').onclick = () => this.endBattle();
    }

    updateDisplay() {
        // Обновляем изображения
        document.getElementById('player-battle-img').src = this.playerNft.img;
        document.getElementById('enemy-battle-img').src = this.enemyNft.img;

        // Обновляем HP
        const playerHPPercent = Math.max(0, (this.playerHP / this.playerMaxHP) * 100);
        const enemyHPPercent = Math.max(0, (this.enemyHP / this.enemyMaxHP) * 100);

        document.getElementById('player-hp-bar').style.width = playerHPPercent + '%';
        document.getElementById('enemy-hp-bar').style.width = enemyHPPercent + '%';

        document.getElementById('player-hp-text').textContent = `${Math.max(0, Math.round(this.playerHP))}/${this.playerMaxHP} HP`;
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, Math.round(this.enemyHP))}/${this.enemyMaxHP} HP`;

        // Меняем цвет при низком HP
        if (this.playerHP <= 25) {
            document.getElementById('player-hp-bar').style.background = '#f44336';
        }
        if (this.enemyHP <= 25) {
            document.getElementById('enemy-hp-bar').style.background = '#d32f2f';
        }
    }

    addBattleLog(message) {
        const logContainer = document.getElementById('battle-log-container');
        this.battleLog.push(message);

        // Показываем только последние 6 сообщений
        const recentLogs = this.battleLog.slice(-6);
        logContainer.innerHTML = recentLogs.map(log => `<div style="margin-bottom: 3px;">• ${log}</div>`).join('');
        
        // Прокручиваем вниз
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    showPlayerActions() {
        const attackBtn = document.getElementById('attack-btn');
        const defendBtn = document.getElementById('defend-btn');
        
        if (this.currentTurn !== 'player' || !this.battleActive) {
            attackBtn.disabled = true;
            defendBtn.disabled = true;
            attackBtn.style.opacity = '0.5';
            defendBtn.style.opacity = '0.5';
            attackBtn.style.cursor = 'not-allowed';
            defendBtn.style.cursor = 'not-allowed';
        } else {
            attackBtn.disabled = false;
            defendBtn.disabled = false;
            attackBtn.style.opacity = '1';
            defendBtn.style.opacity = '1';
            attackBtn.style.cursor = 'pointer';
            defendBtn.style.cursor = 'pointer';
        }
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
                damage *= 1.5;
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

        // Применяем апгрейды врага
        if (this.enemyNft.upgrades && this.enemyNft.upgrades.damage) {
            damage *= this.enemyNft.upgrades.damage;
        }

        // Проверяем уклонение игрока
        let playerDodgeChance = 0.08;
        if (this.playerNft.upgrades && this.playerNft.upgrades.dodge) {
            playerDodgeChance *= this.playerNft.upgrades.dodge;
        }

        const playerDodged = Math.random() < playerDodgeChance;

        if (playerDodged) {
            this.addBattleLog('Вы уклонились от атаки!');
        } else {
            // Если игрок защищался, урон уменьшается
            if (this.playerDefending) {
                damage *= 0.5;
                this.addBattleLog(`Блок поглотил часть урона! Получено ${Math.round(damage)} урона`);
            } else {
                if (isCrit) {
                    damage *= 1.8;
                    this.addBattleLog(`КРИТИЧЕСКАЯ АТАКА! Получено ${Math.round(damage)} урона!`);
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
                <em>NFT добавлен в коллекцию</em>
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
        updateUI();
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

// Функция для запуска новой битвы
window.startUndertaleBattle = function(playerNft, enemyNft) {
    console.log('Запуск боя:', playerNft.name, 'vs', enemyNft.name);
    battleSystem.init(playerNft, enemyNft);
};

// Дополнительная проверка загрузки
document.addEventListener('DOMContentLoaded', function() {
    console.log('Undertale Battle System загружен!');
});
