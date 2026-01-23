/* ========================================
   CONFIG & CONSTANTS
   Easy-to-update configuration
   ======================================== */

const CONFIG = {
    // Social Media Links
    social: {
        instagram: 'https://instagram.com/yourhandle',
        github: 'https://github.com/yourhandle',
        linkedin: 'https://www.linkedin.com/in/zynprdn/'
    },

    // Assets
    assets: {
        resume: 'assets/resume.pdf'
    },

    // Icon paths (uploaded pixel icons)
    icons: {
        myProject: 'assets/icons/my project.png',
        aboutMe: 'assets/icons/about me.png',
        contactMe: 'assets/icons/contact me.png',
        myGallery: 'assets/icons/My Gallery.png',
        mediaPlayer: 'assets/icons/media player.png',
        commandPrompt: 'assets/icons/command prompt.png',
        linkedin: 'assets/icons/LinkedIn.png',
        allPrograms: 'assets/icons/All Programs.png',
        shutDown: 'assets/icons/shut down.png',
        restart: 'assets/icons/Restart.png',
        standBy: 'assets/icons/Stand By.png'
    },

    // Personal Info
    personal: {
        name: 'Zeyn',
        title: 'Industrial Designer',
        studio: 'ZeynStudio',
        bio: `I'm an industrial designer with a passion for creating meaningful, user-centered experiences. My work spans digital interfaces, illustrations, and physical product design.`
    },

    // Media Player Playlist
    playlist: [
        { title: 'Track 1', src: 'assets/audio/playlist/track1.mp3' },
        { title: 'Track 2', src: 'assets/audio/playlist/track2.mp3' },
        { title: 'Track 3', src: 'assets/audio/playlist/track3.mp3' }
    ],

    // Terminal Easter Egg
    terminal: {
        welcome: 'ZeynStudio XP Terminal\nType "help" to see commands.',
        commands: {
            help: {
                description: 'Available commands: help, about, projects, contact, clear, exit',
                action: 'help'
            },
            about: {
                description: 'About Zeyn',
                action: 'about',
                output: `Zeyn - Industrial Designer\nCreative. Curious. Playful.\nBuilding experiences at the intersection of digital and physical design.`
            },
            projects: {
                description: 'Open My Projects window',
                action: 'open',
                window: 'work'
            },
            contact: {
                description: 'Open Contact window',
                action: 'open',
                window: 'contact'
            },
            clear: {
                description: 'Clear terminal screen',
                action: 'clear'
            },
            exit: {
                description: 'Close terminal window',
                action: 'exit'
            }
        }
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;
