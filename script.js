/**
 * ZeynStudio OS - Interactive Portfolio
 * A Modern-Retro Desktop Experience
 */

// ========== APP CONTENT DATA ==========
const appContent = {
  about: {
    title: 'About Me',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    </svg>`,
    content: `
      <div class="about-header">
        <div class="about-avatar">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="url(#aboutAvatarGrad)"/>
            <circle cx="50" cy="38" r="18" fill="white" opacity="0.9"/>
            <ellipse cx="50" cy="80" rx="30" ry="25" fill="white" opacity="0.9"/>
            <defs>
              <linearGradient id="aboutAvatarGrad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stop-color="#64B5A0"/>
                <stop offset="100%" stop-color="#4A9A87"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="about-info">
          <h2>Zeynep</h2>
          <p>Creative Designer based in Istanbul</p>
          <div class="about-roles">
            <span class="role-tag">UI/UX Designer</span>
            <span class="role-tag">Illustrator</span>
            <span class="role-tag">Industrial Designer</span>
          </div>
        </div>
      </div>
      <h3>Hello, World!</h3>
      <p>I'm a multidisciplinary designer passionate about creating meaningful experiences through design. With a background spanning digital interfaces, illustration, and physical products, I bring a unique perspective to every project.</p>
      <p>My approach combines aesthetic sensibility with functional thinking, ensuring that every design not only looks beautiful but serves its purpose effectively.</p>
      <h3>What I Do</h3>
      <ul>
        <li>User Interface & Experience Design</li>
        <li>Digital & Traditional Illustration</li>
        <li>Product & Industrial Design</li>
        <li>Brand Identity & Visual Systems</li>
        <li>Design Research & Strategy</li>
      </ul>
    `
  },
  projects: {
    title: 'Projects',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>`,
    content: `
      <h2>Selected Works</h2>
      <p>A collection of projects showcasing my work across different design disciplines.</p>
      <div class="projects-grid">
        <div class="project-card">
          <h4>Mobile Banking Redesign</h4>
          <p>Complete UI/UX overhaul for a fintech startup, improving user engagement by 40%.</p>
          <div class="project-tags">
            <span class="project-tag">UI/UX</span>
            <span class="project-tag">Mobile</span>
            <span class="project-tag">Fintech</span>
          </div>
        </div>
        <div class="project-card">
          <h4>Eco-Friendly Packaging</h4>
          <p>Sustainable packaging design for an organic cosmetics brand using biodegradable materials.</p>
          <div class="project-tags">
            <span class="project-tag">Industrial</span>
            <span class="project-tag">Sustainable</span>
          </div>
        </div>
        <div class="project-card">
          <h4>Children's Book Series</h4>
          <p>Illustrated a series of educational books about nature and wildlife for ages 4-8.</p>
          <div class="project-tags">
            <span class="project-tag">Illustration</span>
            <span class="project-tag">Editorial</span>
          </div>
        </div>
        <div class="project-card">
          <h4>Smart Home Dashboard</h4>
          <p>Designed an intuitive control interface for IoT home devices with accessibility focus.</p>
          <div class="project-tags">
            <span class="project-tag">UI/UX</span>
            <span class="project-tag">IoT</span>
            <span class="project-tag">A11y</span>
          </div>
        </div>
        <div class="project-card">
          <h4>Restaurant Brand Identity</h4>
          <p>Complete visual identity including logo, menu design, and interior graphics.</p>
          <div class="project-tags">
            <span class="project-tag">Branding</span>
            <span class="project-tag">Print</span>
          </div>
        </div>
        <div class="project-card">
          <h4>Modular Furniture System</h4>
          <p>Designed adaptable furniture pieces for small urban living spaces.</p>
          <div class="project-tags">
            <span class="project-tag">Industrial</span>
            <span class="project-tag">Furniture</span>
          </div>
        </div>
      </div>
    `
  },
  resume: {
    title: 'Resume',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>`,
    content: `
      <h2>Professional Experience</h2>
      <div class="resume-section">
        <div class="resume-item">
          <h4>Senior UI/UX Designer</h4>
          <div class="company">Creative Studio XYZ</div>
          <div class="period">2022 - Present</div>
          <p>Leading design initiatives for web and mobile applications. Mentoring junior designers and establishing design systems.</p>
        </div>
        <div class="resume-item">
          <h4>Product Designer</h4>
          <div class="company">Tech Startup ABC</div>
          <div class="period">2020 - 2022</div>
          <p>Designed user experiences for SaaS products. Conducted user research and implemented design thinking methodologies.</p>
        </div>
        <div class="resume-item">
          <h4>Industrial Design Intern</h4>
          <div class="company">Design Consultancy DEF</div>
          <div class="period">2019 - 2020</div>
          <p>Assisted in product development from concept to production. Created 3D models and physical prototypes.</p>
        </div>
      </div>
      <h3>Education</h3>
      <div class="resume-section">
        <div class="resume-item">
          <h4>Master's in Design</h4>
          <div class="company">Design University</div>
          <div class="period">2018 - 2020</div>
          <p>Specialized in Human-Computer Interaction and Service Design.</p>
        </div>
        <div class="resume-item">
          <h4>Bachelor's in Industrial Design</h4>
          <div class="company">Art & Design Academy</div>
          <div class="period">2014 - 2018</div>
          <p>Foundation in design principles, materials, and manufacturing processes.</p>
        </div>
      </div>
      <h3>Skills</h3>
      <div class="skills-list">
        <span class="skill-tag">Figma</span>
        <span class="skill-tag">Adobe Creative Suite</span>
        <span class="skill-tag">Sketch</span>
        <span class="skill-tag">Prototyping</span>
        <span class="skill-tag">User Research</span>
        <span class="skill-tag">Design Systems</span>
        <span class="skill-tag">3D Modeling</span>
        <span class="skill-tag">Illustration</span>
      </div>
    `
  },
  contact: {
    title: 'Contact',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <path d="M22 6l-10 7L2 6"/>
    </svg>`,
    content: `
      <div class="contact-intro">
        <h2>Let's Connect</h2>
        <p>I'm always excited to discuss new projects, creative ideas, or opportunities to collaborate. Feel free to reach out!</p>
      </div>
      <div class="contact-methods">
        <a href="mailto:hello@zeynstudio.com" class="contact-item">
          <div class="contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <path d="M22 6l-10 7L2 6"/>
            </svg>
          </div>
          <div class="contact-info">
            <h4>Email</h4>
            <p>hello@zeynstudio.com</p>
          </div>
        </a>
        <a href="#" class="contact-item">
          <div class="contact-icon fill">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div class="contact-info">
            <h4>LinkedIn</h4>
            <p>linkedin.com/in/zeynep</p>
          </div>
        </a>
        <a href="#" class="contact-item">
          <div class="contact-icon fill">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <div class="contact-info">
            <h4>Instagram</h4>
            <p>@zeynstudio</p>
          </div>
        </a>
        <a href="#" class="contact-item">
          <div class="contact-icon fill">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zm7.56-7.872c.282.39 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.912 4.407c-.213.29-1.94 2.533-5.78 4.108.236.49.454.985.66 1.486.073.174.14.348.204.52 3.407-.43 6.793.26 7.13.33-.02-2.42-.88-4.64-2.21-6.44z"/>
            </svg>
          </div>
          <div class="contact-info">
            <h4>Dribbble</h4>
            <p>dribbble.com/zeynep</p>
          </div>
        </a>
      </div>
    `
  }
};

