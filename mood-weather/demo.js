// Screen Templates - Full English Version with Complete Implementations
const screens = {
    // Welcome Flow
    splash: `
        <div class="splash-content">
            <div class="splash-logo">☁️</div>
            <h1 class="splash-title">Mood Weather</h1>
            <p class="splash-subtitle">Track your mood, see your growth</p>
        </div>
    `,

    onboarding1: `
        <div class="onboarding-content">
            <div class="onboarding-illustration">📊</div>
            <div class="onboarding-text">
                <h2 class="onboarding-title">Daily Tracking</h2>
                <p class="onboarding-description">Record your mood every day and visualize it like weather</p>
            </div>
            <div class="onboarding-dots">
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <button class="btn-primary">Continue</button>
        </div>
    `,

    onboarding2: `
        <div class="onboarding-content">
            <div class="onboarding-illustration">🔥</div>
            <div class="onboarding-text">
                <h2 class="onboarding-title">Streak System</h2>
                <p class="onboarding-description">Log consecutive days, build your streak, boost your motivation</p>
            </div>
            <div class="onboarding-dots">
                <div class="dot"></div>
                <div class="dot active"></div>
                <div class="dot"></div>
            </div>
            <button class="btn-primary">Continue</button>
        </div>
    `,

    onboarding3: `
        <div class="onboarding-content">
            <div class="onboarding-illustration">📈</div>
            <div class="onboarding-text">
                <h2 class="onboarding-title">Stats & Insights</h2>
                <p class="onboarding-description">Analyze with charts, get AI-powered recommendations</p>
            </div>
            <div class="onboarding-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot active"></div>
            </div>
            <button class="btn-primary">Get Started</button>
        </div>
    `,

    login: `
        <div class="login-content">
            <div class="login-header">
                <div style="font-size: 4rem; margin-bottom: 1rem;">☁️</div>
                <h2 class="login-title">Welcome Back!</h2>
                <p class="login-subtitle">Sign in to continue</p>
            </div>
            <div class="input-group">
                <label class="input-label">Email</label>
                <input type="email" class="input-field" placeholder="example@email.com">
            </div>
            <div class="input-group">
                <label class="input-label">Password</label>
                <input type="password" class="input-field" placeholder="••••••••">
            </div>
            <button class="btn-primary" style="margin-bottom: 1rem;">Sign In</button>
            <p style="text-align: center; color: #a0a8d4; font-size: 0.875rem;">
                Don't have an account? <span style="color: #6366f1; font-weight: 600; cursor: pointer;">Sign Up</span>
            </p>
        </div>
    `,

    // Main Screens
    'home-empty': `
        <div class="screen-content">
            <div class="app-header">
                <div class="logo">
                    <span style="font-size: 1.5rem;">☁️</span>
                    Mood Weather
                </div>
                <div class="header-actions">
                    <div class="icon-btn">📊</div>
                    <div class="icon-btn">⚙️</div>
                </div>
            </div>
            
            <div class="card" style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 6rem; margin-bottom: 1rem;">🌤️</div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: white; margin-bottom: 0.5rem;">How are you today?</h2>
                <p style="color: #a0a8d4; margin-bottom: 1.5rem;">Select your mood and start tracking</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        📅 Feb 2, 2026, Sunday
                    </div>
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        🔥 0 days
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="section-title">Select Your Mood</h3>
                <div class="mood-grid">
                    <div class="mood-card">
                        <div class="mood-icon">☀️</div>
                        <div class="mood-label">Amazing</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">🌤️</div>
                        <div class="mood-label">Good</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛅</div>
                        <div class="mood-label">Okay</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">☁️</div>
                        <div class="mood-label">Meh</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">🌧️</div>
                        <div class="mood-label">Bad</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛈️</div>
                        <div class="mood-label">Terrible</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="section-title">This Week</h3>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
                    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => `
                        <div style="background: #1e2547; border-radius: 0.75rem; padding: 0.75rem 0.5rem; text-align: center; opacity: 0.3;">
                            <div style="font-size: 0.625rem; color: #6b7299; text-transform: uppercase; margin-bottom: 0.25rem;">${day}</div>
                            <div style="font-size: 1.5rem; margin: 0.25rem 0;">⚪</div>
                            <div style="font-size: 0.75rem; color: #a0a8d4;">${27 + i}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,

    'mood-select': `
        <div class="screen-content">
            <div class="app-header">
                <div class="logo">
                    <span style="font-size: 1.5rem;">☁️</span>
                    Mood Weather
                </div>
                <div class="header-actions">
                    <div class="icon-btn">📊</div>
                    <div class="icon-btn">⚙️</div>
                </div>
            </div>
            
            <div class="card" style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 6rem; margin-bottom: 1rem;">☀️</div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: white; margin-bottom: 0.5rem;">Amazing</h2>
                <p style="color: #a0a8d4; margin-bottom: 1.5rem;">Sunny and bright day!</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        📅 Feb 2, 2026, Sunday
                    </div>
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        🔥 5 days
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="section-title">Select Your Mood</h3>
                <div class="mood-grid">
                    <div class="mood-card selected">
                        <div class="mood-icon">☀️</div>
                        <div class="mood-label">Amazing</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">🌤️</div>
                        <div class="mood-label">Good</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛅</div>
                        <div class="mood-label">Okay</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">☁️</div>
                        <div class="mood-label">Meh</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">🌧️</div>
                        <div class="mood-label">Bad</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛈️</div>
                        <div class="mood-label">Terrible</div>
                    </div>
                </div>
            </div>
        </div>
    `,

    'note-add': `
        <div class="screen-content">
            <div class="app-header">
                <div class="logo">
                    <span style="font-size: 1.5rem;">☁️</span>
                    Mood Weather
                </div>
                <div class="header-actions">
                    <div class="icon-btn">📊</div>
                    <div class="icon-btn">⚙️</div>
                </div>
            </div>
            
            <div class="card" style="text-align: center; padding: 2rem;">
                <div style="font-size: 5rem; margin-bottom: 0.5rem;">☀️</div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.75rem; color: white; margin-bottom: 0.5rem;">Amazing</h2>
                <p style="color: #a0a8d4;">Sunny and bright day!</p>
            </div>
            
            <div class="card">
                <h3 class="section-title">Select Your Mood</h3>
                <div class="mood-grid">
                    <div class="mood-card selected">
                        <div class="mood-icon">☀️</div>
                        <div class="mood-label">Amazing</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">🌤️</div>
                        <div class="mood-label">Good</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛅</div>
                        <div class="mood-label">Okay</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">☁️</div>
                        <div class="mood-label">Meh</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">🌧️</div>
                        <div class="mood-label">Bad</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛈️</div>
                        <div class="mood-label">Terrible</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="section-title">Add Note (Optional)</h3>
                <textarea class="input-field" style="min-height: 100px; resize: vertical; margin-bottom: 1rem;" placeholder="What happened today? How are you feeling?">Had an amazing day! My projects are going great and I feel very energized. ☀️</textarea>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.875rem; color: #6b7299;">85/500</span>
                    <button class="btn-primary" style="width: auto; padding: 0.75rem 1.5rem;">
                        💾 Save
                    </button>
                </div>
            </div>
        </div>
    `,

    success: `
        <div class="screen-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem;">
            <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 4rem; margin-bottom: 2rem; box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4);">
                ✓
            </div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 2.5rem; color: white; margin-bottom: 1rem;">Saved!</h2>
            <p style="color: #a0a8d4; font-size: 1.125rem; margin-bottom: 2rem;">Your mood has been recorded successfully</p>
            
            <div class="card" style="margin-bottom: 2rem; width: 100%;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏆</div>
                    <h3 style="color: white; font-weight: 600; margin-bottom: 0.5rem;">New Achievement!</h3>
                    <p style="color: #a0a8d4; font-size: 0.875rem;">7-Day Streak Completed!</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 2rem; margin-bottom: 2rem;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #6366f1;">16</div>
                    <div style="font-size: 0.875rem; color: #a0a8d4;">Total Days</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #6366f1;">8 🔥</div>
                    <div style="font-size: 0.875rem; color: #a0a8d4;">Streak</div>
                </div>
            </div>
            
            <button class="btn-primary" style="margin-bottom: 1rem;">Awesome!</button>
            <button style="background: none; border: 2px solid rgba(255, 255, 255, 0.2); color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; width: 100%;">
                View History
            </button>
        </div>
    `,

    'home-filled': `
        <div class="screen-content">
            <div class="app-header">
                <div class="logo">
                    <span style="font-size: 1.5rem;">☁️</span>
                    Mood Weather
                </div>
                <div class="header-actions">
                    <div class="icon-btn">📊</div>
                    <div class="icon-btn">⚙️</div>
                </div>
            </div>
            
            <div class="card" style="text-align: center; padding: 2rem;">
                <div style="font-size: 5rem; margin-bottom: 0.5rem;">🌤️</div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.75rem; color: white; margin-bottom: 0.5rem;">Good</h2>
                <p style="color: #a0a8d4; margin-bottom: 1rem;">Partly cloudy but nice</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        📅 Feb 2, 2026
                    </div>
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        🔥 7 days
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="section-title">Select Your Mood</h3>
                <div class="mood-grid">
                    <div class="mood-card">
                        <div class="mood-icon">☀️</div>
                        <div class="mood-label">Amazing</div>
                    </div>
                    <div class="mood-card selected">
                        <div class="mood-icon">🌤️</div>
                        <div class="mood-label">Good</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛅</div>
                        <div class="mood-label">Okay</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">☁️</div>
                        <div class="mood-label">Meh</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">🌧️</div>
                        <div class="mood-label">Bad</div>
                    </div>
                    <div class="mood-card">
                        <div class="mood-icon">⛈️</div>
                        <div class="mood-label">Terrible</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 class="section-title" style="margin: 0;">This Week</h3>
                    <span style="color: #6366f1; font-size: 0.875rem; font-weight: 600; cursor: pointer;">View All →</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
                    ${[
            { day: 'Mon', icon: '☀️', date: 27 },
            { day: 'Tue', icon: '🌤️', date: 28 },
            { day: 'Wed', icon: '☀️', date: 29 },
            { day: 'Thu', icon: '⛅', date: 30 },
            { day: 'Fri', icon: '🌤️', date: 31 },
            { day: 'Sat', icon: '☀️', date: 1 },
            { day: 'Sun', icon: '🌤️', date: 2 }
        ].map(d => `
                        <div style="background: #1e2547; border-radius: 0.75rem; padding: 0.75rem 0.5rem; text-align: center; border: 2px solid rgba(255, 255, 255, 0.1);">
                            <div style="font-size: 0.625rem; color: #6b7299; text-transform: uppercase; margin-bottom: 0.25rem;">${d.day}</div>
                            <div style="font-size: 1.5rem; margin: 0.25rem 0;">${d.icon}</div>
                            <div style="font-size: 0.75rem; color: #a0a8d4;">${d.date}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,

    loading: `
        <div class="screen-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem;">
            <div style="width: 150px; height: 150px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; position: relative;">
                <div style="font-size: 4rem;">🌤️</div>
                <div style="position: absolute; width: 100%; height: 100%; border: 3px solid transparent; border-top-color: #6366f1; border-radius: 1.5rem; animation: spin 1s linear infinite;"></div>
            </div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.75rem; color: white; margin-bottom: 0.5rem;">Loading...</h2>
            <p style="color: #a0a8d4;">Preparing your data</p>
            <div style="width: 200px; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; margin-top: 2rem; overflow: hidden;">
                <div style="width: 60%; height: 100%; background: linear-gradient(90deg, #6366f1, #a78bfa); border-radius: 2px; animation: progress 1.5s ease-in-out infinite;"></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            @keyframes progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(250%); }
            }
        </style>
    `,

    error: `
        <div class="screen-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem;">
            <div style="width: 120px; height: 120px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 4rem; margin-bottom: 2rem;">
                ❌
            </div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: white; margin-bottom: 1rem;">An Error Occurred</h2>
            <p style="color: #a0a8d4; margin-bottom: 2rem;">There was a problem loading your data. Please try again.</p>
            <button class="btn-primary" style="margin-bottom: 1rem;">Try Again</button>
            <button style="background: none; border: none; color: #6366f1; font-weight: 600; cursor: pointer;">
                Go to Home
            </button>
        </div>
    `,

    empty: `
        <div class="screen-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem;">
            <div style="font-size: 6rem; margin-bottom: 2rem; opacity: 0.5;">📭</div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: white; margin-bottom: 1rem;">No Records Yet</h2>
            <p style="color: #a0a8d4; margin-bottom: 2rem;">Start by creating your first mood entry!</p>
            <button class="btn-primary">Create First Entry</button>
        </div>
    `
};

