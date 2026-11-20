/* ========================================
   ZEYN CINEMA — DATA
   Everything the Zeyn Cinema window shows comes from this file.

   ADD A FILM
   1. Put the files in assets/cinema/:
        films/<slug>.mp4            H.264 + AAC, long side 1280px, "faststart"
        posters/<slug>.jpg          one frame, long side 1280px
        posters/<slug>-thumb.jpg    same frame, long side 480px (cards)
        frames/<slug>-01..06.jpg    storyboard frames, long side 640px
   2. Copy one entry in `films` below and change it.
      `duration` is the real length in seconds, `aspect` is '16:9' or '9:16'.
   3. The first film with `featured: true` is shown when the window opens.

   PROCESS NOTES ("Explore the Process")
   Every film has `process` with six fields. An empty string shows
   "Notes coming soon." — write only what really happened. `storytelling`
   currently lists the scenes as they appear in the finished film.
   `processImages` takes { src, caption } items (sketches, prompts boards,
   look-dev stills...). Leave it empty until you have real images.

   SHOWREEL
   `showreel` is null until the file exists. Then set it to
   { src, poster, duration, aspect } and the Watch Showreel button plays it.
   ======================================== */

const CINEMA_DATA = {
    title: 'Zeyn Cinema',
    windowTitle: 'Zeyn Cinema — AI Films & Creative Projects',
    tagline: 'Short AI films, a cat sitcom and nostalgic worlds by Zeynep Erden',
    note: 'All films on this page are AI-generated short films.',

    categories: [
        { id: 'all', label: 'All Films' },
        { id: 'cat-sitcom', label: 'Cat Sitcom Universe', blurb: 'A grey cat and a red-haired heroine share an apartment — and every episode, the cat wins.' },
        { id: 'nostalgic', label: 'Nostalgic Worlds', blurb: 'Old Istanbul, Sivas in 1997 and other remembered places, reimagined.' },
        { id: 'experiments', label: 'Creative Experiments', blurb: 'Cinematic, surreal and experimental AI films.' }
    ],

    showreel: null,

    films: [
        {
            id: 'a-cup-of-bosphorus',
            title: 'A Cup of Bosphorus',
            category: 'experiments',
            featured: true,
            duration: 40.3,
            aspect: '16:9',
            src: 'assets/cinema/films/a-cup-of-bosphorus.mp4',
            poster: 'assets/cinema/posters/a-cup-of-bosphorus.jpg',
            thumb: 'assets/cinema/posters/a-cup-of-bosphorus-thumb.jpg',
            description: 'An afternoon tea by the window drifts into a daydream: a tiny rowing boat crosses the surface of the cup, a goldfish swims past, and a seagull in a captain\'s cap steers a ferry across the Bosphorus.',
            fanNote: '',
            frames: [
                { src: 'assets/cinema/frames/a-cup-of-bosphorus-01.jpg', t: 3.4 },
                { src: 'assets/cinema/frames/a-cup-of-bosphorus-02.jpg', t: 10.1 },
                { src: 'assets/cinema/frames/a-cup-of-bosphorus-03.jpg', t: 16.8 },
                { src: 'assets/cinema/frames/a-cup-of-bosphorus-04.jpg', t: 23.6 },
                { src: 'assets/cinema/frames/a-cup-of-bosphorus-05.jpg', t: 30.3 },
                { src: 'assets/cinema/frames/a-cup-of-bosphorus-06.jpg', t: 37.0 }
            ],
            process: {
                idea: '',
                direction: '',
                storytelling: [
                    'Hands around a cup of tea, the city soft behind the window.',
                    'At the drawing table, sketching goldfish.',
                    'The tea becomes a lake: she rows a tiny boat across the cup while a goldfish passes.',
                    'A ferry wheelhouse — the seagull captain at the controls.',
                    'She rides along with her tea, a small rabbit in a scarf beside her.',
                    'Back on the sofa at home, the captain now sits next to her.'
                ],
                workflow: '',
                challenges: '',
                result: ''
            },
            processImages: []
        },
        {
            id: 'the-therapy-session',
            title: 'The Therapy Session',
            category: 'cat-sitcom',
            duration: 28.4,
            aspect: '9:16',
            src: 'assets/cinema/films/the-therapy-session.mp4',
            poster: 'assets/cinema/posters/the-therapy-session.jpg',
            thumb: 'assets/cinema/posters/the-therapy-session-thumb.jpg',
            description: 'After an exhausting day she lies down for a session with her therapist — a grey cat in a tweed suit, notebook in paw. The fee: two cans of tuna.',
            fanNote: '',
            frames: [
                { src: 'assets/cinema/frames/the-therapy-session-01.jpg', t: 2.4 },
                { src: 'assets/cinema/frames/the-therapy-session-02.jpg', t: 7.1 },
                { src: 'assets/cinema/frames/the-therapy-session-03.jpg', t: 11.8 },
                { src: 'assets/cinema/frames/the-therapy-session-04.jpg', t: 16.6 },
                { src: 'assets/cinema/frames/the-therapy-session-05.jpg', t: 21.3 },
                { src: 'assets/cinema/frames/the-therapy-session-06.jpg', t: 26.1 }
            ],
            process: {
                idea: '',
                direction: '',
                storytelling: [
                    '"Today was exhausting."',
                    'The cat therapist: "Interesting. And how does that make you feel?"',
                    '"I literally just told you."',
                    '"That\'ll be two cans of tuna."',
                    '"Two? It was one last week." — "Inflation."',
                    'Close-up on her face as the bill sinks in.'
                ],
                workflow: '',
                challenges: '',
                result: ''
            },
            processImages: []
        },
        {
            id: 'spirits-of-istanbul',
            title: 'Spirits of Istanbul',
            category: 'nostalgic',
            duration: 53.3,
            aspect: '16:9',
            src: 'assets/cinema/films/spirits-of-istanbul.mp4',
            poster: 'assets/cinema/posters/spirits-of-istanbul.jpg',
            thumb: 'assets/cinema/posters/spirits-of-istanbul-thumb.jpg',
            description: 'Beloved spirits from Studio Ghibli films spend a rainy winter in Istanbul: queuing at the Kadıköy pier, roasting chestnuts in Eminönü, fishing in Üsküdar, warming a Cihangir tea house and pulling into a Beşiktaş bus stop.',
            fanNote: 'Fan-made, non-commercial tribute. Totoro, Kiki, No-Face, Calcifer, the soot sprites and the Catbus are characters from Studio Ghibli films. Not affiliated with or endorsed by Studio Ghibli.',
            frames: [
                { src: 'assets/cinema/frames/spirits-of-istanbul-01.jpg', t: 4.4 },
                { src: 'assets/cinema/frames/spirits-of-istanbul-02.jpg', t: 13.3 },
                { src: 'assets/cinema/frames/spirits-of-istanbul-03.jpg', t: 22.2 },
                { src: 'assets/cinema/frames/spirits-of-istanbul-04.jpg', t: 31.1 },
                { src: 'assets/cinema/frames/spirits-of-istanbul-05.jpg', t: 40.0 },
                { src: 'assets/cinema/frames/spirits-of-istanbul-06.jpg', t: 48.9 }
            ],
            process: {
                idea: '',
                direction: '',
                storytelling: [
                    'Totoro waits in line at the Kadıköy pier bus stop, shopping bags in hand.',
                    'Kiki flies over the Galata Tower.',
                    'Soot sprites gather around a chestnut cart by the Golden Horn.',
                    'No-Face shares a ferry bench with the commuters.',
                    'Totoro joins the fishermen in the fog across from the Maiden\'s Tower.',
                    'Calcifer burns in a tea house stove; the Catbus pulls into Beşiktaş; the day ends over tea in a secondhand bookshop.'
                ],
                workflow: '',
                challenges: '',
                result: ''
            },
            processImages: []
        },
        {
            id: 'the-cat-chef',
            title: 'The Cat Chef',
            category: 'cat-sitcom',
            duration: 26.8,
            aspect: '9:16',
            src: 'assets/cinema/films/the-cat-chef.mp4',
            poster: 'assets/cinema/posters/the-cat-chef.jpg',
            thumb: 'assets/cinema/posters/the-cat-chef-thumb.jpg',
            description: 'Dinner is under review. In chef\'s whites and glasses, the cat supervises from a kitchen stool while she cooks — and the tasting does not go her way.',
            fanNote: '',
            frames: [
                { src: 'assets/cinema/frames/the-cat-chef-01.jpg', t: 2.2 },
                { src: 'assets/cinema/frames/the-cat-chef-02.jpg', t: 6.7 },
                { src: 'assets/cinema/frames/the-cat-chef-03.jpg', t: 11.2 },
                { src: 'assets/cinema/frames/the-cat-chef-04.jpg', t: 15.6 },
                { src: 'assets/cinema/frames/the-cat-chef-05.jpg', t: 20.1 },
                { src: 'assets/cinema/frames/the-cat-chef-06.jpg', t: 24.6 }
            ],
            process: {
                idea: '',
                direction: '',
                storytelling: [
                    'The chef cat at the stove, glasses on, judging.',
                    'She argues her case over the pot.',
                    'She offers him a spoonful from the kitchen island.',
                    'The verdict, in one long look.',
                    'Her face says she heard it.'
                ],
                workflow: '',
                challenges: '',
                result: ''
            },
            processImages: []
        },
        {
            id: 'sivas-1997',
            title: 'Sivas, 1997',
            category: 'nostalgic',
            duration: 49.0,
            aspect: '9:16',
            src: 'assets/cinema/films/sivas-1997.mp4',
            poster: 'assets/cinema/posters/sivas-1997.jpg',
            thumb: 'assets/cinema/posters/sivas-1997-thumb.jpg',
            description: 'Pokémon as neighbours in a village in Sivas, 1997: playing the bağlama by the wood stove, carrying firewood through the mud, lighting the street lamps at dusk and joining the village concert.',
            fanNote: 'Fan-made, non-commercial tribute. Pokémon characters © Nintendo, Creatures Inc., GAME FREAK inc. and The Pokémon Company. Not affiliated with or endorsed by them.',
            frames: [
                { src: 'assets/cinema/frames/sivas-1997-01.jpg', t: 4.1 },
                { src: 'assets/cinema/frames/sivas-1997-02.jpg', t: 12.3 },
                { src: 'assets/cinema/frames/sivas-1997-03.jpg', t: 20.4 },
                { src: 'assets/cinema/frames/sivas-1997-04.jpg', t: 28.6 },
                { src: 'assets/cinema/frames/sivas-1997-05.jpg', t: 36.8 },
                { src: 'assets/cinema/frames/sivas-1997-06.jpg', t: 45.0 }
            ],
            process: {
                idea: '',
                direction: '',
                storytelling: [
                    'Jigglypuff plays the bağlama on the carpet, next to an old man and a CRT television.',
                    'Snorlax naps against a village house as a grandmother walks by.',
                    'Charmander keeps the wood stove going.',
                    'Charizard carries firewood across the muddy yard.',
                    'Pikachu lights the street lamp at dusk.',
                    'The village gathers for an open-air concert — Jigglypuff on stage.'
                ],
                workflow: '',
                challenges: '',
                result: ''
            },
            processImages: []
        },
        {
            id: 'the-hacker-cat',
            title: 'The Hacker Cat',
            category: 'cat-sitcom',
            duration: 30.0,
            aspect: '16:9',
            src: 'assets/cinema/films/the-hacker-cat.mp4',
            poster: 'assets/cinema/posters/the-hacker-cat.jpg',
            thumb: 'assets/cinema/posters/the-hacker-cat-thumb.jpg',
            description: 'A late-\'90s episode. She comes home with the groceries and finds the cat — red cap, flannel shirt — running a wall of CRT monitors. The groceries end up on the floor.',
            fanNote: '',
            frames: [
                { src: 'assets/cinema/frames/the-hacker-cat-01.jpg', t: 2.5 },
                { src: 'assets/cinema/frames/the-hacker-cat-02.jpg', t: 7.5 },
                { src: 'assets/cinema/frames/the-hacker-cat-03.jpg', t: 12.5 },
                { src: 'assets/cinema/frames/the-hacker-cat-04.jpg', t: 17.6 },
                { src: 'assets/cinema/frames/the-hacker-cat-05.jpg', t: 22.6 },
                { src: 'assets/cinema/frames/the-hacker-cat-06.jpg', t: 27.6 }
            ],
            process: {
                idea: '',
                direction: '',
                storytelling: [
                    'She walks in with a bag of groceries.',
                    'In the kitchen: the cat at a wall of glowing CRT monitors.',
                    'A stand-off across the counter.',
                    'The full setup, in all its glory.',
                    'Oranges roll across the floor.',
                    'The cat adjusts his cap. Back to work.'
                ],
                workflow: '',
                challenges: '',
                result: ''
            },
            processImages: []
        }
    ],

    // About the Creator panel. Contact links reuse the existing portfolio
    // (LinkedIn from CONFIG.social, Resume / Zeyn Chat / My Work windows).
    about: {
        name: 'Zeynep Erden',
        role: 'Multidisciplinary Designer · AI Creative',
        location: 'Istanbul, Turkey',
        intro: 'Zeyn Cinema is where I share the short films I make with AI: a running sitcom about a grey cat and his red-haired flatmate, nostalgic places reimagined, and cinematic experiments. I come to film from design — interfaces, illustration, games and products — so I think in characters, worlds and small details.',
        skills: [
            'AI Creative Direction',
            'Concept Development',
            'Visual Storytelling',
            'Character Development',
            'Worldbuilding'
        ]
    }
};

window.CINEMA_DATA = CINEMA_DATA;
