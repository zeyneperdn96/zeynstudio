document.addEventListener('DOMContentLoaded', () => {

    const world = document.getElementById('world');
    const sections = document.querySelectorAll('.level-card-wrapper');
    const xpDisplay = document.getElementById('xp-display');
    const lvlDisplay = document.getElementById('lvl-display');
    const themeBtn = document.getElementById('theme-toggle');
    const cursor = document.getElementById('cursor');

    // --- 1. MOUSE WHEEL SCROLL ---
    world.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            world.scrollLeft += e.deltaY;
        }
    });

    // --- 2. KEYBOARD NAV (THROTTLED) ---
    let isThrottled = false;

    document.addEventListener('keydown', (e) => {
        // Only care about arrows
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

        if (isThrottled) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        // Find current focused/centered item
        // We can trust the 'active' class from observer
        let currentIndex = Array.from(sections).findIndex(sec => sec.classList.contains('active'));
        if (currentIndex === -1) currentIndex = 0;

        let nextIndex = currentIndex;

        if (e.key === 'ArrowRight') {
            if (currentIndex < sections.length - 1) nextIndex++;
        } else if (e.key === 'ArrowLeft') {
            if (currentIndex > 0) nextIndex--;
        }

        if (nextIndex !== currentIndex) {
            isThrottled = true;
            sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            setTimeout(() => { isThrottled = false; }, 500); // 500ms Throttle
        }
    });

    // --- 3. OBSERVER (For Active State & HUD) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update Active Class
                sections.forEach(s => s.classList.remove('active'));
                entry.target.classList.add('active');

                // Update HUD
                lvlDisplay.innerText = entry.target.getAttribute('data-lvl');
                xpDisplay.innerText = entry.target.getAttribute('data-xp');
            }
        });
    }, {
        root: world,
        threshold: 0.55 // >50% visibility
    });

    sections.forEach(sec => observer.observe(sec));

    // --- 4. THEME TOGGLE ---
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme') || 'dark';
        html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    });

    // --- 5. CURSOR FOLLOW ---
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.transform = 'translate(-50%, -50%)';
    });

});