// Add mood-specific screens
const moods = [
    { key: 'amazing', icon: '☀️', title: 'Amazing', desc: 'Sunny and bright day!' },
    { key: 'good', icon: '🌤️', title: 'Good', desc: 'Partly cloudy but nice' },
    { key: 'okay', icon: '⛅', title: 'Okay', desc: 'Cloudy but not bad' },
    { key: 'meh', icon: '☁️', title: 'Meh', desc: 'Overcast weather' },
    { key: 'bad', icon: '🌧️', title: 'Bad', desc: 'Rainy day' },
    { key: 'terrible', icon: '⛈️', title: 'Terrible', desc: 'Stormy weather' }
];

moods.forEach(mood => {
    screens[`mood-${mood.key}`] = `
        <div class="screen-content">
            <div class="app-header">
                <div class="logo">
                    <span style="font-size: 1.5rem;">☁️</span>
                    Mood Weather
                </div>
                <div class="header-actions">
                    <div class="icon-btn">📊</div>
                    <div class="icon-btn">⚙️</div>
                </div>
            </div>
            
            <div class="card" style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 6rem; margin-bottom: 1rem;">${mood.icon}</div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: white; margin-bottom: 0.5rem;">${mood.title}</h2>
                <p style="color: #a0a8d4; margin-bottom: 1.5rem;">${mood.desc}</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        📅 Feb 2, 2026
                    </div>
                    <div style="padding: 0.5rem 1rem; background: #1e2547; border-radius: 2rem; font-size: 0.875rem; color: #a0a8d4;">
                        🔥 ${Math.floor(Math.random() * 10) + 1} days
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="section-title">Select Your Mood</h3>
                <div class="mood-grid">
                    ${moods.map(m => `
                        <div class="mood-card ${m.key === mood.key ? 'selected' : ''}">
                            <div class="mood-icon">${m.icon}</div>
                            <div class="mood-label">${m.title}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
});

