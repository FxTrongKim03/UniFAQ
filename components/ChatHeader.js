// components/ChatHeader.js
class ChatHeader {
    constructor(containerId, title = "UniFAQ Assistant") {
        this.containerId = containerId;
        this.title = title;
        this.status = "online";
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('❌ ChatHeader container not found:', this.containerId);
            return;
        }

        container.innerHTML = `
            <div class="chat-header">
                <div class="chat-header__info">
                    <div class="chat-header__avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-header__details">
                        <h3 class="chat-header__title">${this.title}</h3>
                        <span class="chat-header__status chat-header__status--${this.status}">${this.status}</span>
                    </div>
                </div>
                <div class="chat-header__actions">
                    <button class="chat-header__btn" title="Minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="chat-header__btn" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const closeBtn = document.querySelector('.chat-header__btn:last-child');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // You can add close functionality here
                console.log('Close chat clicked');
            });
        }
    }

    setStatus(status) {
        this.status = status;
        const statusElement = document.querySelector('.chat-header__status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `chat-header__status chat-header__status--${status}`;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatHeader;
}