/* Courier Pro B2B Logic */

const state = {
    screen: 'screen-splash', // Current full screen
    tab: 'tab-home', // Current tab
    theme: localStorage.getItem('theme') || 'light',

    // Auth & Profile
    isAuthenticated: false,
    isOnboardingComplete: false,

    // Shift & Tasks
    isOnline: false,
    activeTask: null, // null | 'assigned'
    taskStep: 0 // 0: Go to Pickup, 1: At Pickup, 2: Go to Drop, 3: At Drop
};

// --- Lifecycle ---
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);

    // Simulate Splash -> Login
    setTimeout(() => {
        showScreen('screen-login');
    }, 2500);
});

// --- Navigation ---
function showScreen(id) {
    // Hide all views first
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));

    // Show target
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');

    // Bottom Nav Visibility Logic
    // Only show on Tab screens
    const isTab = id.startsWith('tab-');
    const nav = document.getElementById('bottom-nav');

    if (isTab) {
        // We actually have a container logic for tabs in the HTML structure
        // Let's assume tabs are just content divs inside MAIN APP mode.
        // Wait, in this HTML structure tabs are divs with class 'view-content'.
        // So we need to show the 'tab content' and hide 'screens'.

        // Hide screens again?
        // Actually, let's treat 'tab-...' as a mode.
        // If switching to a tab, we likely want to ensure we aren't in a full screen view.

        // Hide full screens
        document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
        // Show the tab content
        document.querySelectorAll('.view-content').forEach(el => el.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');

        nav.classList.remove('hidden');
        updateNavState(id);
    } else {
        // Full screen mode
        document.querySelectorAll('.view-content').forEach(el => el.classList.add('hidden'));
        nav.classList.add('hidden');
    }
}

function switchTab(tabId) {
    showScreen(tabId);
}

function updateNavState(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    // Simple mapping: 0=home, 1=tasks, 2=profile
    const map = { 'tab-home': 0, 'tab-tasks': 1, 'tab-settings': 2 };
    const items = document.querySelectorAll('.nav-item');
    if (items[map[tabId]]) items[map[tabId]].classList.add('active');
}

// --- Auth Flow ---
function goToOTP() {
    const phone = document.getElementById('login-phone').value;
    if (phone.length < 3) return alert('Lütfen numara giriniz.');
    document.getElementById('otp-phone-display').innerText = phone;
    showScreen('screen-otp');
}

function goBack(id) {
    showScreen(id);
}

function handleLogin() {
    // Check if new user -> Onboarding, else -> Home
    // Demo: Always Onboarding for now
    showScreen('screen-onb-profile');
}

// --- Onboarding Flow ---
function finishOnboarding() {
    // Simulate server approval
    setTimeout(() => {
        state.isOnboardingComplete = true;
        state.isAuthenticated = true;
        showScreen('tab-home');
    }, 1000);
}

// --- Shift Logic ---
function toggleShift() {
    state.isOnline = !state.isOnline;
    updateHomeUI();
}

function updateHomeUI() {
    const btn = document.getElementById('btn-shift-toggle');
    const badge = document.getElementById('status-badge');
    const text = document.getElementById('shift-status-text');
    const emptyState = document.getElementById('home-empty-state');
    const activeTaskWrapper = document.getElementById('active-task-wrapper');

    if (state.activeTask) {
        // If task active, override shift UI
        btn.classList.add('hidden');
        activeTaskWrapper.classList.remove('hidden');
        emptyState.classList.add('hidden');
        badge.innerText = 'GÖREVDE';
        badge.className = 'badge badge-info';
        return;
    }

    // Default Shift UI
    activeTaskWrapper.classList.add('hidden');
    btn.classList.remove('hidden');

    if (state.isOnline) {
        btn.innerText = 'ONLINE (DURDUR)';
        btn.classList.remove('btn-action');
        btn.classList.add('btn-success'); // Or secondary outline

        badge.innerText = 'ONLINE';
        badge.className = 'badge badge-success';
        text.innerText = 'İş aranıyor...';

        emptyState.classList.remove('hidden');
    } else {
        btn.innerText = 'ONLINE OL';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-action');

        badge.innerText = 'OFFLINE';
        badge.className = 'badge badge-neutral';
        text.innerText = 'Mesai Kapalı';

        emptyState.classList.add('hidden');
    }
}