// ========== STATE MANAGEMENT ==========
const state = {
  currentScreen: 'boot',
  windows: new Map(),
  activeWindow: null,
  windowZIndex: 100,
  startMenuOpen: false,
  theme: localStorage.getItem('zeynstudio-theme') || 'light'
};

// ========== DOM ELEMENTS ==========
const elements = {
  bootScreen: document.getElementById('boot-screen'),
  loginScreen: document.getElementById('login-screen'),
  desktop: document.getElementById('desktop'),
  mobileLauncher: document.getElementById('mobile-launcher'),
  mobileModal: document.getElementById('mobile-modal'),
  windowsContainer: document.getElementById('windows-container'),
  startMenu: document.getElementById('start-menu'),
  taskbarApps: document.getElementById('taskbar-apps'),
  windowTemplate: document.getElementById('window-template')
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', state.theme);

  // Initialize clocks
  updateAllClocks();
  setInterval(updateAllClocks, 1000);

  // Setup event listeners
  setupBootScreen();
  setupLoginScreen();
  setupDesktop();
  setupMobile();
  setupKeyboardNavigation();

  // Start boot sequence
  startBootSequence();
}

// ========== CLOCK FUNCTIONS ==========
function updateAllClocks() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const dateStrShort = now.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
  const dateStrLong = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Update all clock elements
  const clockElements = {
    'login-clock': timeStr,
    'login-date': dateStrLong,
    'taskbar-time': timeStr,
    'taskbar-date': dateStrShort,
    'mobile-clock': timeStr,
    'mobile-date': dateStrLong
  };

  Object.entries(clockElements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

// ========== BOOT SCREEN ==========
function setupBootScreen() {
  // Enter key to skip boot
  document.addEventListener('keydown', handleBootKeyPress);
}

function handleBootKeyPress(e) {
  if (state.currentScreen === 'boot' && e.key === 'Enter') {
    skipBoot();
  }
}

function startBootSequence() {
  // Auto-transition after boot animation completes (5 seconds)
  state.bootTimeout = setTimeout(() => {
    transitionToLogin();
  }, 5500);
}

function skipBoot() {
  if (state.bootTimeout) {
    clearTimeout(state.bootTimeout);
  }
  transitionToLogin();
}

function transitionToLogin() {
  if (state.currentScreen !== 'boot') return;

  state.currentScreen = 'login';
  elements.bootScreen.style.opacity = '0';

  setTimeout(() => {
    elements.bootScreen.classList.remove('active');
    elements.loginScreen.classList.add('active');

    requestAnimationFrame(() => {
      elements.loginScreen.style.opacity = '1';
    });
  }, 400);
}

// ========== LOGIN SCREEN ==========
function setupLoginScreen() {
  const loginUser = document.querySelector('.login-user');
  const loginBtn = document.querySelector('.login-btn');

  loginUser.addEventListener('click', handleLogin);
  loginUser.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLogin();
    }
  });

  loginBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleLogin();
  });

  // Enter key on login screen
  document.addEventListener('keydown', (e) => {
    if (state.currentScreen === 'login' && e.key === 'Enter') {
      handleLogin();
    }
  });
}

