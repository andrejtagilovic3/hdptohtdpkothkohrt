// ===== НОВАЯ ПРОСТАЯ СИСТЕМА БИТВ =====

class SimpleBattleSystem {
    constructor() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.maxHP = 100;
        this.playerNft = null;
        this.enemyNft = null;
        this.isActive = false;
        this.battleContainer = null;
    }

    // Инициализация битвы
    init(playerNft, enemyNft) {
        console.log('🚀 Запуск новой простой битвы');
        
        this.playerHP = 100;
        this.enemyHP = 100;
        this.playerNft = playerNft;
        this.enemyNft = enemyNft;
        this.isActive = true;

        this.createUI();
        this.updateDisplay();
        
        return true;
    }

    // Создание интерфейса
    createUI() {
        // Удаляем старый интерфейс если есть
        const existing = document.getElementById('simple-battle-container');
        if (existing) existing.remove();

        const battleHTML = `
            <div id="simple-battle-container" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #000000;
                color: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-family: Arial, sans-serif;
                gap: 30px;
            ">
                <!-- Враг -->
                <div style="text-align: center;">
                    <h2 id="enemy-name" style="margin: 0 0 15px 0; font-size: 24px;">ВРАГ</h2>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img id="enemy-img" style="width: 80px; height: 80px; border-radius: 10px; border: 2px solid #666;">
                        <div>
                            <div style="
                                width: 200px;
                                height: 20px;
                                background: #333;
                                border: 2px solid #666;
                                border-radius: 10px;
                                overflow: hidden;
                                position: relative;
                                margin-bottom: 5px;
                            ">
                                <div id="enemy-hp-bar" style="
                                    width: 100%;
                                    height: 100%;
                                    background: linear-gradient(90deg, #4caf50, #2e7d32);
                                    transition: width 0.5s ease;
                                "></div>
                            </div>
                            <div id="enemy-hp-text" style="font-size: 14px; color: #ccc; text-align: center;">100/100 HP</div>
                        </div>
                    </div>
                </div>

                <!-- Кнопка боя -->
                <button id="battle-btn" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#ff6666'" onmouseout="this.style.background='#ff4444'">
                    ⚔️ АТАКА
                </button>

                <!-- Игрок -->
                <div style="text-align: center;">
                    <h2 style="margin: 0 0 15px 0; font-size: 24px;">ВЫ</h2>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img id="player-img" style="width: 80px; height: 80px; border-radius: 10px; border: 2px solid #666;">
                        <div>
                            <div style="
                                width: 200px;
                                height: 20px;
                                background: #333;
                                border: 2px solid #666;
                                border-radius: 10px;
                                overflow: hidden;
                                position: relative;
                                margin-bottom: 5px;
                            ">
                                <div id="player-hp-bar" style="
                                    width: 100%;
                                    height: 100%;
                                    background: linear-gradient(90deg, #4caf50, #2e7d32);
                                    transition: width 0.5s ease;
                                "></div>
                            </div>
                            <div id="player-hp-text" style="font-size: 14px; color: #ccc; text-align: center;">100/100 HP</div>
                        </div>
                    </div>
                </div>

                <!-- Кнопка выхода -->
                <button id="exit-btn" style="
                    background: #666;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 14px;
                    border-radius: 5px;
                    cursor: pointer;
                    position: absolute;
                    top: 20px;
                    right: 20px;
                ">
                    Выход
                </button>

                <!-- Результат битвы -->
                <div id="battle-result" style="
                    display: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #222;
                    border: 3px solid #666;
                    border-radius: 15px;
                    padding: 30px;
                    text-align: center;
                ">
                    <h2 id="result-title" style="margin: 0 0 15px 0; font-size: 28px;"></h2>
                    <p id="result-text" style="margin: 0 0 20px 0; font-size: 16px; color: #ccc;"></p>
                    <button id="result-btn" style="
                        background: #4caf50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-size: 16px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        Вернуться
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', battleHTML);
        this.battleContainer = document.getElementById('simple-battle-container');

        // Привязываем события
        document.getElementById('battle-btn').addEventListener('click', () => this.fight());
        document.getElementById('exit-btn').addEventListener('click', () => this.exitBattle());
        document.getElementById('result-btn').addEventListener('click', () => this.exitBattle());
    }

    // Обновление отображения
    updateDisplay() {
        // Обновляем изображения и названия
        document.getElementById('player-img').src = this.playerNft.img;
        document.getElementById('enemy-img').src = this.enemyNft.img;
        document.getElementById('enemy-name').textContent = this.enemyNft.name.toUpperCase();

        // Обновляем HP бары
        this.updateHPBars();
    }

    // Обновление HP баров
    updateHPBars() {
        const playerPercent = (this.playerHP / this.maxHP) * 100;
        const enemyPercent = (this.enemyHP / this.maxHP) * 100;

        // Обновляем ширину баров
        document.getElementById('player-hp-bar').style.width = playerPercent + '%';
        document.getElementById('enemy-hp-bar').style.width = enemyPercent + '%';

        // Обновляем цвета в зависимости от HP
        const playerBar = document.getElementById('player-hp-bar');
        const enemyBar = document.getElementById('enemy-hp-bar');

        // Игрок
        if (playerPercent > 50) {
            playerBar.style.background = 'linear-gradient(90deg, #4caf50, #2e7d32)';
        } else if (playerPercent > 25) {
            playerBar.style.background = 'linear-gradient(90deg, #ff9800, #f57c00)';
        } else {
            playerBar.style.background = 'linear-gradient(90deg, #f44336, #d32f2f)';
        }

        // Враг
        if (enemyPercent > 50) {
            enemyBar.style.background = 'linear-gradient(90deg, #4caf50, #2e7d32)';
        } else if (enemyPercent > 25) {
            enemyBar.style.background = 'linear-gradient(90deg, #ff9800, #f57c00)';
        } else {
            enemyBar.style.background = 'linear-gradient(90deg, #f44336, #d32f2f)';
        }

        // Обновляем текст HP
        document.getElementById('player-hp-text').textContent = `${this.playerHP}/100 HP`;
        document.getElementById('enemy-hp-text').textContent = `${this.enemyHP}/100 HP`;
    }

    // Основная функция боя
    fight() {
        if (!this.isActive) return;

        console.log('⚔️ Бой начат!');
        
        // Отключаем кнопку
        const battleBtn = document.getElementById('battle-btn');
        battleBtn.disabled = true;
        battleBtn.textContent = '...';

        // Случайно выбираем кто получит урон первым
        const playerFirst = Math.random() < 0.5;
        
        if (playerFirst) {
            console.log('💥 Первым урон получает игрок');
            this.damagePlayer();
            
            setTimeout(() => {
                if (this.isActive && this.enemyHP > 0) {
                    console.log('💥 Вторым урон получает враг');
                    this.damageEnemy();
                    this.resetButton();
                }
            }, 1000);
        } else {
            console.log('💥 Первым урон получает враг');
            this.damageEnemy();
            
            setTimeout(() => {
                if (this.isActive && this.playerHP > 0) {
                    console.log('💥 Вторым урон получает игрок');
                    this.damagePlayer();
                    this.resetButton();
                }
            }, 1000);
        }
    }

    // Урон игроку
    damagePlayer() {
        const damage = Math.floor(Math.random() * 20) + 10; // 10-30 урона
        this.playerHP = Math.max(0, this.playerHP - damage);
        
        console.log(`💀 Игрок получил ${damage} урона. HP: ${this.playerHP}`);
        this.updateHPBars();
        
        if (this.playerHP <= 0) {
            setTimeout(() => this.endBattle(false), 500);
        }
    }

    // Урон врагу
    damageEnemy() {
        const damage = Math.floor(Math.random() * 20) + 10; // 10-30 урона
        this.enemyHP = Math.max(0, this.enemyHP - damage);
        
        console.log(`👹 Враг получил ${damage} урона. HP: ${this.enemyHP}`);
        this.updateHPBars();
        
        if (this.enemyHP <= 0) {
            setTimeout(() => this.endBattle(true), 500);
        }
    }

    // Восстановление кнопки
    resetButton() {
        if (!this.isActive) return;
        
        const battleBtn = document.getElementById('battle-btn');
        battleBtn.disabled = false;
        battleBtn.textContent = '⚔️ АТАКА';
    }

    // Завершение битвы
    endBattle(playerWon) {
        this.isActive = false;
        
        const resultDiv = document.getElementById('battle-result');
        const titleDiv = document.getElementById('result-title');
        const textDiv = document.getElementById('result-text');

        if (playerWon) {
            titleDiv.textContent = '🏆 ПОБЕДА!';
            titleDiv.style.color = '#4caf50';
            textDiv.textContent = `Вы победили ${this.enemyNft.name}!`;
            
            // Добавляем NFT в коллекцию
            if (window.collection) {
                window.collection.push({
                    ...this.enemyNft,
                    buyPrice: this.enemyNft.price || 150
                });
            }
        } else {
            titleDiv.textContent = '💀 ПОРАЖЕНИЕ!';
            titleDiv.style.color = '#f44336';
            textDiv.textContent = `Вы проиграли ${this.enemyNft.name}...`;
            
            // Удаляем NFT из коллекции
            if (window.collection && window.activeBattleNft) {
                const index = window.collection.findIndex(nft => 
                    nft.name === this.playerNft.name && 
                    nft.img === this.playerNft.img
                );
                if (index !== -1) {
                    window.collection.splice(index, 1);
                    window.activeBattleNft = null;
                }
            }
        }

        // Добавляем в историю
        if (window.battleHistory) {
            window.battleHistory.push({
                playerNft: {...this.playerNft},
                opponentNft: {...this.enemyNft},
                won: playerWon,
                timestamp: new Date().toISOString()
            });
        }

        resultDiv.style.display = 'block';

        // Обновляем игровые данные
        if (window.updateUI) window.updateUI();
        if (window.saveData) setTimeout(() => window.saveData(), 500);
    }

    // Выход из битвы
    exitBattle() {
        if (this.battleContainer) {
            this.battleContainer.remove();
        }

        // Возврат в главное меню
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

        // Обновляем UI
        if (window.renderCenterArea) window.renderCenterArea();
        if (window.updateUI) window.updateUI();

        console.log('🚪 Выход из битвы');
    }
}

// Создаем глобальный экземпляр
window.simpleBattleSystem = new SimpleBattleSystem();

// Обновляем глобальный battleSystem для совместимости
window.battleSystem = {
    init: (playerNft, enemyNft) => {
        return window.simpleBattleSystem.init(playerNft, enemyNft);
    }
};

// Функция запуска для совместимости
window.startUndertaleBattle = function(playerNft, enemyNft) {
    console.log('🚀 Запуск простой битвы');
    return window.simpleBattleSystem.init(playerNft, enemyNft);
};

console.log('✅ Простая боевая система загружена!');
