// components/ChatApp.js
class ChatApp {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ ChatApp container not found:', containerId);
            return;
        }

        // -----------------------------------------------------------------
        // CẢNH BÁO BẢO MẬT NGHIÊM TRỌNG (SECURITY WARNING) ⚠️
        // -----------------------------------------------------------------
        // Key này chỉ dùng để *thử nghiệm* và sẽ bị lộ ngay lập tức.
        // Hãy tạo backend để gọi API an toàn.
        // -----------------------------------------------------------------
        this.GEMINI_API_KEY = 'AIzaSyAPHtchMSvtKiJ4HAB8odibdBSQWU6mNsc'; // <-- LỖ HỔNG BẢO MẬT

        this.isOpen = false;
        
        // Khởi tạo các components con
        this.chatHeader = new ChatHeader('chat-header');
        this.messageList = new MessageList('message-list');
        
        // --- ĐÃ SỬA: Truyền thêm callback mới ---
        this.inputBar = new InputBar(
            'input-bar', 
            this.handleSendMessage.bind(this),
            this.handleSearchSuggestions.bind(this) // Truyền hàm xử lý gợi ý
        );
        
        this.faqClickListenerAdded = false;
    }

    init() {
        console.log('🚀 Initializing ChatApp...');
        this.render();
        this.connectToSearchBar();
        window.useFaqData.loadFaqs(); 
        setTimeout(() => {
            this.addBotMessage("Hello! I'm UniFAQ Assistant. How can I help you today?");
        }, 500);
    }

    render() {
        // (Hàm render giữ nguyên như cũ)
        this.container.innerHTML = `
            <div 
                class="chat-app ${this.isOpen ? 'chat-app--open' : 'chat-app--closed'}"
                style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; width: 380px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden;"
            >
                <div id="chat-header"></div>
                <div id="message-list" style="flex: 1; overflow: hidden;"></div>
                <div id="input-bar"></div>
            </div>
            <button 
                class="chat-toggle" 
                id="chat-toggle"
                style="position: fixed; bottom: 20px; right: 20px; z-index: 999; width: 60px; height: 60px; border-radius: 50%; border: none; background: linear-gradient(135deg, #4b6cb7, #182848); color: white; font-size: 24px; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;"
            >
                <i class="fas fa-comments"></i>
                <span class="chat-toggle__badge" id="chat-notification" style="display: none; position: absolute; top: -5px; right: -5px; background: #ff7a18; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; font-weight: bold; line-height: 20px; text-align: center;">!</span>
            </button>
        `;
        
        if (this.isOpen) {
            this.chatHeader.render();
            this.messageList.render();
            this.inputBar.render();
            this.inputBar.focus();
        }
        this.attachEvents();
    }

    attachEvents() {
        // (Hàm attachEvents giữ nguyên phần lớn)
        const toggleBtn = document.getElementById('chat-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleChat();
                this.hideNotification();
            });
        }
        
        if (this.isOpen) {
            const closeBtn = document.querySelector('.chat-header__actions .chat-header__btn:last-child');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeChat());
            }
            const minimizeBtn = document.querySelector('.chat-header__actions .chat-header__btn:first-child');
             if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => this.closeChat());
            }
        }
        
        // (Listener này vẫn cần cho các câu hỏi gợi ý TRONG LỊCH SỬ CHAT)
        if (!this.faqClickListenerAdded) {
            this.container.addEventListener('click', (e) => {
                const faqItem = e.target.closest('.message__faq-item');
                if (faqItem && faqItem.dataset.question) {
                    e.preventDefault();
                    this.handleSendMessage(faqItem.dataset.question);
                }
            });
            this.faqClickListenerAdded = true;
        }
    }
    
    // (Các hàm toggleChat, openChat, closeChat, connectToSearchBar giữ nguyên)
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.render();
    }
    openChat() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.render();
        }
    }
    closeChat() {
        if (this.isOpen) {
            this.isOpen = false;
            this.render();
        }
    }
    connectToSearchBar() {
        const searchInput = document.querySelector('.header__search-input');
        const searchButton = document.querySelector('.header__search-btn');
        if (searchInput && searchButton) {
            const sendQuery = () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.openChat();
                    setTimeout(() => this.handleSendMessage(query), 200);
                    searchInput.value = '';
                }
            };
            searchButton.addEventListener('click', sendQuery);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendQuery();
            });
            console.log('✅ Search bar connected to chat');
        }
    }
    // --- HẾT PHẦN GIỮ NGUYÊN ---

    // --- MỚI: Hàm xử lý tìm kiếm gợi ý ---
    async handleSearchSuggestions(query) {
        if (query.length < 3) {
            this.inputBar.clearSuggestions();
            return;
        }
        
        const allFaqs = await window.useFaqData.getFaqs();
        // Lấy 3 câu hỏi khớp nhất từ hook
        const topFaqs = window.useFaqSearch.findTopFaqs(query, allFaqs, 3);
        
        // Gọi hàm render mới của InputBar
        this.inputBar.renderSuggestions(topFaqs);
    }

    // --- ĐÃ SỬA: Logic của handleSendMessage ---
    async handleSendMessage(message) {
        if (!message.trim()) return;
        
        // Xóa gợi ý (nếu còn)
        this.inputBar.clearSuggestions();
        
        this.messageList.addMessage(message, true); 
        this.inputBar.setLoading(true);

        const allFaqs = await window.useFaqData.getFaqs();
        const normalize = window.useFaqSearch.normalizeText;
        const normalizedMessage = normalize(message);

        // 1. Kiểm tra khớp chính xác
        const exactMatch = allFaqs.find(f => normalize(f.question) === normalizedMessage); 

        if (exactMatch) {
            console.log('✅ Tìm thấy KẾT QUẢ CHÍNH XÁC:', exactMatch);
            setTimeout(() => {
                this.inputBar.setLoading(false);
                this.addBotMessage(exactMatch.answer); 
            }, 800);
        } else {
            // 2. KHÔNG KHỚP: Gọi thẳng Gemini
            // Logic hiển thị 3 câu hỏi đã được chuyển sang handleSearchSuggestions
            console.log('ℹ️ Không khớp chính xác. Gọi Gemini AI...');
            
            setTimeout(async () => {
                 await this.callGeminiAPI(message); 
            }, 1000); // Có thể giảm thời gian chờ
        }
    }

    addBotMessage(textOrData) {
        this.messageList.addMessage(textOrData, false);
        if (!this.isOpen) this.showNotification();
    }
    
    showNotification() {
        const notification = document.getElementById('chat-notification');
        if (notification) notification.style.display = 'block';
    }

    hideNotification() {
        const notification = document.getElementById('chat-notification');
        if (notification) notification.style.display = 'none';
    }

    // Hàm gọi Gemini (giữ nguyên)
    async callGeminiAPI(userMessage) {
        this.inputBar.setLoading(true); 
        
        const MODEL_NAME = 'gemini-2.5-pro'; 
        const API_VERSION = 'v1beta'; 
        const API_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${this.GEMINI_API_KEY}`;
        
        const prompt = `Bạn là trợ lý ảo cho một trường đại học tên là UniFAQ. 
                       Người dùng đã hỏi một câu nhưng không tìm thấy trong cơ sở dữ liệu FAQ. 
                       Hãy trả lời câu hỏi của họ một cách ngắn gọn, hữu ích.
                       Câu hỏi của người dùng: "${userMessage}"`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt 
                }]
            }]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json(); 

            if (!response.ok) {
                console.error('Lỗi API! Chi tiết từ Google:', data); 
                const errorMessage = data.error?.message || `API request failed with status ${response.status}`;
                throw new Error(errorMessage);
            }
            
            if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
                console.error('Lỗi API: Không có nội dung trả về', data);
                throw new Error("AI không trả về nội dung.");
            }

            const geminiResponse = data.candidates[0].content.parts[0].text;
            this.addBotMessage(geminiResponse);

        } catch (error) {
            console.error('❌ Lỗi gọi Gemini API:', error);
            this.addBotMessage("Tôi gặp sự cố khi kết nối với trợ lý AI. (Lỗi: " + error.message + ")");
        } finally {
            this.inputBar.setLoading(false); 
        }
    }

    sendMessageFromExternal(text) {
        this.openChat();
        setTimeout(() => {
            this.handleSendMessage(text);
        }, 500);
    }
}