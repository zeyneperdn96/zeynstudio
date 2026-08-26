/* ========================================
   CONFIG & CONSTANTS
   Easy-to-update configuration
   ======================================== */

const CONFIG = {
    // Social Media Links
    social: {
        instagram: 'https://instagram.com/yourhandle',
        linkedin: 'https://www.linkedin.com/in/zynprdn/'
    },

    // Assets
    assets: {
        resume: 'assets/resume.pdf'
    },

    // Icon paths (uploaded pixel icons)
    icons: {
        myProject: 'assets/icons/my-project.png',
        aboutMe: 'assets/icons/about-me.png',
        contactMe: 'assets/icons/contact-me.png',
        myGallery: 'assets/icons/my-gallery.png',
        mediaPlayer: 'assets/icons/icon-mediaplayer.svg',
        commandPrompt: 'assets/icons/icon-cmd.svg',
        linkedin: 'assets/icons/icon-linkedin.svg',
        allPrograms: 'assets/icons/All Programs.png',
        shutDown: 'assets/icons/icon-shutdown.svg',
        logOff: 'assets/icons/icon-logoff.svg'
    },

    // Personal Info
    personal: {
        name: 'Zeyn',
        title: 'Multidisciplinary Designer',
        studio: 'ZeynStudio',
        bio: `I'm a multidisciplinary designer crafting playful, user-centered experiences — from game UI, HUDs and menus to interactive interfaces, illustration and physical product design.`
    },

    // Media Player Playlist
    playlist: [
        { title: "I'm Standing in the Mirror", src: 'assets/audio/playlist/im-standing-in-the-mirror.mp3' },
        { title: 'NOISE IN MY HEAD', src: 'assets/audio/playlist/noise-in-my-head.mp3' },
        { title: 'NOT OKAY (BUT I\'M TRYING)', src: 'assets/audio/playlist/not-okay-but-im-trying.mp3' },
        { title: 'STATIC SKIN', src: 'assets/audio/playlist/static-skin.mp3' },
        { title: 'WHY DO YOU CARE?', src: 'assets/audio/playlist/why-do-you-care.mp3' },
        { title: 'BOŞLUK', src: 'assets/audio/playlist/bosluk.mp3' },
        { title: 'Electronic Rock - King Around Here', src: 'assets/audio/playlist/electronic-rock-king-around-here.mp3' },
        { title: 'Energetic Rock Music', src: 'assets/audio/playlist/energetic-rock-music.mp3' },
        { title: 'Free Rock', src: 'assets/audio/playlist/free-rock.mp3' },
        { title: 'Pop Punk Rock Music', src: 'assets/audio/playlist/pop-punk-rock-music.mp3' },
        { title: 'Rock Free Music', src: 'assets/audio/playlist/rock-free-music.mp3' },
        { title: 'Sandbreaker', src: 'assets/audio/playlist/sandbreaker.mp3' }
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
                output: `Zeyn - Multidisciplinary Designer\nCreative. Curious. Playful.\nDesigning game UI, interactive experiences and visual systems.`
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
