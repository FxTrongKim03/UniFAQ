// components/InputBar.js
class InputBar {
    constructor(containerId, onSendMessage, onSearchSuggestions) { // Thêm callback mới
        this.containerId = containerId;
        this.onSendMessage = onSendMessage;
        this.onSearchSuggestions = onSearchSuggestions; // Lưu callback mới
        this.isLoading = false;
        this.debounceTimer = null; // Dùng cho debounce (trì hoãn)
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('❌ InputBar container not found:', this.containerId);
            return;
        }

        container.innerHTML = `
            <div class="input-bar">
                <div class="input-bar__suggestions" id="input-suggestions"></div>

                <div class="input-bar__field">
                    <input 
                        type="text" 
                        class="input-bar__input" 
                        placeholder="Type your question here..."
                        maxlength="500"
                        autocomplete="off"
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
        const suggestionsContainer = document.getElementById('input-suggestions');

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

        // --- MỚI: Xử lý khi gõ phím ---
        input.addEventListener('input', () => {
            const query = input.value.trim();
            
            // Xóa timer cũ
            clearTimeout(this.debounceTimer);

            if (query.length < 3) {
                this.clearSuggestions();
                return;
            }

            // Đặt timer mới (trì hoãn 300ms)
            this.debounceTimer = setTimeout(() => {
                if (this.onSearchSuggestions) {
                    this.onSearchSuggestions(query);
                }
            }, 300); 
        });

        // Xóa gợi ý khi click ra ngoài
        input.addEventListener('blur', () => {
            // Trì hoãn 1 chút để kịp xử lý click vào gợi ý
            setTimeout(() => this.clearSuggestions(), 150); 
        });

        // Xử lý click vào một gợi ý
        if (suggestionsContainer) {
            // Dùng 'mousedown' thay vì 'click' để chạy trước sự kiện 'blur'
            suggestionsContainer.addEventListener('mousedown', (e) => {
                const suggestionItem = e.target.closest('.input-bar__suggestion-item');
                if (suggestionItem && suggestionItem.dataset.question) {
                    e.preventDefault(); // Ngăn input bị blur
                    this.handleSend(suggestionItem.dataset.question);
                }
            });
        }
        
        // Focus input on render
        setTimeout(() => {
            input.focus();
        }, 100);
    }

    // --- MỚI: Hàm render gợi ý ---
    renderSuggestions(faqs) {
        const container = document.getElementById('input-suggestions');
        if (!container) return;

        if (faqs.length === 0) {
            this.clearSuggestions();
            return;
        }

        const faqsHtml = faqs.map(faq => `
            <div class="input-bar__suggestion-item" data-question="${this.escapeHtml(faq.question)}">
                <i class="fas fa-file-alt"></i>
                <span>${this.escapeHtml(faq.question)}</span>
            </div>
        `).join('');

        container.innerHTML = faqsHtml;
        container.style.display = 'block';
    }

    // --- MỚI: Hàm xóa gợi ý ---
    clearSuggestions() {
        const container = document.getElementById('input-suggestions');
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    }

    // Sửa handleSend để chấp nhận tin nhắn (khi click gợi ý)
    handleSend(messageOverride = null) {
        const input = document.querySelector('.input-bar__input');
        if (!input) return;

        const message = messageOverride || input.value.trim();

        if (message && this.onSendMessage) {
            this.onSendMessage(message);
            input.value = ''; // Xóa input
            this.clearSuggestions(); // Xóa gợi ý
            input.focus();
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
    module.exports = InputBar;
}