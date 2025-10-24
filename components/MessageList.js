// components/MessageList.js
class MessageList {
    constructor(containerId) {
        this.containerId = containerId;
        this.messages = [];
    }

    /**
     * Thêm tin nhắn vào danh sách
     * @param {string | object} content - Nội dung tin nhắn (string hoặc object {type: 'faqList', ...})
     * @param {boolean} isUser - Tin nhắn của người dùng?
     * @param {Date} timestamp - Dấu thời gian
     */
    addMessage(content, isUser = false, timestamp = new Date()) {
        const message = {
            id: Date.now() + Math.random(),
            content, // Sử dụng 'content'
            isUser,
            timestamp
        };
        
        this.messages.push(message);
        this.render();
        this.scrollToBottom();
        
        return message;
    }

    /**
     * (HELPER) Render tin nhắn dạng văn bản
     */
    _renderTextMessage(message) {
        return `
            <div class="message__content">
                <div class="message__text">${this.escapeHtml(message.content)}</div>
                <div class="message__time">
                    ${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        `;
    }

    /**
     * (HELPER) Render tin nhắn dạng danh sách FAQ
     */
    _renderFaqListMessage(message) {
        const faqsHtml = message.content.faqs.map(faq => `
            <a href="#" class="message__faq-item" data-question="${this.escapeHtml(faq.question)}">
                <i class="fas fa-file-alt"></i>
                <span>${this.escapeHtml(faq.question)}</span>
            </a>
        `).join(''); //

        return `
            <div class="message__content">
                <div class="message__text">Here are some top questions that might help:</div>
                <div class="message__faq-list">
                    ${faqsHtml}
                </div>
                <div class="message__time">
                    ${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        `;
    }

    /**
     * Render toàn bộ danh sách tin nhắn ra DOM
     */
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('❌ MessageList container not found:', this.containerId);
            return;
        }

        const messagesHTML = this.messages.map(message => {
            let contentHtml = '';
            
            // Quyết định render kiểu nào
            if (typeof message.content === 'string') {
                contentHtml = this._renderTextMessage(message);
            } else if (message.content && message.content.type === 'faqList') {
                contentHtml = this._renderFaqListMessage(message);
            }

            return `
                <div class="message ${message.isUser ? 'message--user' : 'message--bot'}" data-id="${message.id}">
                    ${contentHtml}
                    <div class="message__avatar">
                        <i class="fas ${message.isUser ? 'fa-user' : 'fa-robot'}"></i>
                    </div>
                </div>
            `;
        }).join('');

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

// Dòng này dùng để test (nếu có), không ảnh hưởng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageList;
}