function handleLogin() {
  if (state.currentScreen !== 'login') return;

  state.currentScreen = 'desktop';
  elements.loginScreen.style.opacity = '0';

  setTimeout(() => {
    elements.loginScreen.classList.remove('active');
    elements.desktop.classList.add('active');

    requestAnimationFrame(() => {
      elements.desktop.style.opacity = '1';
    });
  }, 400);
}

// ========== DESKTOP ==========
function setupDesktop() {
  setupDesktopIcons();
  setupStartMenu();
  setupTaskbar();
  setupThemeToggle();
}

function setupDesktopIcons() {
  const icons = document.querySelectorAll('.desktop-icon');

  icons.forEach(icon => {
    icon.addEventListener('dblclick', () => {
      const appName = icon.dataset.app;
      openWindow(appName);
    });

    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const appName = icon.dataset.app;
        openWindow(appName);
      }
    });
  });
}

function setupStartMenu() {
  const startBtn = document.getElementById('start-btn');
  const startMenu = elements.startMenu;
  const startApps = startMenu.querySelectorAll('.start-app');
  const logoutBtn = document.getElementById('logout-btn');

  // Toggle start menu
  startBtn.addEventListener('click', toggleStartMenu);

  // App buttons in start menu
  startApps.forEach(app => {
    app.addEventListener('click', () => {
      const appName = app.dataset.app;
      openWindow(appName);
      closeStartMenu();
    });
  });

  // Logout button
  logoutBtn.addEventListener('click', handleLogout);

  // Close start menu when clicking outside
  document.addEventListener('click', (e) => {
    if (state.startMenuOpen &&
        !startMenu.contains(e.target) &&
        !startBtn.contains(e.target)) {
      closeStartMenu();
    }
  });
}

