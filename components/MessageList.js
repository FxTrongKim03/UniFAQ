// components/MessageList.js
class MessageList {
    constructor(containerId) {
        this.containerId = containerId;
        this.messages = [];
    }

    addMessage(text, isUser = false, timestamp = new Date()) {
        const message = {
            id: Date.now() + Math.random(),
            text,
            isUser,
            timestamp
        };
        
        this.messages.push(message);
        this.render();
        this.scrollToBottom();
        
        return message;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('❌ MessageList container not found:', this.containerId);
            return;
        }

        const messagesHTML = this.messages.map(message => `
            <div class="message ${message.isUser ? 'message--user' : 'message--bot'}" data-id="${message.id}">
                <div class="message__content">
                    <div class="message__text">${this.escapeHtml(message.text)}</div>
                    <div class="message__time">
                        ${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div class="message__avatar">
                    <i class="fas ${message.isUser ? 'fa-user' : 'fa-robot'}"></i>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="message-list">
                ${this.messages.length === 0 ? `
                    <div class="message-list__empty">
                        <i class="fas fa-comments"></i>
                        <p>Start a conversation with UniFAQ Assistant</p>
                    </div>
                ` : messagesHTML}
            </div>
        `;
    }

    scrollToBottom() {
        const messageList = document.querySelector('.message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }

    clear() {
        this.messages = [];
        this.render();
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageList;
}