// COMPLETE IMPLEMENTATIONS - No more placeholders!

// Calendar Screen - Full Implementation
screens.calendar = `
    <div class="screen-content">
        <div class="app-header">
            <div class="logo">
                <span style="font-size: 1.5rem;">☁️</span>
                Mood Weather
            </div>
            <div class="header-actions">
                <div class="icon-btn">🏠</div>
                <div class="icon-btn">⚙️</div>
            </div>
        </div>
        
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div class="icon-btn">←</div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: white; margin: 0;">January 2026</h2>
                <div class="icon-btn">→</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-bottom: 1rem;">
                ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                    <div style="text-align: center; font-size: 0.75rem; color: #6b7299; font-weight: 600; padding: 0.5rem 0;">${day}</div>
                `).join('')}
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
                ${Array.from({ length: 31 }, (_, i) => {
    const moods = ['☀️', '🌤️', '⛅', '☁️', '🌧️', '⛈️', ''];
    const mood = i < 15 ? moods[Math.floor(Math.random() * 6)] : '';
    return `
                        <div style="aspect-ratio: 1; background: ${mood ? '#1e2547' : 'rgba(255,255,255,0.02)'}; border-radius: 0.75rem; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.5rem; ${i === 14 ? 'border: 2px solid #6366f1;' : 'border: 1px solid rgba(255,255,255,0.1);'}">
                            <div style="font-size: 0.75rem; color: ${mood ? 'white' : '#6b7299'}; margin-bottom: 0.25rem;">${i + 1}</div>
                            ${mood ? `<div style="font-size: 1.25rem;">${mood}</div>` : ''}
                        </div>
                    `;
}).join('')}
            </div>
        </div>
        
        <div class="card">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <div style="font-size: 3rem;">☀️</div>
                <div style="flex: 1;">
                    <h3 style="color: white; font-weight: 600; margin-bottom: 0.25rem;">January 15, 2026</h3>
                    <p style="color: #a0a8d4; font-size: 0.875rem;">Wednesday • Amazing</p>
                </div>
            </div>
            <p style="color: #a0a8d4; font-size: 0.875rem; line-height: 1.6;">Had a great day! Finished my project and celebrated with friends. Feeling accomplished and happy.</p>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 2rem;">
                <div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #6366f1;">15</div>
                    <div style="font-size: 0.75rem; color: #a0a8d4;">Days This Month</div>
                </div>
                <div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #6366f1;">7 🔥</div>
                    <div style="font-size: 0.75rem; color: #a0a8d4;">Current Streak</div>
                </div>
            </div>
        </div>
    </div>
