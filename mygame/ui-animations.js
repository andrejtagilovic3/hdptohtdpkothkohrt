let animationSettings = {
    enabled: true,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

function initUIAnimations() {
    if (!animationSettings.enabled || animationSettings.reducedMotion) return;

    setupButtonAnimations();
    setupNavAnimations();
    setupStarAnimations();
    setupHoverEffects();
    setupScrollAnimations();
}

function setupButtonAnimations() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('play-btn') || 
            e.target.classList.contains('nft-card-btn') ||
            e.target.classList.contains('nav-item')) {
            
            const button = e.target;
            button.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        }
    });
}

function setupNavAnimations() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('nav-active-pulse'));
            
            setTimeout(() => {
                item.classList.add('nav-active-pulse');
            }, 50);
        });
    });
}

function setupStarAnimations() {
    const originalUpdateUI = window.updateUI;
    
    window.updateUI = function() {
        const starCountElement = document.getElementById('star-count');
        const oldValue = starCountElement.textContent;
        
        originalUpdateUI();
        
        const newValue = starCountElement.textContent;
        
        if (oldValue !== newValue) {
            starCountElement.classList.add('star-count-update');
            
            setTimeout(() => {
                starCountElement.classList.remove('star-count-update');
            }, 500);
        }
    };
}

function setupHoverEffects() {
    const nftCards = document.querySelectorAll('.nft-card');
    
    nftCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (animationSettings.enabled) {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function animateHPChange(element, newWidth, isPlayer = true) {
    if (!animationSettings.enabled) {
        element.style.width = newWidth + '%';
        return;
    }

    const duration = 800;
    const startWidth = parseFloat(element.style.width) || 100;
    const endWidth = newWidth;
    const startTime = performance.now();

    function updateWidth(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentWidth = startWidth + (endWidth - startWidth) * easeOut;
        
        element.style.width = currentWidth + '%';
        
        if (currentWidth <= 25) {
            element.classList.add('critical');
        } else {
            element.classList.remove('critical');
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateWidth);
        }
    }
    
    requestAnimationFrame(updateWidth);
}

function animateBattleLog(message) {
    const battleLog = document.getElementById('battle-log');
    if (!battleLog) return;

    battleLog.style.opacity = '0';
    battleLog.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        battleLog.textContent = message;
        battleLog.style.opacity = '1';
        battleLog.style.transform = 'translateY(0)';
        battleLog.style.transition = 'all 0.3s ease-out';
    }, 100);
}

function animateNFTCardAppear(cards) {
    if (!animationSettings.enabled) return;
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'all 0.4s ease-out';
        }, index * 100);
    });
}

function animateModalOpen(modal) {
    if (!animationSettings.enabled) return;
    
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9) translateY(20px)';
    
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1) translateY(0)';
        modal.style.transition = 'all 0.3s ease-out';
    });
}

function animateModalClose(modal, callback) {
    if (!animationSettings.enabled) {
        if (callback) callback();
        return;
    }
    
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9) translateY(20px)';
    modal.style.transition = 'all 0.2s ease-in';
    
    setTimeout(() => {
        if (callback) callback();
    }, 200);
}

function animateScreenTransition(fromScreen, toScreen) {
    if (!animationSettings.enabled) {
        if (fromScreen) fromScreen.classList.remove('active');
        if (toScreen) toScreen.classList.add('active');
        return;
    }

    if (fromScreen) {
        fromScreen.style.opacity = '0';
        fromScreen.style.transform = 'translateX(-30px)';
        fromScreen.style.transition = 'all 0.2s ease-in';
        
        setTimeout(() => {
            fromScreen.classList.remove('active');
            fromScreen.style.opacity = '';
            fromScreen.style.transform = '';
            fromScreen.style.transition = '';
        }, 200);
    }
    
    if (toScreen) {
        setTimeout(() => {
            toScreen.classList.add('active');
            toScreen.style.opacity = '0';
            toScreen.style.transform = 'translateX(30px)';
            
            requestAnimationFrame(() => {
                toScreen.style.opacity = '1';
                toScreen.style.transform = 'translateX(0)';
                toScreen.style.transition = 'all 0.3s ease-out';
                
                setTimeout(() => {
                    toScreen.style.opacity = '';
                    toScreen.style.transform = '';
                    toScreen.style.transition = '';
                }, 300);
            });
        }, fromScreen ? 100 : 0);
    }
}

