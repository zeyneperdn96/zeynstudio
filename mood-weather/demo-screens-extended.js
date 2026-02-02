// Additional Complete Screen Implementations
// This file extends demo.js with the remaining screens

// Add these to the screens object in demo.js:

// History Screen
const historyScreen = `
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

// Insights Screen
const insightsScreen = `
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
            <h3 class="section-title">Time of Day</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
                ${[
        { time: 'Morning', emoji: '🌅', percent: '25%' },
        { time: 'Afternoon', emoji: '☀️', percent: '35%' },
        { time: 'Evening', emoji: '🌆', percent: '30%' },
        { time: 'Night', emoji: '🌙', percent: '10%' }
    ].map(t => `
                    <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 0.75rem;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${t.emoji}</div>
                        <div style="font-size: 1.25rem; font-weight: 700; color: #6366f1; margin-bottom: 0.25rem;">${t.percent}</div>
                        <div style="font-size: 0.75rem; color: #a0a8d4;">${t.time}</div>
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

// Streak Screen
const streakScreen = `
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
        
        <div class="card" style="background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💪</div>
            <p style="color: #a0a8d4; font-style: italic;">"Consistency is the key to success!"</p>
        </div>
        
        <button class="btn-primary">Share Achievement</button>
    </div>
`;

// Notifications Screen
const notificationsScreen = `
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
        { icon: '⭐', title: 'New Achievement!', desc: 'You completed your first week 🎉', time: 'Yesterday, 8:30 PM', unread: false },
        { icon: '📊', title: 'Weekly Summary Ready', desc: 'You logged 5 days this week', time: 'Yesterday, 9:00 AM', unread: false }
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

// Settings Screen
const settingsScreen = `
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
        
        <div class="card">
            <h3 class="section-title">About</h3>
            ${[
        { label: 'Version', value: '1.0.0' },
        { label: 'Privacy Policy', value: '' },
        { label: 'Terms of Service', value: '' },
        { label: 'Contact Us', value: '' }
    ].map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                    <span style="color: white; font-weight: 500;">${item.label}</span>
                    ${item.value ? `<span style="color: #6b7299; font-size: 0.875rem;">${item.value}</span>` : '<span style="color: #6b7299;">›</span>'}
                </div>
            `).join('')}
        </div>
    </div>
`;

// Profile Screen
const profileScreen = `
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

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        historyScreen,
        insightsScreen,
        streakScreen,
        notificationsScreen,
        settingsScreen,
        profileScreen
    };
}
