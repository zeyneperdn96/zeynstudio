/* ========================================
   MEDIA PLAYER - Windows Media Player 11 Style
   Audio player with visualizer, shuffle, repeat, seek drag
   ======================================== */

class MediaPlayer {
    static initialize(windowEl) {
        const player = new MediaPlayer();
        player.windowEl = windowEl;
        player.audio = new Audio();
        player.audio.volume = 0.8;
        player.currentIndex = -1;
        player.isPlaying = false;
        player.isShuffle = false;
        player.repeatMode = 0; // 0=off, 1=all, 2=one
        player.playlist = window.CONFIG.playlist || [];
        player.isSeeking = false;
        player.audioCtx = null;
        player.analyser = null;
        player.animFrameId = null;

        player.playBtn = windowEl.querySelector('.mp-play');
        player.prevBtn = windowEl.querySelector('.mp-prev');
        player.nextBtn = windowEl.querySelector('.mp-next');
        player.stopBtn = windowEl.querySelector('.mp-stop');
        player.shuffleBtn = windowEl.querySelector('.mp-shuffle');
        player.repeatBtn = windowEl.querySelector('.mp-repeat');
        player.volumeSlider = windowEl.querySelector('.mp-volume');
        player.volumeIcon = windowEl.querySelector('.mp-volume-icon');
        player.progressBar = windowEl.querySelector('.mp-progress-bar');
        player.progressFill = windowEl.querySelector('.mp-progress-fill');
        player.seekThumb = windowEl.querySelector('.mp-seek-thumb');
        player.timeCurrent = windowEl.querySelector('.mp-time-current');
        player.timeTotal = windowEl.querySelector('.mp-time-total');
        player.trackName = windowEl.querySelector('.mp-track-name');
        player.tracks = windowEl.querySelectorAll('.mp-track');
        player.canvas = windowEl.querySelector('.mp-visualizer-canvas');
        player.canvasCtx = player.canvas ? player.canvas.getContext('2d') : null;

        player.setupEvents();
        player.drawIdleVisualizer();
        return player;
    }

    setupAudioContext() {
        if (this.audioCtx) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 64;
            this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }

    drawIdleVisualizer() {
        if (!this.canvasCtx || !this.canvas) return;
        const ctx = this.canvasCtx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const midY = h * 0.55;
        ctx.clearRect(0, 0, w, h);

        const barCount = 32;
        const totalWidth = w * 0.85;
        const startX = (w - totalWidth) / 2;
        const barWidth = (totalWidth / barCount) * 0.75;
        const gap = (totalWidth / barCount) * 0.25;

        for (let i = 0; i < barCount; i++) {
            const barHeight = 2 + Math.random() * 5;
            const x = startX + i * (barWidth + gap);
            ctx.fillStyle = 'rgba(30, 90, 160, 0.35)';
            ctx.fillRect(x, midY - barHeight, barWidth, barHeight);
            // Reflection
            ctx.fillStyle = 'rgba(30, 90, 160, 0.12)';
            ctx.fillRect(x, midY + 1, barWidth, barHeight * 0.5);
        }
    }

    drawVisualizer() {
        if (!this.analyser || !this.canvasCtx || !this.canvas) return;

        const ctx = this.canvasCtx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const midY = h * 0.55;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            this.animFrameId = requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, w, h);

            const barCount = bufferLength;
            const totalWidth = w * 0.85;
            const startX = (w - totalWidth) / 2;
            const barWidth = (totalWidth / barCount) * 0.75;
            const gap = (totalWidth / barCount) * 0.25;
            const maxBarH = midY * 0.9;

            for (let i = 0; i < barCount; i++) {
                const val = dataArray[i] / 255;
                const barHeight = val * maxBarH + 2;
                const x = startX + i * (barWidth + gap);
                const barTop = midY - barHeight;

                // Main bar gradient (bottom bright -> top white/cyan)
                const gradient = ctx.createLinearGradient(x, midY, x, barTop);
                gradient.addColorStop(0, 'rgba(20, 60, 140, 0.95)');
                gradient.addColorStop(0.3, 'rgba(40, 120, 220, 0.95)');
                gradient.addColorStop(0.7, 'rgba(80, 180, 255, 0.95)');
                gradient.addColorStop(1, 'rgba(180, 230, 255, 0.98)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, barTop, barWidth, barHeight);

                // Glossy highlight on top portion
                if (val > 0.05) {
                    const highlightH = Math.min(barHeight * 0.3, 8);
                    ctx.fillStyle = 'rgba(200, 240, 255, 0.4)';
                    ctx.fillRect(x, barTop, barWidth, highlightH);
                }

                // Peak indicator (bright dot at top)
                if (val > 0.15) {
                    ctx.fillStyle = 'rgba(220, 245, 255, 0.9)';
                    ctx.fillRect(x, barTop, barWidth, 2);
                }

                // Reflection below midline (flipped, faded)
                const reflectH = barHeight * 0.4;
                const reflectGrad = ctx.createLinearGradient(x, midY + 1, x, midY + 1 + reflectH);
                reflectGrad.addColorStop(0, 'rgba(40, 120, 220, 0.25)');
                reflectGrad.addColorStop(1, 'rgba(40, 120, 220, 0)');
                ctx.fillStyle = reflectGrad;
                ctx.fillRect(x, midY + 1, barWidth, reflectH);
            }

            // Subtle midline
            ctx.fillStyle = 'rgba(60, 140, 220, 0.15)';
            ctx.fillRect(startX, midY, totalWidth, 1);
        };

