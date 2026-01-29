/* ========================================
   MEDIA PLAYER - Windows Media Player 9 Style
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
            ctx.fillStyle = 'rgba(60, 160, 60, 0.3)';
            ctx.fillRect(x, midY - barHeight, barWidth, barHeight);
            ctx.fillStyle = 'rgba(60, 160, 60, 0.1)';
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

                // WMP9-style green-to-yellow bars
                const gradient = ctx.createLinearGradient(x, midY, x, barTop);
                gradient.addColorStop(0, 'rgba(20, 140, 40, 0.95)');
                gradient.addColorStop(0.5, 'rgba(60, 200, 60, 0.95)');
                gradient.addColorStop(0.8, 'rgba(180, 220, 40, 0.95)');
                gradient.addColorStop(1, 'rgba(240, 240, 60, 0.98)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, barTop, barWidth, barHeight);

                // Glossy highlight
                if (val > 0.05) {
                    const highlightH = Math.min(barHeight * 0.3, 8);
                    ctx.fillStyle = 'rgba(220, 255, 200, 0.35)';
                    ctx.fillRect(x, barTop, barWidth, highlightH);
                }

                // Peak indicator
                if (val > 0.15) {
                    ctx.fillStyle = 'rgba(255, 255, 180, 0.9)';
                    ctx.fillRect(x, barTop, barWidth, 2);
                }

                // Reflection below midline
                const reflectH = barHeight * 0.4;
                const reflectGrad = ctx.createLinearGradient(x, midY + 1, x, midY + 1 + reflectH);
                reflectGrad.addColorStop(0, 'rgba(40, 160, 60, 0.2)');
                reflectGrad.addColorStop(1, 'rgba(40, 160, 60, 0)');
                ctx.fillStyle = reflectGrad;
                ctx.fillRect(x, midY + 1, barWidth, reflectH);
            }

            // Subtle midline
            ctx.fillStyle = 'rgba(60, 160, 60, 0.15)';
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
            this.shuffleBtn.style.color = this.isShuffle ? '#fff' : '#8ab8e0';
            this.shuffleBtn.style.borderColor = this.isShuffle ? '#4a80b0' : 'transparent';
            this.shuffleBtn.style.background = this.isShuffle ? 'rgba(255,255,255,0.15)' : 'none';
        });

        // Repeat toggle: off -> all -> one -> off
        this.repeatBtn.addEventListener('click', () => {
            this.repeatMode = (this.repeatMode + 1) % 3;
            if (this.repeatMode === 0) {
                this.repeatBtn.textContent = '🔁';
                this.repeatBtn.style.color = '#8ab8e0';
                this.repeatBtn.style.borderColor = 'transparent';
                this.repeatBtn.style.background = 'none';
            } else if (this.repeatMode === 1) {
                this.repeatBtn.textContent = '🔁';
                this.repeatBtn.style.color = '#fff';
                this.repeatBtn.style.borderColor = '#4a80b0';
                this.repeatBtn.style.background = 'rgba(255,255,255,0.15)';
            } else {
                this.repeatBtn.textContent = '🔂';
                this.repeatBtn.style.color = '#fff';
                this.repeatBtn.style.borderColor = '#4a80b0';
                this.repeatBtn.style.background = 'rgba(255,255,255,0.2)';
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

            // Hover effect (XP-style highlight)
            track.addEventListener('mouseenter', () => {
                if (parseInt(track.dataset.index) !== this.currentIndex) {
                    track.style.background = '#e8f0fa';
                }
            });
            track.addEventListener('mouseleave', () => {
                if (parseInt(track.dataset.index) !== this.currentIndex) {
                    track.style.background = 'transparent';
                }
            });
        });

        // Button hover effects (WMP9 metallic style)
        this.windowEl.querySelectorAll('.mp-btn').forEach(btn => {
            if (btn === this.playBtn) return;
            const isTransport = btn.classList.contains('mp-prev') || btn.classList.contains('mp-next') || btn.classList.contains('mp-stop');
            btn.addEventListener('mouseenter', () => {
                if (isTransport) {
                    btn.style.background = 'linear-gradient(180deg, #e8f0fa 0%, #c0d4e8 50%, #a8c0d8 100%)';
                    btn.style.borderColor = '#5a80a8';
                } else if (!btn.classList.contains('mp-shuffle') && !btn.classList.contains('mp-repeat')) {
                    btn.style.color = '#fff';
                    btn.style.background = 'rgba(255,255,255,0.15)';
                }
            });
            btn.addEventListener('mouseleave', () => {
                if (isTransport) {
                    btn.style.background = 'linear-gradient(180deg, #d8e4f0 0%, #a8bcd0 50%, #90a8c0 100%)';
                    btn.style.borderColor = '#6a8aaa';
                } else if (!btn.classList.contains('mp-shuffle') && !btn.classList.contains('mp-repeat')) {
                    btn.style.color = '#8ab8e0';
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'none';
                }
                if (btn.classList.contains('mp-shuffle') && !this.isShuffle) {
                    btn.style.color = '#8ab8e0';
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'none';
                }
                if (btn.classList.contains('mp-repeat') && this.repeatMode === 0) {
                    btn.style.color = '#8ab8e0';
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'none';
                }
            });
        });

        // Play button hover (metallic XP style)
        this.playBtn.addEventListener('mouseenter', () => {
            this.playBtn.style.background = 'linear-gradient(180deg, #f0f6ff 0%, #c8daf0 50%, #a8c0d8 100%)';
            this.playBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
        });
        this.playBtn.addEventListener('mouseleave', () => {
            this.playBtn.style.background = 'linear-gradient(180deg, #e8f0fa 0%, #b0c8e0 50%, #90aac8 100%)';
            this.playBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
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
            t.style.color = '#1a3a60';
        });
        if (this.tracks[index]) {
            this.tracks[index].style.background = '#316ac5';
            this.tracks[index].style.color = '#fff';
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
