document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    const menuItems = document.querySelectorAll('.menu-item');
    const addStarsBtn = document.querySelector('.add-stars');
    const buyNftBtn = document.querySelector('.buy-nft');
    const backToMenuBtn = document.querySelector('.back-to-menu');
    const closeModalBtn = document.querySelector('.close-modal');
    const buyStarsModal = document.querySelector('.modal.buy-stars');
    const searchingModal = document.querySelector('.modal.searching');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            showSection(item.dataset.section);
        });
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            showSection(item.dataset.section);
        });
    });

    addStarsBtn.addEventListener('click', () => {
        buyStarsModal.classList.remove('hidden');
    });

    buyNftBtn.addEventListener('click', () => {
        buyStarsModal.classList.remove('hidden');
    });

    backToMenuBtn.addEventListener('click', () => {
        showSection('battle');
    });

    closeModalBtn.addEventListener('click', () => {
        buyStarsModal.classList.add('hidden');
    });

    // Show searching modal on battle section load
    showSection('battle');
    searchingModal.classList.remove('hidden');
    setTimeout(() => {
        searchingModal.classList.add('hidden');
    }, 2000);
});