        draw();
    }

    stopVisualizer() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.drawIdleVisualizer();
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

        // Stop
        this.stopBtn.addEventListener('click', () => this.stop());

        // Prev / Next
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());

        // Shuffle toggle
        this.shuffleBtn.addEventListener('click', () => {
            this.isShuffle = !this.isShuffle;
            this.shuffleBtn.style.color = this.isShuffle ? '#4a9eff' : '#4a7aaa';
            this.shuffleBtn.style.borderColor = this.isShuffle ? '#2a5a8a' : 'transparent';
            this.shuffleBtn.style.background = this.isShuffle ? 'rgba(74,158,255,0.1)' : 'none';
        });

        // Repeat toggle: off -> all -> one -> off
        this.repeatBtn.addEventListener('click', () => {
            this.repeatMode = (this.repeatMode + 1) % 3;
            if (this.repeatMode === 0) {
                this.repeatBtn.textContent = '🔁';
                this.repeatBtn.style.color = '#4a7aaa';
                this.repeatBtn.style.borderColor = 'transparent';
                this.repeatBtn.style.background = 'none';
            } else if (this.repeatMode === 1) {
                this.repeatBtn.textContent = '🔁';
                this.repeatBtn.style.color = '#4a9eff';
                this.repeatBtn.style.borderColor = '#2a5a8a';
                this.repeatBtn.style.background = 'rgba(74,158,255,0.1)';
            } else {
                this.repeatBtn.textContent = '🔂';
                this.repeatBtn.style.color = '#4a9eff';
                this.repeatBtn.style.borderColor = '#2a5a8a';
                this.repeatBtn.style.background = 'rgba(74,158,255,0.15)';
            }
        });

        // Volume
        this.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
            this.updateVolumeIcon();
        });

        // Volume icon click to mute/unmute
        this.volumeIcon.addEventListener('click', () => {
            if (this.audio.volume > 0) {
                this._savedVolume = this.audio.volume;
                this.audio.volume = 0;
                this.volumeSlider.value = 0;
            } else {
                this.audio.volume = this._savedVolume || 0.8;
                this.volumeSlider.value = this.audio.volume * 100;
            }
            this.updateVolumeIcon();
        });

        // Seek bar - click
        this.progressBar.addEventListener('click', (e) => {
            if (this.isSeeking) return;
            if (this.audio.duration) {
                const rect = this.progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = Math.max(0, Math.min(percent, 1)) * this.audio.duration;
            }
        });

        // Seek bar - drag
        this.progressBar.addEventListener('mousedown', (e) => {
            if (!this.audio.duration) return;
            this.isSeeking = true;
            this.seekThumb.style.cursor = 'grabbing';
            const onMove = (ev) => {
                const rect = this.progressBar.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                this.progressFill.style.width = (percent * 100) + '%';
                this.timeCurrent.textContent = this.formatTime(percent * this.audio.duration);
            };
            const onUp = (ev) => {
                const rect = this.progressBar.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                this.audio.currentTime = percent * this.audio.duration;
                this.isSeeking = false;
                this.seekThumb.style.cursor = 'grab';
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        // Show/hide seek thumb on hover
        this.progressBar.addEventListener('mouseenter', () => {
            this.seekThumb.style.display = 'block';
        });
        this.progressBar.addEventListener('mouseleave', () => {
            if (!this.isSeeking) this.seekThumb.style.display = 'none';
        });

        // Audio time update
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.duration && !this.isSeeking) {
                const percent = (this.audio.currentTime / this.audio.duration) * 100;
                this.progressFill.style.width = percent + '%';
                this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
            }
        });

        // Audio loaded metadata
        this.audio.addEventListener('loadedmetadata', () => {
            this.timeTotal.textContent = this.formatTime(this.audio.duration);
            // Update duration in playlist
            if (this.currentIndex >= 0 && this.tracks[this.currentIndex]) {
                const durEl = this.tracks[this.currentIndex].querySelector('.mp-track-duration');
                if (durEl) durEl.textContent = this.formatTime(this.audio.duration);
            }
        });

        // Track ended
        this.audio.addEventListener('ended', () => {
            if (this.repeatMode === 2) {
                // Repeat one
                this.audio.currentTime = 0;
                this.play();
            } else {
                this.nextTrack();
            }
        });

        // Playlist track clicks
        this.tracks.forEach(track => {
            track.addEventListener('click', () => {
                const index = parseInt(track.dataset.index);
                this.loadTrack(index);
                this.play();
            });

            // Hover effect
            track.addEventListener('mouseenter', () => {
                if (parseInt(track.dataset.index) !== this.currentIndex) {
                    track.style.background = 'rgba(74,158,255,0.08)';
                }
            });
            track.addEventListener('mouseleave', () => {
                if (parseInt(track.dataset.index) !== this.currentIndex) {
                    track.style.background = 'transparent';
                }
            });
        });

        // Button hover effects
        this.windowEl.querySelectorAll('.mp-btn').forEach(btn => {
            if (btn === this.playBtn) return; // play button has its own style
            btn.addEventListener('mouseenter', () => {
                if (!btn.classList.contains('mp-shuffle') && !btn.classList.contains('mp-repeat')) {
                    btn.style.color = '#c0e0ff';
                    btn.style.borderColor = '#2a5a8a';
                    btn.style.background = 'rgba(74,158,255,0.1)';
                }
            });
            btn.addEventListener('mouseleave', () => {
                if (!btn.classList.contains('mp-shuffle') && !btn.classList.contains('mp-repeat')) {
                    btn.style.color = '#8ab8e0';
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'none';
                }
                // Restore shuffle/repeat active states
                if (btn.classList.contains('mp-shuffle') && !this.isShuffle) {
                    btn.style.color = '#4a7aaa';
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'none';
                }
                if (btn.classList.contains('mp-repeat') && this.repeatMode === 0) {
                    btn.style.color = '#4a7aaa';
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'none';
                }
            });
        });

        // Play button hover
        this.playBtn.addEventListener('mouseenter', () => {
            this.playBtn.style.background = 'linear-gradient(180deg, #3a7aba 0%, #2a5a8a 100%)';
            this.playBtn.style.boxShadow = '0 0 12px rgba(74,158,255,0.5)';
        });
        this.playBtn.addEventListener('mouseleave', () => {
            this.playBtn.style.background = 'linear-gradient(180deg, #2a5a8a 0%, #1a3a5a 100%)';
            this.playBtn.style.boxShadow = '0 0 8px rgba(74,158,255,0.3)';
        });
    }

    updateVolumeIcon() {
        if (this.audio.volume === 0) {
            this.volumeIcon.textContent = '🔇';
        } else if (this.audio.volume < 0.5) {
            this.volumeIcon.textContent = '🔉';
        } else {
            this.volumeIcon.textContent = '🔊';
        }
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        this.currentIndex = index;
        const track = this.playlist[index];
        this.audio.src = track.src;
        this.trackName.textContent = track.title;

        // Highlight active track
        this.tracks.forEach(t => {
            t.style.background = 'transparent';
            t.style.color = '#8ab8e0';
        });
        if (this.tracks[index]) {
            this.tracks[index].style.background = 'rgba(74, 158, 255, 0.15)';
            this.tracks[index].style.color = '#c0e0ff';
            // Scroll into view
            this.tracks[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    play() {
        this.setupAudioContext();
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
            this.drawVisualizer();
        }).catch(err => {
            console.error('Playback error:', err);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.textContent = '▶';
        this.stopVisualizer();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.playBtn.textContent = '▶';
        this.progressFill.style.width = '0%';
        this.timeCurrent.textContent = '0:00';
        this.stopVisualizer();
    }

    nextTrack() {
        if (this.playlist.length === 0) return;

        let next;
        if (this.isShuffle) {
            do {
                next = Math.floor(Math.random() * this.playlist.length);
            } while (next === this.currentIndex && this.playlist.length > 1);
        } else {
            next = this.currentIndex + 1;
            if (next >= this.playlist.length) {
                if (this.repeatMode >= 1) {
                    next = 0;
                } else {
                    this.stop();
                    return;
                }
            }
        }
        this.loadTrack(next);
        this.play();
    }

    prevTrack() {
        // If more than 3 seconds in, restart current track
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
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
        this.stopVisualizer();
        this.audio.pause();
        this.audio.src = '';
        if (this.audioCtx) {
            this.audioCtx.close().catch(() => {});
            this.audioCtx = null;
        }
    }
}

window.MediaPlayer = MediaPlayer;