function toggleStartMenu() {
  if (state.startMenuOpen) {
    closeStartMenu();
  } else {
    openStartMenu();
  }
}

function openStartMenu() {
  state.startMenuOpen = true;
  elements.startMenu.classList.remove('hidden');
  document.getElementById('start-btn').setAttribute('aria-expanded', 'true');
}

function closeStartMenu() {
  state.startMenuOpen = false;
  elements.startMenu.classList.add('hidden');
  document.getElementById('start-btn').setAttribute('aria-expanded', 'false');
}

function handleLogout() {
  closeStartMenu();
  closeAllWindows();

  state.currentScreen = 'login';
  elements.desktop.style.opacity = '0';

  setTimeout(() => {
    elements.desktop.classList.remove('active');
    elements.loginScreen.classList.add('active');

    requestAnimationFrame(() => {
      elements.loginScreen.style.opacity = '1';
    });
  }, 400);
}

// ========== WINDOW MANAGEMENT ==========
function openWindow(appName) {
  // Check if window already exists
  if (state.windows.has(appName)) {
    const existingWindow = state.windows.get(appName);
    if (existingWindow.minimized) {
      restoreWindow(appName);
    } else {
      bringToFront(appName);
    }
    return;
  }

  const appData = appContent[appName];
  if (!appData) return;

  // Clone template
  const template = elements.windowTemplate.content.cloneNode(true);
  const windowEl = template.querySelector('.window');

  // Set window properties
  windowEl.dataset.app = appName;
  windowEl.querySelector('.window-name').textContent = appData.title;
  windowEl.querySelector('.window-icon').innerHTML = appData.icon;
  windowEl.querySelector('.window-content').innerHTML = appData.content;

  // Position window (cascade effect)
  const windowCount = state.windows.size;
  const offset = 30 * (windowCount % 5);
  windowEl.style.left = `${100 + offset}px`;
  windowEl.style.top = `${50 + offset}px`;
  windowEl.style.width = '600px';
  windowEl.style.height = '500px';
  windowEl.style.zIndex = ++state.windowZIndex;

  // Add to container
  elements.windowsContainer.appendChild(windowEl);

  // Store window state
  state.windows.set(appName, {
    element: windowEl,
    minimized: false
  });

  // Setup window controls
  setupWindowControls(windowEl, appName);

  // Setup dragging
  setupWindowDrag(windowEl);

  // Update taskbar
  updateTaskbar();

  // Set as active
  setActiveWindow(appName);
}

function setupWindowControls(windowEl, appName) {
  const closeBtn = windowEl.querySelector('.window-btn.close');
  const minimizeBtn = windowEl.querySelector('.window-btn.minimize');

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow(appName);
  });

  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    minimizeWindow(appName);
  });

  // Click to bring to front
  windowEl.addEventListener('mousedown', () => {
    bringToFront(appName);
  });
}

function setupWindowDrag(windowEl) {
  const titlebar = windowEl.querySelector('.window-titlebar');
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-btn')) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = windowEl.offsetLeft;
    startTop = windowEl.offsetTop;

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  });

  function handleDrag(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newLeft = startLeft + deltaX;
    let newTop = startTop + deltaY;

    // Constrain to viewport
    const maxLeft = window.innerWidth - 100;
    const maxTop = window.innerHeight - 100;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    windowEl.style.left = `${newLeft}px`;
    windowEl.style.top = `${newTop}px`;
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }
}

function closeWindow(appName) {
  const windowData = state.windows.get(appName);
  if (!windowData) return;

  const windowEl = windowData.element;
  windowEl.classList.add('closing');

  setTimeout(() => {
    windowEl.remove();
    state.windows.delete(appName);
    updateTaskbar();

    // Set new active window
    if (state.activeWindow === appName) {
      state.activeWindow = null;
      const remainingWindows = Array.from(state.windows.keys());
      if (remainingWindows.length > 0) {
        setActiveWindow(remainingWindows[remainingWindows.length - 1]);
      }
    }
  }, 200);
}

