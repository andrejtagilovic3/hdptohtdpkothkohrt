// Система анимаций для игры

class AnimationManager {
    constructor() {
        this.activeAnimations = new Set();
        this.animationQueue = [];
        this.isProcessing = false;
    }
    
    // Анимация перехода между экранами
    async transitionToScreen(fromScreen, toScreen) {
        return new Promise((resolve) => {
            // Скрываем текущий экран
            fromScreen.classList.remove('active');
            fromScreen.classList.add('slide-left');
            
            // Показываем новый экран с задержкой
            setTimeout(() => {
                toScreen.classList.add('active', 'screen-transition');
                fromScreen.style.display = 'none';
                
                // Убираем классы анимации после завершения
                setTimeout(() => {
                    fromScreen.classList.remove('slide-left');
                    fromScreen.style.display = '';
                    toScreen.classList.remove('screen-transition');
                    resolve();
                }, 300);
            }, 100);
        });
    }
    
    // Анимация появления NFT в центре
    animateNFTAppearance(nftElement) {
        return new Promise((resolve) => {
            nftElement.style.opacity = '0';
            nftElement.style.transform = 'scale(0.5) rotateY(90deg)';
            
            // Анимируем появление
            setTimeout(() => {
                nftElement.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                nftElement.style.opacity = '1';
                nftElement.style.transform = 'scale(1) rotateY(0deg)';
                
                setTimeout(resolve, 600);
            }, 50);
        });
    }
    
    // Анимация входа бойцов на арену
    async animateFightersEntry(playerFighter, enemyFighter) {
        return new Promise((resolve) => {
            // Сначала скрываем бойцов
            playerFighter.style.transform = 'translateX(-100%) translateY(50px)';
            playerFighter.style.opacity = '0';
            enemyFighter.style.transform = 'translateX(100%) translateY(-50px)';
            enemyFighter.style.opacity = '0';
            
            // Анимируем появление игрока
            setTimeout(() => {
                playerFighter.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                playerFighter.style.transform = 'translateX(0) translateY(0)';
                playerFighter.style.opacity = '1';
            }, 200);
            
            // Анимируем появление противника с задержкой
            setTimeout(() => {
                enemyFighter.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                enemyFighter.style.transform = 'translateX(0) translateY(0)';
                enemyFighter.style.opacity = '1';
                
                setTimeout(resolve, 800);
            }, 400);
        });
    }
    
    // Анимация атаки
    async animateAttack(attackerElement, targetElement, damage) {
        return new Promise((resolve) => {
            // Анимация атакующего
            attackerElement.classList.add('attack-animation');
            
            // Показываем индикатор атаки
            const attackIndicator = attackerElement.querySelector('.attack-indicator');
            if (attackIndicator) {
                attackIndicator.classList.add('show');
            }
            
            // Создаём эффект магического круга
            if (particleSystem) {
                const rect = attackerElement.getBoundingClientRect();
                const containerRect = attackerElement.closest('.container').getBoundingClientRect();
                const x = ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100;
                const y = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100;
                
                particleSystem.createBattleEffect('magic-circle', x, y);
            }
            
            // Анимация получения урона через 400мс
            setTimeout(() => {
                this.animateDamage(targetElement, damage);
            }, 400);
            
            // Убираем анимацию атаки
            setTimeout(() => {
                attackerElement.classList.remove('attack-animation');
                if (attackIndicator) {
                    attackIndicator.classList.remove('show');
                }
                resolve();
            }, 800);
        });
    }
    
    // Анимация получения урона
    animateDamage(targetElement, damage) {
        targetElement.classList.add('damage-animation');
        
        // Создаём искры при попадании
        if (particleSystem) {
            const rect = targetElement.getBoundingClientRect();
            const containerRect = targetElement.closest('.container').getBoundingClientRect();
            const x = ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100;
            const y = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100;
            
            particleSystem.createBattleEffect('sparks', x, y);
        }
        
        // Показываем урон цифрами
        this.showDamageNumbers(targetElement, damage);
        
        // Критический удар
        if (damage > 50) {
            targetElement.classList.add('critical-hit');
            if (particleSystem) {
                particleSystem.shakeScreen();
            }
            
            setTimeout(() => {
                targetElement.classList.remove('critical-hit');
            }, 800);
        }
        
        setTimeout(() => {
            targetElement.classList.remove('damage-animation');
        }, 600);
    }
    
