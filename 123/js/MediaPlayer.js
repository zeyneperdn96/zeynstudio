/* ========================================
   MEDIA PLAYER
   Audio player with playlist support
   ======================================== */

class MediaPlayer {
    static initialize(windowEl) {
        const player = new MediaPlayer();
        player.windowEl = windowEl;
        player.audio = new Audio();
        player.audio.volume = 0.8;
        player.currentIndex = -1;
        player.isPlaying = false;
        player.playlist = window.CONFIG.playlist || [];

        player.playBtn = windowEl.querySelector('.mp-play');
        player.prevBtn = windowEl.querySelector('.mp-prev');
        player.nextBtn = windowEl.querySelector('.mp-next');
        player.volumeSlider = windowEl.querySelector('.mp-volume');
        player.progressBar = windowEl.querySelector('.mp-progress-bar');
        player.progressFill = windowEl.querySelector('.mp-progress-fill');
        player.timeCurrent = windowEl.querySelector('.mp-time-current');
        player.timeTotal = windowEl.querySelector('.mp-time-total');
        player.trackName = windowEl.querySelector('.mp-track-name');
        player.tracks = windowEl.querySelectorAll('.mp-track');

        player.setupEvents();
        return player;
    }

    setupEvents() {
        // Play/Pause
        this.playBtn.addEventListener('click', () => {
            if (this.currentIndex === -1 && this.playlist.length > 0) {
                this.loadTrack(0);
                this.play();
            } else if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });

        // Prev / Next
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());

        // Volume
        this.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Progress bar click
        this.progressBar.addEventListener('click', (e) => {
            if (this.audio.duration) {
                const rect = this.progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = percent * this.audio.duration;
            }
        });

        // Audio time update
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.duration) {
                const percent = (this.audio.currentTime / this.audio.duration) * 100;
                this.progressFill.style.width = percent + '%';
                this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
            }
        });

        // Audio loaded metadata
        this.audio.addEventListener('loadedmetadata', () => {
            this.timeTotal.textContent = this.formatTime(this.audio.duration);
        });

        // Track ended
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });

        // Playlist track clicks
        this.tracks.forEach(track => {
            track.addEventListener('click', () => {
                const index = parseInt(track.dataset.index);
                this.loadTrack(index);
                this.play();
            });
        });
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        this.currentIndex = index;
        const track = this.playlist[index];
        this.audio.src = track.src;
        this.trackName.textContent = track.title;

        // Highlight active track
        this.tracks.forEach(t => t.style.background = 'transparent');
        if (this.tracks[index]) {
            this.tracks[index].style.background = 'rgba(74, 158, 255, 0.2)';
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
        }).catch(err => {
            console.error('Playback error:', err);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.textContent = '▶';
    }

    nextTrack() {
        const next = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(next);
        this.play();
    }

    prevTrack() {
        const prev = this.currentIndex <= 0 ? this.playlist.length - 1 : this.currentIndex - 1;
        this.loadTrack(prev);
        this.play();
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    destroy() {
        this.audio.pause();
        this.audio.src = '';
    }
}

window.MediaPlayer = MediaPlayer;