function animateStarReward(amount) {
    if (!animationSettings.enabled) return;
    
    const starElement = document.querySelector('.currency-item');
    if (!starElement) return;
    
    for (let i = 0; i < Math.min(amount / 10, 5); i++) {
        setTimeout(() => {
            createFloatingStarEffect(starElement);
        }, i * 200);
    }
}

function createFloatingStarEffect(element) {
    const star = document.createElement('div');
    star.innerHTML = '<i class="fas fa-star"></i>';
    star.style.position = 'absolute';
    star.style.color = '#ffd700';
    star.style.fontSize = '20px';
    star.style.pointerEvents = 'none';
    star.style.zIndex = '9999';
    
    const rect = element.getBoundingClientRect();
    star.style.left = rect.left + Math.random() * rect.width + 'px';
    star.style.top = rect.top + 'px';
    
    document.body.appendChild(star);
    
    const animation = star.animate([
        {
            transform: 'translateY(0) scale(1)',
            opacity: 1
        },
        {
            transform: 'translateY(-100px) scale(0.5)',
            opacity: 0
        }
    ], {
        duration: 1500,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        if (star.parentNode) {
            star.parentNode.removeChild(star);
        }
    };
}

function animateUpgradeSuccess(nftElement) {
    if (!animationSettings.enabled || !nftElement) return;
    
    const originalTransform = nftElement.style.transform;
    
    nftElement.style.transform = 'scale(1.1)';
    nftElement.style.filter = 'brightness(1.3) saturate(1.5)';
    nftElement.style.transition = 'all 0.3s ease-out';
    
    setTimeout(() => {
        nftElement.style.transform = originalTransform;
        nftElement.style.filter = '';
    }, 600);
    
    createUpgradeParticles(nftElement);
}

function createUpgradeParticles(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63'];
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const endX = startX + Math.cos(angle) * distance;
            const endY = startY + Math.sin(angle) * distance;
            
            const animation = particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }, i * 50);
    }
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.nft-card, .battle-history-item, .friend-item').forEach(el => {
        observer.observe(el);
    });
}

function animateBattleHit(targetElement, isCritical = false) {
    if (!animationSettings.enabled || !targetElement) return;
    
    const hitEffect = document.createElement('div');
    hitEffect.style.position = 'absolute';
    hitEffect.style.top = '50%';
    hitEffect.style.left = '50%';
    hitEffect.style.transform = 'translate(-50%, -50%)';
    hitEffect.style.pointerEvents = 'none';
    hitEffect.style.zIndex = '1000';
    hitEffect.style.fontSize = isCritical ? '24px' : '18px';
    hitEffect.style.color = isCritical ? '#ff1744' : '#ffffff';
    hitEffect.style.fontWeight = 'bold';
    hitEffect.textContent = isCritical ? 'CRIT!' : 'HIT!';
    
    targetElement.style.position = 'relative';
    targetElement.appendChild(hitEffect);
    
    const animation = hitEffect.animate([
        {
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0.5)'
        },
        {
            opacity: 1,
            transform: 'translate(-50%, -70%) scale(1)'
        },
        {
            opacity: 0,
            transform: 'translate(-50%, -90%) scale(0.8)'
        }
    ], {
        duration: 1200,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        if (hitEffect.parentNode) {
            hitEffect.parentNode.removeChild(hitEffect);
        }
    };
}

window.animateHPChange = animateHPChange;
window.animateBattleLog = animateBattleLog;
window.animateNFTCardAppear = animateNFTCardAppear;
window.animateModalOpen = animateModalOpen;
window.animateModalClose = animateModalClose;
window.animateScreenTransition = animateScreenTransition;
window.animateStarReward = animateStarReward;
window.animateUpgradeSuccess = animateUpgradeSuccess;
window.animateBattleHit = animateBattleHit;