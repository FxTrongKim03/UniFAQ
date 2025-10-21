// components/ChatApp.js
class ChatApp {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ ChatApp container not found:', containerId);
            return;
        }
        
        this.messages = [];
        this.isOpen = false;
        
        // Initialize components với container IDs cụ thể
        this.chatHeader = new ChatHeader('chat-header');
        this.messageList = new MessageList('message-list');
        this.inputBar = new InputBar('input-bar', this.handleSendMessage.bind(this));
    }

    init() {
        console.log('🚀 Initializing ChatApp...');
        
        // Render container trước
        this.renderContainer();
        
        // Liên kết với search bar
        this.connectToSearchBar();
        
        // Sau đó initialize các components
        setTimeout(() => {
            this.chatHeader.render();
            this.messageList.render();
            this.inputBar.render();

            // Add welcome message
            setTimeout(() => {
                this.addBotMessage("Hello! I'm UniFAQ Assistant. How can I help you today?");
            }, 500);
        }, 100);
    }

    renderContainer() {
        this.container.innerHTML = `
            <div class="chat-app ${this.isOpen ? 'chat-app--open' : 'chat-app--closed'}">
                <div id="chat-header"></div>
                <div id="message-list"></div>
                <div id="input-bar"></div>
            </div>
            <button class="chat-toggle" id="chat-toggle">
                <i class="fas fa-comments"></i>
                <span class="chat-toggle__badge" id="chat-notification" style="display: none;">!</span>
            </button>
        `;

        this.attachToggleEvent();
    }

    connectToSearchBar() {
        const searchInput = document.querySelector('.header__search-input');
        const searchButton = document.querySelector('.header__search-btn');

        if (searchInput && searchButton) {
            // Xử lý khi click search button
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.sendSearchQuery(query);
                }
            });

            // Xử lý khi press Enter trong search input
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.sendSearchQuery(query);
                    }
                }
            });

            console.log('✅ Search bar connected to chat');
        } else {
            console.warn('⚠️ Search bar elements not found');
        }
    }

    sendSearchQuery(query) {
        // Mở chat window nếu đang đóng
        if (!this.isOpen) {
            this.openChat();
        }

        // Thêm query vào chat input
        const chatInput = document.querySelector('.input-bar__input');
        if (chatInput) {
            chatInput.value = query;
            chatInput.focus();
        }

        // Tự động gửi message sau 1 giây
        setTimeout(() => {
            this.handleSendMessage(query);
        }, 1000);

        console.log('🔍 Search query sent to chat:', query);
    }

    openChat() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.renderContainer();
            
            setTimeout(() => {
                this.chatHeader.render();
                this.messageList.render();
                this.inputBar.render();
                this.inputBar.focus();
            }, 50);
        }
    }

    closeChat() {
        if (this.isOpen) {
            this.isOpen = false;
            this.renderContainer();
        }
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    showNotification() {
        const notification = document.getElementById('chat-notification');
        if (notification) {
            notification.style.display = 'block';
        }
    }

    hideNotification() {
        const notification = document.getElementById('chat-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }

    attachToggleEvent() {
        const toggleBtn = document.getElementById('chat-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleChat();
                this.hideNotification();
            });
        }

        // Thêm close button functionality trong header
        setTimeout(() => {
            const closeBtn = document.querySelector('.chat-header__btn:last-child');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeChat();
                });
            }

            const minimizeBtn = document.querySelector('.chat-header__btn:first-child');
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => {
                    this.closeChat();
                });
            }
        }, 100);
    }

    handleSendMessage(message) {
        if (!message.trim()) return;

        // Add user message
        this.messageList.addMessage(message, true);

        // Simulate bot response
        this.inputBar.setLoading(true);
        
        setTimeout(() => {
            this.inputBar.setLoading(false);
            this.addBotMessage(this.generateResponse(message));
        }, 1000 + Math.random() * 2000);
    }

    addBotMessage(text) {
        this.messageList.addMessage(text, false);
        
        // Hiển thị notification nếu chat đang đóng
        if (!this.isOpen) {
            this.showNotification();
        }
    }

    generateResponse(userMessage) {
        const responses = [
            "I understand you're asking about: " + userMessage + ". Let me check our knowledge base for you.",
            "That's a great question! Based on our FAQs, I can help you with that.",
            "I found some relevant information for you. Would you like me to search for more details?",
            "Our records show several related questions. Let me summarize the key points for you.",
            "I can assist with that! Here's what I know from our university database."
        ];

        // Simple keyword matching for more contextual responses
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('office hour') || lowerMessage.includes('office time')) {
            return "Office hours are typically Monday to Friday, 9 AM to 5 PM. Specific professors may have different schedules posted on their office doors.";
        } else if (lowerMessage.includes('password') || lowerMessage.includes('reset')) {
            return "You can reset your password through the IT portal or by contacting the IT help desk at support@university.edu.";
        } else if (lowerMessage.includes('admission') || lowerMessage.includes('apply')) {
            return "Fall admissions deadlines are June 1 for early decision and August 15 for regular admission. You can apply through our online portal.";
        } else if (lowerMessage.includes('library') || lowerMessage.includes('book')) {
            return "The main library is open Monday-Thursday 8AM-10PM, Friday 8AM-6PM, Saturday 10AM-6PM, and Sunday 12PM-8PM.";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
            return "You can contact us at:\n📧 support@university.edu\n📞 (555) 123-4567\n📍 Student Services Building, Room 101";
        } else if (lowerMessage.includes('deadline') || lowerMessage.includes('due')) {
            return "Important deadlines:\n• Fall Registration: August 15\n• Spring Registration: January 10\n• Add/Drop Period: First week of semester";
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Method để gọi từ bên ngoài
    sendMessageFromExternal(text) {
        this.openChat();
        setTimeout(() => {
            this.handleSendMessage(text);
        }, 500);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatApp;
}