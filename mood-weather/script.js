// ==================== State Management ====================
const state = {
    currentMood: null,
    moods: [],
    streak: 0
};

// ==================== DOM Elements ====================
const elements = {
    weatherIcon: document.getElementById('weatherIcon'),
    weatherParticles: document.getElementById('weatherParticles'),
    moodTitle: document.getElementById('moodTitle'),
    moodDescription: document.getElementById('moodDescription'),
    currentDate: document.getElementById('currentDate'),
    moodStreak: document.getElementById('moodStreak'),
    noteSection: document.getElementById('noteSection'),
    moodNote: document.getElementById('moodNote'),
    charCount: document.getElementById('charCount'),
    saveMoodBtn: document.getElementById('saveMoodBtn'),
    weekGrid: document.getElementById('weekGrid'),
    historyBtn: document.getElementById('historyBtn'),
    historyModal: document.getElementById('historyModal'),
    historyModalOverlay: document.getElementById('historyModalOverlay'),
    closeHistoryModal: document.getElementById('closeHistoryModal'),
    historyList: document.getElementById('historyList'),
    totalDays: document.getElementById('totalDays'),
    currentStreakDisplay: document.getElementById('currentStreak'),
    bestMood: document.getElementById('bestMood'),
    moodCards: document.querySelectorAll('.mood-card')
};

// ==================== Mood Data ====================
const moodData = {
    amazing: {
        icon: '☀️',
        title: 'Harika',
        description: 'Güneşli ve parlak bir gün!',
        particles: '✨',
        color: '#ffd700'
    },
    good: {
        icon: '🌤️',
        title: 'İyi',
        description: 'Parçalı bulutlu ama güzel',
        particles: '☁️',
        color: '#60a5fa'
    },
    okay: {
        icon: '⛅',
        title: 'İdare Eder',
        description: 'Bulutlu ama fena değil',
        particles: '☁️',
        color: '#a78bfa'
    },
    meh: {
        icon: '☁️',
        title: 'Eh İşte',
        description: 'Kapalı bir hava',
        particles: '☁️',
        color: '#94a3b8'
    },
    bad: {
        icon: '🌧️',
        title: 'Kötü',
        description: 'Yağmurlu bir gün',
        particles: '💧',
        color: '#60a5fa'
    },
    terrible: {
        icon: '⛈️',
        title: 'Berbat',
        description: 'Fırtınalı hava',
        particles: '⚡',
        color: '#6366f1'
    }
};

// ==================== Initialization ====================
function init() {
    loadMoods();
    updateCurrentDate();
    updateStreak();
    renderWeekGrid();
    attachEventListeners();
}

// ==================== Event Listeners ====================
function attachEventListeners() {
    // Mood card selection
    elements.moodCards.forEach(card => {
        card.addEventListener('click', () => selectMood(card));
    });

    // Note character count
    elements.moodNote.addEventListener('input', updateCharCount);

    // Save mood
    elements.saveMoodBtn.addEventListener('click', saveMood);

    // History modal
    elements.historyBtn.addEventListener('click', openHistoryModal);
    elements.closeHistoryModal.addEventListener('click', closeHistoryModal);
    elements.historyModalOverlay.addEventListener('click', closeHistoryModal);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.historyModal.classList.contains('active')) {
            closeHistoryModal();
        }
    });
}

