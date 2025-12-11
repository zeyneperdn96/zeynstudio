document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('game-cursor');
    const xpCounter = document.getElementById('xp-counter');
    const levelIndicator = document.getElementById('level-indicator');
    const gameWorld = document.querySelector('.game-world');
    const levels = document.querySelectorAll('.game-level');

    // Custom Cursor Logic
    document.addEventListener('mousemove', (e) => {
        // Simple follow with slight delay (CSS transition handles smoothing)
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Hover effects for cursor
    const interactables = document.querySelectorAll('a, .level-card, .level-marker');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // Level Tracking on Scroll
    let currentXP = 0;

    // Intersection Observer to detect active level
    const observerOptions = {
        root: gameWorld,
        threshold: 0.6 // Trigger when 60% visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get level number from class level-X or id
                const id = entry.target.id;
                let levelNum = 1;

                if (id === 'level-5') levelNum = 5;
                if (id === 'level-12') levelNum = 12;
                if (id === 'level-18') levelNum = 18;
                if (id === 'level-final') levelNum = 30;

                updateHUD(levelNum);

                // Add "active" class for animations
                levels.forEach(l => l.classList.remove('active-level'));
                entry.target.classList.add('active-level');
            }
        });
    }, observerOptions);

    levels.forEach(level => observer.observe(level));

    function updateHUD(level) {
        // Animate numbers
        levelIndicator.innerText = level;

        // XP calculation (arbitrary based on level)
        const targetXP = level * 1000;
        animateValue(xpCounter, parseInt(xpCounter.innerText), targetXP, 500);
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Scroll Wheel Horizontal Mapping
    gameWorld.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            gameWorld.scrollLeft += e.deltaY;
        }
    });

});