function minimizeWindow(appName) {
  const windowData = state.windows.get(appName);
  if (!windowData) return;

  windowData.minimized = true;
  windowData.element.classList.add('minimized');

  updateTaskbar();

  // Set new active window
  if (state.activeWindow === appName) {
    state.activeWindow = null;
  }
}

function restoreWindow(appName) {
  const windowData = state.windows.get(appName);
  if (!windowData) return;

  windowData.minimized = false;
  windowData.element.classList.remove('minimized');

  bringToFront(appName);
  updateTaskbar();
}

function bringToFront(appName) {
  const windowData = state.windows.get(appName);
  if (!windowData) return;

  windowData.element.style.zIndex = ++state.windowZIndex;
  setActiveWindow(appName);
}

function setActiveWindow(appName) {
  state.activeWindow = appName;
  updateTaskbar();
}

function closeAllWindows() {
  state.windows.forEach((_, appName) => {
    const windowData = state.windows.get(appName);
    if (windowData) {
      windowData.element.remove();
    }
  });
  state.windows.clear();
  state.activeWindow = null;
  updateTaskbar();
}

// ========== TASKBAR ==========
function setupTaskbar() {
  // Initial setup
  updateTaskbar();
}

function updateTaskbar() {
  elements.taskbarApps.innerHTML = '';

  state.windows.forEach((windowData, appName) => {
    const appData = appContent[appName];
    if (!appData) return;

    const taskbarApp = document.createElement('button');
    taskbarApp.className = 'taskbar-app';
    taskbarApp.dataset.app = appName;

    if (state.activeWindow === appName && !windowData.minimized) {
      taskbarApp.classList.add('active');
    }
    if (windowData.minimized) {
      taskbarApp.classList.add('minimized');
    }

    taskbarApp.innerHTML = `
      <span class="taskbar-app-icon">${appData.icon}</span>
      <span>${appData.title}</span>
    `;

    taskbarApp.addEventListener('click', () => {
      if (windowData.minimized) {
        restoreWindow(appName);
      } else if (state.activeWindow === appName) {
        minimizeWindow(appName);
      } else {
        bringToFront(appName);
      }
    });

    elements.taskbarApps.appendChild(taskbarApp);
  });
}

// ========== THEME TOGGLE ==========
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

  themeToggle.addEventListener('click', toggleTheme);
  mobileThemeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('zeynstudio-theme', state.theme);
}

// ========== MOBILE ==========
function setupMobile() {
  const mobileAppBtns = document.querySelectorAll('.mobile-app-btn');
  const modalClose = document.querySelector('.mobile-modal-close');
  const modalOverlay = document.querySelector('.mobile-modal-overlay');

  mobileAppBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const appName = btn.dataset.app;
      openMobileModal(appName);
    });
  });

  modalClose.addEventListener('click', closeMobileModal);
  modalOverlay.addEventListener('click', closeMobileModal);
}

function openMobileModal(appName) {
  const appData = appContent[appName];
  if (!appData) return;

  document.getElementById('mobile-modal-title').textContent = appData.title;
  document.getElementById('mobile-modal-body').innerHTML = appData.content;

  elements.mobileModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeMobileModal() {
  elements.mobileModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ========== KEYBOARD NAVIGATION ==========
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape to close active window or modal
    if (e.key === 'Escape') {
      if (!elements.mobileModal.classList.contains('hidden')) {
        closeMobileModal();
      } else if (state.startMenuOpen) {
        closeStartMenu();
      } else if (state.activeWindow && state.currentScreen === 'desktop') {
        closeWindow(state.activeWindow);
      }
    }

    // Tab navigation within windows
    if (e.key === 'Tab' && state.activeWindow) {
      const windowData = state.windows.get(state.activeWindow);
      if (windowData && !windowData.minimized) {
        // Let default tab behavior work within the window
      }
    }
  });
}

// ========== UTILITY FUNCTIONS ==========
function isMobile() {
  return window.innerWidth <= 768;
}

// Handle window resize
window.addEventListener('resize', () => {
  if (isMobile()) {
    // Close all windows when switching to mobile
    closeAllWindows();
    closeStartMenu();
  }
});
