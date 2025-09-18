class SimpleBattle {
    constructor() {
        this.playerHealth = 100;
        this.enemyHealth = 100;
        this.maxHealth = 100;
        this.battleActive = false;
    }

    startBattle(playerData, enemyData) {
        this.playerHealth = 100;
        this.enemyHealth = 100;
        this.battleActive = true;

        this.buildInterface();
        this.attachHandlers();
        this.refreshView();

        console.log('Battle started');
        return true;
    }

    buildInterface() {
        const oldContainer = document.getElementById('simple-battle-box');
        if (oldContainer) oldContainer.remove();

        const htmlStructure = `
            <div id="simple-battle-box" class="simple-battle-box">
                <div class="enemy-zone">
                    <div class="health-box enemy-health-box">
                        <div id="enemy-health-fill" class="health-fill"></div>
                    </div>
                    <div id="enemy-health-label" class="health-label">100/100</div>
                </div>
                <div class="action-zone">
                    <button id="action-button" class="action-button">Attack</button>
                </div>
                <div class="player-zone">
                    <div class="health-box player-health-box">
                        <div id="player-health-fill" class="health-fill"></div>
                    </div>
                    <div id="player-health-label" class="health-label">100/100</div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', htmlStructure);
    }

    attachHandlers() {
        const actionBtn = document.getElementById('action-button');
        actionBtn.addEventListener('click', () => this.performAction());
    }

    performAction() {
        if (!this.battleActive) return;

        const enemyDamage = Math.floor(Math.random() * 21) + 10;
        this.enemyHealth = Math.max(0, this.enemyHealth - enemyDamage);
        this.refreshView();

        if (this.enemyHealth <= 0) {
            this.endBattle(true);
            return;
        }

        setTimeout(() => {
            const playerDamage = Math.floor(Math.random() * 21) + 10;
            this.playerHealth = Math.max(0, this.playerHealth - playerDamage);
            this.refreshView();

            if (this.playerHealth <= 0) {
                this.endBattle(false);
            }
        }, 1000);
    }

    refreshView() {
        this.updateHealthBar('enemy', this.enemyHealth);
        this.updateHealthBar('player', this.playerHealth);
    }

    updateHealthBar(target, current) {
        const fillElem = document.getElementById(`${target}-health-fill`);
        const labelElem = document.getElementById(`${target}-health-label`);

        const percent = (current / this.maxHealth) * 100;
        fillElem.style.width = `${percent}%`;

        if (percent > 50) {
            fillElem.style.backgroundColor = '#4caf50';
        } else if (percent > 20) {
            fillElem.style.backgroundColor = '#ff9800';
        } else {
            fillElem.style.backgroundColor = '#f44336';
        }

        labelElem.textContent = `${current}/${this.maxHealth}`;
    }

    endBattle(won) {
        this.battleActive = false;
        alert(won ? 'You won!' : 'You lost!');
        const container = document.getElementById('simple-battle-box');
        if (container) container.remove();
    }
}

window.simpleBattle = new SimpleBattle();

window.launchBattle = function(player, enemy) {
    return window.simpleBattle.startBattle(player, enemy);
};