`;

// Analytics Screen - Full Implementation
screens.analytics = `
    <div class="screen-content">
        <div class="app-header">
            <div class="logo">
                <span style="font-size: 1.5rem;">☁️</span>
                Mood Weather
            </div>
            <div class="header-actions">
                <div class="icon-btn">🏠</div>
                <div class="icon-btn">⚙️</div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
            ${[
        { icon: '📅', value: '30', label: 'Days This Month' },
        { icon: '🔥', value: '15', label: 'Longest Streak' },
        { icon: '☀️', value: '73%', label: 'Positive Days' },
        { icon: '⭐', value: '4.2/5', label: 'Average' }
    ].map(stat => `
                <div class="card" style="padding: 1rem; text-align: center; margin: 0;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${stat.icon}</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #6366f1; margin-bottom: 0.25rem;">${stat.value}</div>
                    <div style="font-size: 0.75rem; color: #a0a8d4;">${stat.label}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="card">
            <h3 class="section-title">30-Day Trend</h3>
            <div style="height: 150px; background: rgba(255,255,255,0.02); border-radius: 0.75rem; padding: 1rem; position: relative;">
                <svg width="100%" height="100%" style="overflow: visible;">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <polyline points="0,80 40,60 80,70 120,40 160,50 200,30 240,45 280,35" 
                        fill="none" stroke="url(#lineGradient)" stroke-width="3" />
                    ${[0, 40, 80, 120, 160, 200, 240, 280].map((x, i) => {
        const y = [80, 60, 70, 40, 50, 30, 45, 35][i];
        const emojis = ['🌤️', '☀️', '⛅', '☀️', '🌤️', '☀️', '🌤️', '☀️'];
        return `<text x="${x}" y="${y - 10}" fill="white" font-size="16" text-anchor="middle">${emojis[i]}</text>`;
    }).join('')}
                </svg>
            </div>
        </div>
        
        <div class="card">
            <h3 class="section-title">Mood Distribution</h3>
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(#fbbf24 0deg 144deg, #60a5fa 144deg 252deg, #a78bfa 252deg 306deg, #6b7280 306deg 342deg, #ef4444 342deg 360deg); position: relative;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; background: #0a0e27; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white;">4.2</div>
                </div>
                <div style="flex: 1;">
                    ${[
        { emoji: '☀️', label: 'Amazing', percent: '40%', color: '#fbbf24' },
        { emoji: '🌤️', label: 'Good', percent: '30%', color: '#60a5fa' },
        { emoji: '⛅', label: 'Okay', percent: '15%', color: '#a78bfa' },
        { emoji: '☁️', label: 'Meh', percent: '10%', color: '#6b7280' },
        { emoji: '🌧️', label: 'Bad', percent: '5%', color: '#ef4444' }
    ].map(item => `
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${item.color};"></div>
                            <span style="font-size: 1rem;">${item.emoji}</span>
                            <span style="font-size: 0.875rem; color: #a0a8d4; flex: 1;">${item.label}</span>
                            <span style="font-size: 0.875rem; color: white; font-weight: 600;">${item.percent}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
`;

// History Screen - Complete Implementation
screens.history = `
    <div class="screen-content">
        <div class="app-header">
            <div class="logo">
                <span style="font-size: 1.5rem;">☁️</span>
                Mood Weather
            </div>
            <div class="header-actions">
                <div class="icon-btn">🏠</div>
                <div class="icon-btn">📊</div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
            ${[
        { label: 'Total Days', value: '45' },
        { label: 'Current Streak', value: '7 🔥' },
        { label: 'Best Mood', value: '☀️ 18x' }
    ].map(stat => `
                <div class="card" style="padding: 1rem; text-align: center; margin: 0;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #6366f1; margin-bottom: 0.25rem;">${stat.value}</div>
                    <div style="font-size: 0.75rem; color: #a0a8d4;">${stat.label}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="card">
            <h3 class="section-title">Recent Entries</h3>
            ${[
        { date: 'Feb 2, 2026', day: 'Sunday', mood: '🌤️', title: 'Good', note: 'Nice relaxing day with family' },
        { date: 'Feb 1, 2026', day: 'Saturday', mood: '☀️', title: 'Amazing', note: 'Finished my project! Feeling great' },
        { date: 'Jan 31, 2026', day: 'Friday', mood: '🌤️', title: 'Good', note: 'Productive work day' },
        { date: 'Jan 30, 2026', day: 'Thursday', mood: '⛅', title: 'Okay', note: 'Bit tired but okay' },
        { date: 'Jan 29, 2026', day: 'Wednesday', mood: '☀️', title: 'Amazing', note: 'Great meeting with the team' }
    ].map(entry => `
                <div style="padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 0.75rem; margin-bottom: 0.75rem; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
                        <div style="font-size: 2rem;">${entry.mood}</div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.25rem;">
                                <h4 style="color: white; font-weight: 600; margin: 0;">${entry.title}</h4>
                                <span style="font-size: 0.75rem; color: #6b7299;">${entry.day}</span>
                            </div>
                            <p style="font-size: 0.75rem; color: #a0a8d4; margin-bottom: 0.5rem;">${entry.date}</p>
                            <p style="font-size: 0.875rem; color: #a0a8d4; line-height: 1.4;">${entry.note}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
`;

// Insights Screen - Complete Implementation
screens.insights = `
    <div class="screen-content">
        <div class="app-header">
            <div class="logo">
                <span style="font-size: 1.5rem;">☁️</span>
                Mood Weather
            </div>
            <div class="header-actions">
                <div class="icon-btn">🏠</div>
                <div class="icon-btn">⚙️</div>
            </div>
        </div>
        
        <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%); border-color: rgba(99, 102, 241, 0.3);">
            <div style="display: flex; gap: 1rem; align-items: start;">
                <div style="font-size: 2.5rem;">🤖</div>
                <div style="flex: 1;">
                    <h3 style="color: white; font-weight: 600; margin-bottom: 0.5rem;">AI Insight</h3>
                    <p style="color: #a0a8d4; font-size: 0.875rem; line-height: 1.6;">You tend to feel most positive on Saturdays! Try incorporating weekend activities into your weekdays.</p>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h3 class="section-title">Weekly Pattern</h3>
            <div style="display: flex; justify-content: space-between; align-items: end; height: 120px; gap: 0.5rem;">
                ${[
        { day: 'Mon', height: 55, mood: '⛅' },
        { day: 'Tue', height: 65, mood: '🌤️' },
        { day: 'Wed', height: 75, mood: '☀️' },
        { day: 'Thu', height: 60, mood: '🌤️' },
        { day: 'Fri', height: 70, mood: '☀️' },
        { day: 'Sat', height: 90, mood: '☀️' },
        { day: 'Sun', height: 80, mood: '☀️' }
    ].map(d => `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <div style="font-size: 1.25rem;">${d.mood}</div>
                        <div style="width: 100%; height: ${d.height}%; background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%); border-radius: 0.5rem 0.5rem 0 0;"></div>
                        <div style="font-size: 0.75rem; color: #6b7299; font-weight: 600;">${d.day}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card">
            <h3 class="section-title">Common Keywords</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${['work', 'friends', 'project', 'family', 'exercise', 'relax', 'productive', 'tired'].map((word, i) => {
        const sizes = ['1rem', '1.25rem', '0.875rem', '1rem', '0.875rem', '1.125rem', '0.875rem', '1rem'];
        return `<div style="padding: 0.5rem 1rem; background: rgba(99, 102, 241, ${0.1 + i * 0.05}); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 2rem; color: #a78bfa; font-size: ${sizes[i]}; font-weight: 600;">${word}</div>`;
    }).join('')}
            </div>
        </div>
    </div>
`;

// Streak Screen - Complete Implementation
screens.streak = `
    <div class="screen-content" style="padding: 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 8rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;">🔥</div>
            <h1 style="font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 700; color: white; margin-bottom: 0.5rem;">30 Day Streak!</h1>
            <p style="color: #a0a8d4; font-size: 1.125rem;">Amazing achievement!</p>
        </div>
        
        <div class="card">
            <h3 class="section-title">Last 30 Days</h3>
            <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 0.25rem;">
                ${Array.from({ length: 30 }, (_, i) => {
    const moods = ['☀️', '🌤️', '⛅', '☁️'];
    return `<div style="aspect-ratio: 1; background: #1e2547; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 1rem; border: 2px solid ${i === 29 ? '#6366f1' : 'rgba(255,255,255,0.1)'};">${moods[Math.floor(Math.random() * 4)]}</div>`;
}).join('')}
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
            ${[
        { label: 'Current Streak', value: '30 🔥' },
        { label: 'Longest Streak', value: '30 days' },
        { label: 'Total Days', value: '45 days' }
    ].map(stat => `
                <div class="card" style="padding: 1rem; text-align: center; margin: 0;">
                    <div style="font-size: 1.25rem; font-weight: 700; color: #6366f1; margin-bottom: 0.25rem;">${stat.value}</div>
                    <div style="font-size: 0.75rem; color: #a0a8d4;">${stat.label}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="card">
            <h3 class="section-title">Next Milestone: 60 Days 🏆</h3>
            <div style="background: rgba(255,255,255,0.05); border-radius: 2rem; height: 12px; overflow: hidden; margin-bottom: 0.5rem;">
                <div style="width: 50%; height: 100%; background: linear-gradient(90deg, #6366f1, #a78bfa); border-radius: 2rem;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #a0a8d4;">
                <span>30 days</span>
                <span>60 days</span>
            </div>
        </div>
        
        <button class="btn-primary">Share Achievement</button>
    </div>
`;

// Notifications Screen - Complete Implementation
screens.notifications = `
    <div class="screen-content">
        <div class="app-header">
            <div class="logo">
                <span style="font-size: 1.5rem;">☁️</span>
                Mood Weather
            </div>
            <div class="header-actions">
                <div class="icon-btn">🏠</div>
                <div class="icon-btn">✓</div>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: #6b7299; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.75rem; padding: 0 1rem;">Today</h3>
            ${[
        { icon: '🔥', title: '7-Day Streak!', desc: 'Great job! Keep your streak going.', time: '2 hours ago', unread: true },
        { icon: '🌤️', title: 'Daily Reminder', desc: "Don't forget to log today's mood!", time: '5 hours ago', unread: true }
    ].map(notif => `
                <div class="card" style="margin-bottom: 0.75rem; ${notif.unread ? 'background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.2);' : ''}">
                    <div style="display: flex; gap: 1rem; align-items: start;">
                        ${notif.unread ? '<div style="width: 8px; height: 8px; background: #6366f1; border-radius: 50%; margin-top: 0.5rem;"></div>' : '<div style="width: 8px;"></div>'}
                        <div style="width: 48px; height: 48px; background: rgba(99, 102, 241, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">${notif.icon}</div>
                        <div style="flex: 1; min-width: 0;">
                            <h4 style="color: white; font-weight: 600; margin-bottom: 0.25rem;">${notif.title}</h4>
                            <p style="color: #a0a8d4; font-size: 0.875rem; margin-bottom: 0.5rem;">${notif.desc}</p>
                            <span style="color: #6b7299; font-size: 0.75rem;">${notif.time}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: #6b7299; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.75rem; padding: 0 1rem;">Yesterday</h3>
            ${[
        { icon: '⭐', title: 'New Achievement!', desc: 'You completed your first week 🎉', time: 'Yesterday, 8:30 PM' },
        { icon: '📊', title: 'Weekly Summary Ready', desc: 'You logged 5 days this week', time: 'Yesterday, 9:00 AM' }
    ].map(notif => `
                <div class="card" style="margin-bottom: 0.75rem; opacity: 0.7;">
                    <div style="display: flex; gap: 1rem; align-items: start;">
                        <div style="width: 8px;"></div>
                        <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">${notif.icon}</div>
                        <div style="flex: 1; min-width: 0;">
                            <h4 style="color: white; font-weight: 600; margin-bottom: 0.25rem;">${notif.title}</h4>
                            <p style="color: #a0a8d4; font-size: 0.875rem; margin-bottom: 0.5rem;">${notif.desc}</p>
                            <span style="color: #6b7299; font-size: 0.75rem;">${notif.time}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
`;

// Settings Screen - Complete Implementation
screens.settings = `
    <div class="screen-content">
        <div class="app-header">
            <div class="logo">
                <span style="font-size: 1.5rem;">☁️</span>
                Mood Weather
            </div>
            <div class="header-actions">
                <div class="icon-btn">🏠</div>
            </div>
        </div>
        
        <div class="card" style="text-align: center; padding: 2rem;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6366f1 0%, #a78bfa 100%); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">👤</div>
            <h3 style="color: white; font-weight: 600; margin-bottom: 0.25rem;">Sarah Johnson</h3>
            <p style="color: #a0a8d4; font-size: 0.875rem; margin-bottom: 1rem;">15 day streak 🔥</p>
            <button style="background: rgba(99, 102, 241, 0.1); border: 2px solid rgba(99, 102, 241, 0.3); color: #a78bfa; padding: 0.5rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer;">Edit Profile</button>
        </div>
        
        <div class="card">
            <h3 class="section-title">Notifications</h3>
            ${[
        { label: 'Daily Reminder', sublabel: 'Time: 8:00 PM', enabled: true },
        { label: 'Weekly Summary', sublabel: 'Every Monday', enabled: true },
        { label: 'Achievement Alerts', sublabel: 'Streak milestones', enabled: false }
    ].map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div>
                        <div style="color: white; font-weight: 500; margin-bottom: 0.25rem;">${item.label}</div>
                        <div style="color: #6b7299; font-size: 0.875rem;">${item.sublabel}</div>
                    </div>
                    <div style="width: 48px; height: 28px; background: ${item.enabled ? '#6366f1' : 'rgba(255,255,255,0.1)'}; border-radius: 14px; position: relative; cursor: pointer; transition: all 0.3s;">
                        <div style="width: 24px; height: 24px; background: white; border-radius: 50%; position: absolute; top: 2px; ${item.enabled ? 'right: 2px;' : 'left: 2px;'} transition: all 0.3s;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="card">
            <h3 class="section-title">Appearance</h3>
            ${[
        { label: 'Theme', value: 'Dark', icon: '🌙' },
        { label: 'Language', value: 'English', icon: '🌐' },
        { label: 'Animations', value: 'On', icon: '✨' }
    ].map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-size: 1.5rem;">${item.icon}</span>
                        <span style="color: white; font-weight: 500;">${item.label}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #6b7299; font-size: 0.875rem;">${item.value}</span>
                        <span style="color: #6b7299;">›</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="card">
            <h3 class="section-title">Data</h3>
            ${[
        { label: 'Export Data', icon: '📥', color: '#6366f1' },
        { label: 'Import Data', icon: '📤', color: '#6366f1' },
        { label: 'Delete All Data', icon: '🗑️', color: '#ef4444' }
    ].map(item => `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                    <span style="font-size: 1.5rem;">${item.icon}</span>
                    <span style="color: ${item.color}; font-weight: 500;">${item.label}</span>
                </div>
            `).join('')}
        </div>
    </div>
`;

// Profile Screen - Complete Implementation
screens.profile = `
    <div class="screen-content">
        <div class="app-header">
            <div class="logo">
                <span style="font-size: 1.5rem;">☁️</span>
                Mood Weather
            </div>
            <div class="header-actions">
                <div class="icon-btn">🏠</div>
                <div class="icon-btn">⚙️</div>
            </div>
        </div>
        
        <div class="card" style="text-align: center; padding: 2rem;">
            <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #6366f1 0%, #a78bfa 100%); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 4rem; position: relative;">
                👤
                <div style="position: absolute; bottom: 0; right: 0; width: 36px; height: 36px; background: #10b981; border: 4px solid #0a0e27; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem;">✓</div>
            </div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: white; margin-bottom: 0.5rem;">Sarah Johnson</h2>
            <p style="color: #a0a8d4; margin-bottom: 0.5rem;">sarah.j@email.com</p>
            <div style="display: inline-block; padding: 0.5rem 1rem; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 2rem; color: #a78bfa; font-size: 0.875rem; font-weight: 600;">
                Member since Jan 2026
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
            ${[
        { icon: '📅', value: '45', label: 'Total Days' },
        { icon: '🔥', value: '15', label: 'Best Streak' },
        { icon: '☀️', value: '18', label: 'Amazing Days' },
        { icon: '⭐', value: '5', label: 'Achievements' }
    ].map(stat => `
                <div class="card" style="padding: 1.5rem; text-align: center; margin: 0;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${stat.icon}</div>
                    <div style="font-size: 1.75rem; font-weight: 700; color: #6366f1; margin-bottom: 0.25rem;">${stat.value}</div>
                    <div style="font-size: 0.875rem; color: #a0a8d4;">${stat.label}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="card">
            <h3 class="section-title">Achievements</h3>
            ${[
        { icon: '🏆', title: 'First Week', desc: 'Logged 7 consecutive days', unlocked: true },
        { icon: '🔥', title: 'Streak Master', desc: 'Reached 30-day streak', unlocked: true },
        { icon: '📊', title: 'Data Lover', desc: 'Logged 50 total days', unlocked: false },
        { icon: '⭐', title: 'Consistency King', desc: 'Logged every day for a month', unlocked: false }
    ].map(achievement => `
                <div style="display: flex; gap: 1rem; padding: 1rem; background: rgba(255,255,255,${achievement.unlocked ? '0.05' : '0.02'}); border-radius: 0.75rem; margin-bottom: 0.75rem; ${achievement.unlocked ? 'border: 1px solid rgba(99, 102, 241, 0.2);' : 'opacity: 0.5;'}">
                    <div style="width: 48px; height: 48px; background: ${achievement.unlocked ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">${achievement.icon}</div>
                    <div style="flex: 1;">
                        <h4 style="color: white; font-weight: 600; margin-bottom: 0.25rem;">${achievement.title}</h4>
                        <p style="color: #a0a8d4; font-size: 0.875rem;">${achievement.desc}</p>
                    </div>
                    ${achievement.unlocked ? '<div style="color: #10b981; font-size: 1.5rem;">✓</div>' : '<div style="color: #6b7299; font-size: 1.5rem;">🔒</div>'}
                </div>
            `).join('')}
        </div>
        
        <button class="btn-primary">Edit Profile</button>
    </div>
`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const phoneScreen = document.getElementById('phoneScreen');
    const screenButtons = document.querySelectorAll('.screen-btn');

    // Load initial screen
    loadScreen('splash');

    // Add click handlers
    screenButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const screenName = btn.dataset.screen;
            loadScreen(screenName);

            // Update active button
            screenButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function loadScreen(screenName) {
        const template = screens[screenName];
        if (!template) {
            console.error(`Screen "${screenName}" not found`);
            return;
        }

        // Create screen element
        const screenEl = document.createElement('div');
        screenEl.className = 'screen active';
        screenEl.innerHTML = template;

        // Clear and add new screen
        phoneScreen.innerHTML = '';
        phoneScreen.appendChild(screenEl);
    }
});
