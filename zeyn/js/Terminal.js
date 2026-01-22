/* ========================================
   TERMINAL EASTER EGG
   Command Prompt window with fun commands
   ======================================== */

class Terminal {
    static createWindow() {
        const windowHTML = `
            <div class="window-titlebar">
                <span class="window-title">⌨️ Command Prompt</span>
                <div class="window-controls">
                    <button class="win-btn win-minimize" data-action="minimize">_</button>
                    <button class="win-btn win-maximize" data-action="maximize">□</button>
                    <button class="win-btn win-close" data-action="close">×</button>
                </div>
            </div>
            <div class="window-content" style="background: #000; color: #0F0; font-family: 'Courier New', monospace; font-size: 12px; padding: 12px;">
                <div id="terminal-output" style="margin-bottom: 12px; min-height: 300px; max-height: 400px; overflow-y: auto;"></div>
                <div style="display: flex; align-items: center;">
                    <span style="color: #0F0; margin-right: 8px;">C:\\&gt;</span>
                    <input type="text" id="terminal-input" style="flex: 1; background: transparent; border: none; color: #0F0; font-family: 'Courier New', monospace; font-size: 12px; outline: none;" autocomplete="off">
                </div>
            </div>
        `;

        return windowHTML;
    }

    static initialize(windowEl) {
        const output = windowEl.querySelector('#terminal-output');
        const input = windowEl.querySelector('#terminal-input');

        const terminal = new Terminal();
        terminal.output = output;
        terminal.input = input;
        terminal.history = [];
        terminal.historyIndex = -1;

        // Welcome message
        terminal.writeLine(window.CONFIG.terminal.welcome);
        terminal.writeLine('');

        // Input handler
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    terminal.executeCommand(command);
                    terminal.history.push(command);
                    terminal.historyIndex = terminal.history.length;
                }
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (terminal.historyIndex > 0) {
                    terminal.historyIndex--;
                    input.value = terminal.history[terminal.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (terminal.historyIndex < terminal.history.length - 1) {
                    terminal.historyIndex++;
                    input.value = terminal.history[terminal.historyIndex];
                } else {
                    terminal.historyIndex = terminal.history.length;
                    input.value = '';
                }
            }
        });

        // Auto-focus input
        input.focus();
        windowEl.addEventListener('click', () => input.focus());
    }

    writeLine(text) {
        const line = document.createElement('div');
        line.textContent = text;
        line.style.marginBottom = '4px';
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    executeCommand(command) {
        // Echo command
        this.writeLine(`C:\\> ${command}`);

        const cmd = command.toLowerCase();
        const commands = window.CONFIG.terminal.commands;

        if (commands[cmd]) {
            const cmdConfig = commands[cmd];

            if (cmdConfig.action === 'help') {
                this.writeLine('');
                this.writeLine('Available commands:');
                Object.keys(commands).forEach(key => {
                    this.writeLine(`  ${key.padEnd(10)} - ${commands[key].description}`);
                });
            } else if (cmdConfig.action === 'about') {
                this.writeLine('');
                this.writeLine(cmdConfig.output);
            } else if (cmdConfig.action === 'open') {
                this.writeLine('');
                this.writeLine(`Opening ${cmdConfig.window}...`);
                setTimeout(() => {
                    window.windowManager.openWindow(cmdConfig.window);
                }, 500);
            } else if (cmdConfig.action === 'clear') {
                this.output.innerHTML = '';
            } else if (cmdConfig.action === 'exit') {
                this.writeLine('');
                this.writeLine('Exiting terminal...');
                setTimeout(() => {
                    window.windowManager.closeWindow('terminal');
                }, 500);
            }
        } else {
            this.writeLine('');
            this.writeLine(`'${command}' is not recognized as a command.`);
            this.writeLine(`Type 'help' for a list of commands.`);
        }

        this.writeLine('');
    }
}

// Add Terminal template to WindowTemplates
if (window.WindowTemplates) {
    window.WindowTemplates.terminal = Terminal.createWindow;
}

window.Terminal = Terminal;