    // Показ цифр урона
    showDamageNumbers(element, damage) {
        const damageText = document.createElement('div');
        damageText.textContent = `-${damage}`;
        damageText.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            font-weight: bold;
            color: ${damage > 50 ? '#ff453a' : '#ff9500'};
            text-shadow: 0 0 10px currentColor;
            pointer-events: none;
            z-index: 100;
            animation: damageFloat 1.5s ease-out forwards;
        `;
        
        // Добавляем CSS для анимации, если его нет
        if (!document.querySelector('#damage-float-style')) {
            const style = document.createElement('style');
            style.id = 'damage-float-style';
            style.textContent = `
                @keyframes damageFloat {
                    0% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(0.8);
                    }
                    30% {
                        transform: translateX(-50%) translateY(-20px) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-60px) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.appendChild(damageText);
        
        setTimeout(() => {
            if (damageText.parentNode) {
                damageText.parentNode.removeChild(damageText);
            }
        }, 1500);
    }
    
    // Анимация обновления HP бара
    animateHPChange(hpBar, hpText, currentHP, maxHP) {
        const percentage = (currentHP / maxHP) * 100;
        
        // Плавное изменение ширины
        hpBar.style.width = percentage + '%';
        hpText.textContent = `${currentHP}/${maxHP}`;
        
        // Изменяем цвет в зависимости от здоровья
        if (percentage <= 25) {
            hpBar.classList.add('low');
        } else {
            hpBar.classList.remove('low');
        }
        
        // Эффект мигания при низком HP
        if (percentage <= 15) {
            hpBar.style.animation = 'hpPulse 0.5s ease-in-out infinite alternate';
        } else {
            hpBar.style.animation = '';
        }
        
        // Добавляем CSS для мигания HP, если его нет
        if (!document.querySelector('#hp-pulse-style')) {
            const style = document.createElement('style');
            style.id = 'hp-pulse-style';
            style.textContent = `
                @keyframes hpPulse {
                    from { opacity: 1; }
                    to { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Анимация смерти
    async animateDeath(fighterElement) {
        return new Promise((resolve) => {
            fighterElement.classList.add('death-animation');
            
            // Создаём дым поражения
            if (particleSystem) {
                const rect = fighterElement.getBoundingClientRect();
                const containerRect = fighterElement.closest('.container').getBoundingClientRect();
                const x = ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100;
                const y = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100;
                
                particleSystem.createBattleEffect('defeat-smoke', x, y);
            }
            
            setTimeout(resolve, 1000);
        });
    }
    
    // Анимация победы
    async animateVictory(winnerElement) {
        return new Promise((resolve) => {
            // Создаём взрыв победы
            if (particleSystem) {
                const rect = winnerElement.getBoundingClientRect();
                const containerRect = winnerElement.closest('.container').getBoundingClientRect();
                const x = ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100;
                const y = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100;
                
                particleSystem.createBattleEffect('victory-burst', x, y);
            }
            
            // Анимация увеличения победителя
            winnerElement.style.transform = 'scale(1.1)';
            winnerElement.style.filter = 'brightness(1.3) saturate(1.5)';
            
            setTimeout(() => {
                winnerElement.style.transform = '';
                winnerElement.style.filter = '';
                resolve();
            }, 2000);
        });
    }
    
    // Анимация награды
    async animateReward(rewardElement) {
        return new Promise((resolve) => {
            rewardElement.style.opacity = '0';
            rewardElement.style.transform = 'scale(0) rotate(180deg)';
            
            setTimeout(() => {
                rewardElement.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                rewardElement.style.opacity = '1';
                rewardElement.style.transform = 'scale(1) rotate(0deg)';
                
                setTimeout(resolve, 800);
            }, 100);
        });
    }
    
    // Анимация загрузки (спиннер)
    startLoadingAnimation(element) {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
    }
    
    stopLoadingAnimation(element) {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.visibility = 'hidden';
        }, 300);
    }
    
    // Анимация кнопки при нажатии
    animateButtonPress(button) {
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
    
    // Анимация счётчика
    animateCounter(element, from, to, duration = 1000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const difference = to - from;
            
            const updateCounter = () => {
                const currentTime = Date.now();
                const elapsed = Math.min(currentTime - startTime, duration);
                const progress = elapsed / duration;
                
                // Easing function для плавности
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(from + (difference * easeProgress));
                
                element.textContent = currentValue;
                
                if (elapsed < duration) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = to;
                    resolve();
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    }
    
    // Очистка всех анимаций
    clearAllAnimations() {
        this.activeAnimations.clear();
        this.animationQueue = [];
        this.isProcessing = false;
    }
}

// Глобальный экземпляр менеджера анимаций
let animationManager;

document.addEventListener('DOMContentLoaded', () => {
    animationManager = new AnimationManager();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}