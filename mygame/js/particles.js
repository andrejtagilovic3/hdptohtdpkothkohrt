// Система частиц для фонового эффекта

class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.maxParticles = 50;
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.createStars();
        this.startParticleGeneration();
        this.createEnergyWaves();
        
        // Отслеживаем производительность
        this.checkPerformance();
    }
    
    // Создание звёзд на фоне
    createStars() {
        const starCount = 30;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            this.container.appendChild(star);
        }
    }
    
    // Генерация плавающих частиц
    startParticleGeneration() {
        setInterval(() => {
            if (this.isActive && this.particles.length < this.maxParticles) {
                this.createParticle();
            }
            this.cleanupParticles();
        }, 200);
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Случайная позиция по горизонтали
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '-10px';
        
        // Случайные параметры анимации
        const duration = 8 + Math.random() * 8; // 8-16 секунд
        const delay = Math.random() * 2; // 0-2 секунды задержки
        
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        // Случайное движение по горизонтали
        const horizontalMovement = (Math.random() - 0.5) * 200; // -100px до 100px
        particle.style.setProperty('--horizontal-movement', horizontalMovement + 'px');
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            startTime: Date.now() + (delay * 1000),
            duration: duration * 1000
        });
    }
    
    // Создание энергетических волн
    createEnergyWaves() {
        setInterval(() => {
            if (this.isActive) {
                this.createEnergyWave();
            }
        }, 3000);
    }
    
    createEnergyWave() {
        const wave = document.createElement('div');
        wave.className = 'energy-wave';
        
        // Случайная позиция
        wave.style.left = Math.random() * 100 + '%';
        wave.style.top = Math.random() * 100 + '%';
        
        this.container.appendChild(wave);
        
        // Удаляем после анимации
        setTimeout(() => {
            if (wave.parentNode) {
                wave.parentNode.removeChild(wave);
            }
        }, 4000);
    }
    
    // Очистка завершённых частиц
    cleanupParticles() {
        const currentTime = Date.now();
        this.particles = this.particles.filter(particle => {
            const isFinished = currentTime > (particle.startTime + particle.duration);
            if (isFinished && particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
                return false;
            }
            return true;
        });
    }
    
    // Проверка производительности устройства
    checkPerformance() {
        let frameCount = 0;
        let lastTime = Date.now();
        
        const checkFPS = () => {
            frameCount++;
            const currentTime = Date.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Если FPS ниже 30, уменьшаем количество частиц
                if (fps < 30) {
                    this.maxParticles = Math.max(20, this.maxParticles - 10);
                } else if (fps > 50 && this.maxParticles < 50) {
                    this.maxParticles = Math.min(50, this.maxParticles + 5);
                }
            }
            
            if (this.isActive) {
                requestAnimationFrame(checkFPS);
            }
        };
        
        requestAnimationFrame(checkFPS);
    }
    
    // Создание эффектов для битвы
    createBattleEffect(type, x = 50, y = 50) {
        if (!this.isActive) return;
        
        switch (type) {
            case 'sparks':
                this.createSparks(x, y);
                break;
            case 'magic-circle':
                this.createMagicCircle(x, y);
                break;
            case 'victory-burst':
                this.createVictoryBurst(x, y);
                break;
            case 'defeat-smoke':
                this.createDefeatSmoke(x, y);
                break;
        }
    }
    
    createSparks(x, y) {
        const sparkCount = 8;
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = x + '%';
            spark.style.top = y + '%';
            
            // Случайное направление полёта
            const angle = (360 / sparkCount) * i + Math.random() * 45;
            const distance = 30 + Math.random() * 30;
            const sparkX = Math.cos(angle * Math.PI / 180) * distance;
            const sparkY = Math.sin(angle * Math.PI / 180) * distance;
            
            spark.style.setProperty('--spark-x', sparkX + 'px');
            spark.style.setProperty('--spark-y', sparkY + 'px');
            
            this.container.appendChild(spark);
            
            setTimeout(() => {
                if (smoke.parentNode) {
                    smoke.parentNode.removeChild(smoke);
                }
            }, 3000);
        }
    }
    
    // Эффект тряски экрана
    shakeScreen() {
        document.body.classList.add('screen-shake');
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 500);
    }
    
    // Глитч эффект
    glitchEffect(element) {
        element.classList.add('glitch-effect');
        setTimeout(() => {
            element.classList.remove('glitch-effect');
        }, 300);
    }
    
    // Управление активностью системы
    pause() {
        this.isActive = false;
    }
    
    resume() {
        this.isActive = true;
    }
    
    // Полная очистка
    destroy() {
        this.isActive = false;
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.particles = [];
    }
}

// Инициализация системы частиц после загрузки DOM
let particleSystem;

document.addEventListener('DOMContentLoaded', () => {
    particleSystem = new ParticleSystem();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
                if (spark.parentNode) {
                    spark.parentNode.removeChild(spark);
                }
            }, 800);
        }
    }
    
    createMagicCircle(x, y) {
        const circle = document.createElement('div');
        circle.className = 'magic-circle';
        circle.style.left = x + '%';
        circle.style.top = y + '%';
        
        this.container.appendChild(circle);
        
        setTimeout(() => {
            if (circle.parentNode) {
                circle.parentNode.removeChild(circle);
            }
        }, 1000);
    }
    
    createVictoryBurst(x, y) {
        const burstCount = 12;
        for (let i = 0; i < burstCount; i++) {
            const burst = document.createElement('div');
            burst.className = 'victory-burst';
            
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            
            burst.style.left = (x + offsetX) + '%';
            burst.style.top = (y + offsetY) + '%';
            burst.style.animationDelay = (Math.random() * 0.5) + 's';
            
            this.container.appendChild(burst);
            
            setTimeout(() => {
                if (burst.parentNode) {
                    burst.parentNode.removeChild(burst);
                }
            }, 2000);
        }
    }
    
    createDefeatSmoke(x, y) {
        const smokeCount = 5;
        for (let i = 0; i < smokeCount; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'defeat-smoke';
            
            const offsetX = (Math.random() - 0.5) * 20;
            smoke.style.left = (x + offsetX) + '%';
            smoke.style.top = y + '%';
            smoke.style.animationDelay = (i * 0.2) + 's';
            
            this.container.appendChild(smoke);
            
            setTimeout(() => {
                