// ==================== Mood Selection ====================
function selectMood(card) {
    // Remove active class from all cards
    elements.moodCards.forEach(c => c.classList.remove('active'));

    // Add active class to selected card
    card.classList.add('active');

    // Get mood data
    const mood = card.dataset.mood;
    const data = moodData[mood];

    // Update state
    state.currentMood = mood;

    // Update UI
    updateWeatherDisplay(data);

    // Show note section with animation
    elements.noteSection.style.display = 'block';

    // Scroll to note section smoothly
    setTimeout(() => {
        elements.noteSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// ==================== Weather Display ====================
function updateWeatherDisplay(data) {
    // Update icon with animation
    elements.weatherIcon.style.transform = 'scale(0)';
    setTimeout(() => {
        elements.weatherIcon.textContent = data.icon;
        elements.weatherIcon.style.transform = 'scale(1)';
    }, 200);

    // Update text
    elements.moodTitle.textContent = data.title;
    elements.moodDescription.textContent = data.description;

    // Create particles
    createParticles(data.particles);
}

// ==================== Particle Effects ====================
function createParticles(particleIcon) {
    elements.weatherParticles.innerHTML = '';

    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.textContent = particleIcon;
        particle.style.position = 'absolute';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        particle.style.animation = `particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';

        elements.weatherParticles.appendChild(particle);
    }
}

// Add particle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(10px, -10px) rotate(90deg);
        }
        50% {
            transform: translate(-10px, -20px) rotate(180deg);
        }
        75% {
            transform: translate(-20px, -10px) rotate(270deg);
        }
    }
`;
document.head.appendChild(style);

// ==================== Save Mood ====================
function saveMood() {
    if (!state.currentMood) {
        alert('Lütfen bir ruh hali seçin!');
        return;
    }

    const moodEntry = {
        mood: state.currentMood,
        note: elements.moodNote.value.trim(),
        date: new Date().toISOString(),
        timestamp: Date.now()
    };

    // Add to moods array
    state.moods.unshift(moodEntry);

    // Save to localStorage
    saveMoods();

    // Update UI
    updateStreak();
    renderWeekGrid();

    // Show success feedback
    showSuccessFeedback();

    // Reset form
    resetMoodForm();
}

function showSuccessFeedback() {
    const originalText = elements.saveMoodBtn.innerHTML;
    elements.saveMoodBtn.innerHTML = '<span class="btn-icon">✓</span> Kaydedildi!';
    elements.saveMoodBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

    setTimeout(() => {
        elements.saveMoodBtn.innerHTML = originalText;
        elements.saveMoodBtn.style.background = '';
    }, 2000);
}

function resetMoodForm() {
    elements.moodCards.forEach(c => c.classList.remove('active'));
    elements.moodNote.value = '';
    elements.noteSection.style.display = 'none';
    state.currentMood = null;

    // Reset weather display
    elements.weatherIcon.textContent = '🌤️';
    elements.moodTitle.textContent = 'Bugün Nasılsın?';
    elements.moodDescription.textContent = 'Ruh halini seç ve günlük takibini başlat';
    elements.weatherParticles.innerHTML = '';
}

// ==================== Character Count ====================
function updateCharCount() {
    const count = elements.moodNote.value.length;
    elements.charCount.textContent = `${count}/500`;
}

// ==================== Date & Time ====================
function updateCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    elements.currentDate.textContent = now.toLocaleDateString('tr-TR', options);
}

// ==================== Streak Calculation ====================
function updateStreak() {
    const streak = calculateStreak();
    state.streak = streak;
    elements.moodStreak.textContent = `🔥 ${streak} gün`;
}

function calculateStreak() {
    if (state.moods.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < state.moods.length; i++) {
        const moodDate = new Date(state.moods[i].date);
        moodDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - moodDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// ==================== Week Grid ====================
function renderWeekGrid() {
    elements.weekGrid.innerHTML = '';

    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayMood = state.moods.find(m => {
            const moodDate = new Date(m.date);
            moodDate.setHours(0, 0, 0, 0);
            return moodDate.getTime() === date.getTime();
        });

        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${!dayMood ? 'empty' : ''}`;

        dayCard.innerHTML = `
            <div class="day-name">${days[date.getDay() === 0 ? 6 : date.getDay() - 1]}</div>
            <div class="day-icon">${dayMood ? moodData[dayMood.mood].icon : '⚪'}</div>
            <div class="day-date">${date.getDate()}</div>
        `;

        elements.weekGrid.appendChild(dayCard);
    }
}

// ==================== History Modal ====================
function openHistoryModal() {
    elements.historyModal.classList.add('active');
    renderHistory();
    updateStats();
}

function closeHistoryModal() {
    elements.historyModal.classList.remove('active');
}

function renderHistory() {
    if (state.moods.length === 0) {
        elements.historyList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--color-text-muted);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                <p>Henüz kayıtlı ruh hali yok</p>
            </div>
        `;
        return;
    }

    elements.historyList.innerHTML = state.moods.map(mood => {
        const date = new Date(mood.date);
        const data = moodData[mood.mood];

        return `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-mood">
                        <span>${data.icon}</span>
                        <span>${data.title}</span>
                    </div>
                    <div class="history-date">${date.toLocaleDateString('tr-TR')}</div>
                </div>
                ${mood.note ? `<div class="history-note">${mood.note}</div>` : ''}
            </div>
        `;
    }).join('');
}

function updateStats() {
    elements.totalDays.textContent = state.moods.length;
    elements.currentStreakDisplay.textContent = state.streak;

    // Find best mood (most amazing days)
    const moodCounts = {};
    state.moods.forEach(m => {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });

    const bestMoodKey = Object.keys(moodCounts).reduce((a, b) =>
        moodCounts[a] > moodCounts[b] ? a : b, 'amazing'
    );

    elements.bestMood.textContent = moodData[bestMoodKey]?.icon || '-';
}

// ==================== LocalStorage ====================
function saveMoods() {
    localStorage.setItem('moodWeatherData', JSON.stringify(state.moods));
}

function loadMoods() {
    const saved = localStorage.getItem('moodWeatherData');
    if (saved) {
        state.moods = JSON.parse(saved);
    }
}

// ==================== Start App ====================
init();