// --- Task Flow ---
function simulateIncomingTask() {
    if (!state.isOnline) return alert('Önce Online Olun.');
    state.activeTask = 'assigned';
    updateHomeUI();
}

function goToTaskDetail() {
    // Show full screen task flow
    state.taskStep = 0;
    updateTaskFlowUI();
    showScreen('screen-task-flow');
}

function advanceTaskFlow() {
    state.taskStep++;
    updateTaskFlowUI();
}

function updateTaskFlowUI() {
    const title = document.getElementById('task-title');
    const desc = document.getElementById('task-desc');
    const btn = document.getElementById('btn-flow-action');
    const badge = document.getElementById('task-status-badge');
    const step1 = document.getElementById('flow-step-1');
    const step2 = document.getElementById('flow-step-2');
    const step3 = document.getElementById('flow-step-3');

    // Reset styles
    [step1, step2, step3].forEach(el => { el.className = 'w-3 h-3 rounded-full bg-border-color'; });

    if (state.taskStep === 0) {
        // Go to Pickup
        title.innerText = 'Alış Noktasına Git';
        desc.innerText = 'Paketi teslim almak için belirtilen adrese gidin.';
        btn.innerText = 'ALIŞ NOKTASINA ULAŞTIM';
        badge.innerText = 'YOLDA';
        badge.className = 'badge badge-warning';
        step1.className = 'w-3 h-3 rounded-full bg-secondary';

    } else if (state.taskStep === 1) {
        // At Pickup -> Collect
        title.innerText = 'Paketi Teslim Al';
        desc.innerText = 'Gönderici: Eczane Depo Yetkilisi. 2 Koli.';
        btn.innerText = 'PAKETİ TESLİM ALDIM';
        badge.className = 'badge badge-info';
        step1.className = 'w-3 h-3 rounded-full bg-success';
        step2.className = 'w-3 h-3 rounded-full bg-secondary';

    } else if (state.taskStep === 2) {
        // Go to Dropoff
        title.innerText = 'Teslimat Noktasına Git';
        desc.innerText = 'Rota oluşturuldu. Tahmini varış 15dk.';
        btn.innerText = 'TESLİMAT NOKTASINA ULAŞTIM';
        badge.innerText = 'DAĞITIMDA';
        badge.className = 'badge badge-warning';
        step1.className = 'w-3 h-3 rounded-full bg-success';
        step2.className = 'w-3 h-3 rounded-full bg-success';
        step3.className = 'w-3 h-3 rounded-full bg-secondary';

    } else if (state.taskStep === 3) {
        // At Dropoff -> Complete
        title.innerText = 'Teslimatı Tamamla';
        desc.innerText = 'Alıcı: Eczacı Beyza Y. (Doğrulama kodu isteyin)';
        btn.innerText = 'GÖREVİ TAMAMLA';
        badge.className = 'badge badge-info';
        step1.className = 'w-3 h-3 rounded-full bg-success';
        step2.className = 'w-3 h-3 rounded-full bg-success';
        step3.className = 'w-3 h-3 rounded-full bg-secondary';

    } else {
        // Done
        alert('Görev Başarıyla Tamamlandı!');
        state.activeTask = null;
        state.taskStep = 0;
        showScreen('tab-home');
        updateHomeUI();
    }
}

function cancelTask() {
    if (confirm('Görevi iptal etmek istediğinize emin misiniz?')) {
        state.activeTask = null;
        state.taskStep = 0;
        showScreen('tab-home');
        updateHomeUI();
    }
}

// --- Settings ---
function logout() {
    state.isAuthenticated = false;
    state.isOnline = false;
    showScreen('screen-login');
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(state.theme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const lbl = document.getElementById('label-theme');
    if (lbl) lbl.innerText = theme === 'dark' ? 'Açık' : 'Kapalı';
    localStorage.setItem('theme', theme);
}
