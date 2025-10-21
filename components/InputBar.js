// components/InputBar.js
class InputBar {
    constructor(containerId, onSendMessage) {
        this.containerId = containerId;
        this.onSendMessage = onSendMessage;
        this.isLoading = false;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('❌ InputBar container not found:', this.containerId);
            return;
        }

        container.innerHTML = `
            <div class="input-bar">
                <div class="input-bar__field">
                    <input 
                        type="text" 
                        class="input-bar__input" 
                        placeholder="Type your question here..."
                        maxlength="500"
                    >
                    <button class="input-bar__send" ${this.isLoading ? 'disabled' : ''}>
                        <i class="fas ${this.isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}"></i>
                    </button>
                </div>
                <div class="input-bar__hint">
                    <span>Press Enter to send</span>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const input = document.querySelector('.input-bar__input');
        const sendButton = document.querySelector('.input-bar__send');

        if (!input || !sendButton) return;

        // Send on button click
        sendButton.addEventListener('click', () => {
            this.handleSend();
        });

        // Send on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Focus input on render
        setTimeout(() => {
            input.focus();
        }, 100);
    }

    handleSend() {
        const input = document.querySelector('.input-bar__input');
        if (!input) return;

        const message = input.value.trim();

        if (message && this.onSendMessage) {
            this.onSendMessage(message);
            input.value = '';
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const sendButton = document.querySelector('.input-bar__send');
        const icon = sendButton?.querySelector('i');
        
        if (sendButton && icon) {
            sendButton.disabled = loading;
            icon.className = loading ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane';
        }
    }

    focus() {
        const input = document.querySelector('.input-bar__input');
        if (input) {
            input.focus();
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputBar;
}