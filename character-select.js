// Character Data
const characters = [
    {
        id: 0,
        name: "COMMANDER REVA CHEN",
        role: "TACTICAL OPERATIONS LEAD",
        rank: "CDR",
        silhouette: "commander",
        description: "A veteran of the Andromeda Conflict, Commander Chen brings 15 years of tactical expertise to the Stellar Vanguard. Known for her calm demeanor under pressure and strategic brilliance in multi-front engagements.",
        stats: { speed: 75, skill: 92, stamina: 68, intelligence: 88 },
        ability: { name: "TACTICAL OVERDRIVE", desc: "Boost team coordination by 40% for 10 seconds" }
    },
    {
        id: 1,
        name: "CHIEF BORIS VOLKOV",
        role: "SYSTEMS ENGINEER",
        rank: "CHF",
        silhouette: "engineer",
        description: "Former deep-space mining engineer turned military specialist. Volkov can repair any system under any condition, from zero-G hull breaches to electromagnetic interference zones. His modifications are legendary.",
        stats: { speed: 55, skill: 96, stamina: 82, intelligence: 91 },
        ability: { name: "EMERGENCY REPAIR", desc: "Instantly restore 60% of ship systems integrity" }
    },
    {
        id: 2,
        name: "DR. AMARA OSEI",
        role: "CHIEF MEDICAL OFFICER",
        rank: "CMO",
        silhouette: "medic",
        description: "Pioneered xenobiology treatment protocols during first contact missions. Dr. Osei's medical expertise spans human physiology to alien biochemistry, making her invaluable for deep space exploration.",
        stats: { speed: 62, skill: 88, stamina: 70, intelligence: 98 },
        ability: { name: "NANO REGENERATION", desc: "Heal all crew members for 35% health over 8 seconds" }
    },
    {
        id: 3,
        name: "LT. KIRA TANAKA",
        role: "CHIEF PILOT",
        rank: "LT",
        silhouette: "pilot",
        description: "Youngest pilot to complete the Kepler Run. Tanaka's reflexes are enhanced with neural-link technology, allowing split-second maneuvers that seem impossible to conventional pilots.",
        stats: { speed: 98, skill: 85, stamina: 72, intelligence: 78 },
        ability: { name: "HYPERDRIFT", desc: "Evade all incoming attacks for 5 seconds" }
    }
];

let selectedCharacter = 0;

// DOM Elements
const characterCards = document.querySelectorAll('.character-card');
const characterName = document.getElementById('characterName');
const characterRole = document.getElementById('characterRole');
const characterDesc = document.getElementById('characterDesc');
const rankBadge = document.getElementById('rankBadge');
const abilityCard = document.getElementById('abilityCard');
const statSpeed = document.getElementById('statSpeed');
const statSkill = document.getElementById('statSkill');
const statStamina = document.getElementById('statStamina');
const statIntel = document.getElementById('statIntel');
const silhouettes = document.querySelectorAll('.silhouette');

// Update character display
function updateCharacterDisplay(index) {
    const char = characters[index];

    // Update text content
    characterName.textContent = char.name;
    characterRole.textContent = char.role;
    characterDesc.textContent = char.description;
    rankBadge.textContent = char.rank;

    // Update ability
    abilityCard.querySelector('.ability-name').textContent = char.ability.name;
    abilityCard.querySelector('.ability-desc').textContent = char.ability.desc;

    // Update stats with animation
    updateStat(statSpeed, char.stats.speed);
    updateStat(statSkill, char.stats.skill);
    updateStat(statStamina, char.stats.stamina);
    updateStat(statIntel, char.stats.intelligence);

    // Update silhouette
    silhouettes.forEach(s => s.classList.remove('active'));
    document.getElementById(`silhouette-${char.silhouette}`).classList.add('active');
}

function updateStat(statElement, value) {
    statElement.style.setProperty('--stat-value', value + '%');
    const valueDisplay = statElement.parentElement.querySelector('.stat-value');
    if (valueDisplay) {
        animateValue(valueDisplay, parseInt(valueDisplay.textContent) || 0, value, 500);
    }
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(start + (end - start) * easeProgress);
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// Character card click handlers
characterCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (selectedCharacter === index) return;
        characterCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCharacter = index;
        updateCharacterDisplay(index);
    });

    // Hover sound effect simulation
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    });
});

// Button handlers
document.querySelector('.btn-select').addEventListener('click', () => {
    const char = characters[selectedCharacter];
    const btn = document.querySelector('.btn-select');
    btn.textContent = 'DEPLOYING...';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        btn.innerHTML = '<span class="btn-text">DEPLOY</span><span class="btn-icon">►</span><div class="btn-shine"></div>';
        btn.style.pointerEvents = 'auto';
        // In a real game, this would transition to the next screen
    }, 1500);
});

document.querySelector('.btn-back').addEventListener('click', () => {
    // In a real game, this would go back to the previous screen
});

// Navigation arrows
document.querySelector('.nav-arrow.prev').addEventListener('click', () => {
    if (selectedCharacter > 0) {
        characterCards[selectedCharacter - 1].click();
    }
});

document.querySelector('.nav-arrow.next').addEventListener('click', () => {
    if (selectedCharacter < characters.length - 1) {
        characterCards[selectedCharacter + 1].click();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && selectedCharacter > 0) {
        characterCards[selectedCharacter - 1].click();
    } else if (e.key === 'ArrowRight' && selectedCharacter < characters.length - 1) {
        characterCards[selectedCharacter + 1].click();
    } else if (e.key === 'Enter') {
        document.querySelector('.btn-select').click();
    } else if (e.key === 'Escape') {
        document.querySelector('.btn-back').click();
    }
});

// Initialize
updateCharacterDisplay(0);
