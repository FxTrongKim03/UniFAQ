// components/ChatApp.js
class ChatApp {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ ChatApp container not found:', containerId);
            return;
        }

        this.Gemini_API_Key = 'AIzaSyAKjJyQ4P8PslMaCWwqkm4BSjHtKNpWw'; // Lấy API key từ biến toàn cục nếu có
        
        this.isOpen = false;
        
        // Khởi tạo các components con
        this.chatHeader = new ChatHeader('chat-header');
        this.messageList = new MessageList('message-list');
        this.inputBar = new InputBar('input-bar', this.handleSendMessage.bind(this));
        
        this.faqClickListenerAdded = false; // Thêm cờ
    }

    init() {
        console.log('🚀 Initializing ChatApp...');
        this.render();
        this.connectToSearchBar();

        // Tải FAQs ngay khi khởi tạo
        window.useFaqData.loadFaqs(); 

        setTimeout(() => {
            this.addBotMessage("Hello! I'm UniFAQ Assistant. How can I help you today?");
        }, 500);
    }

    render() {
        // Render cấu trúc HTML chính của chat app
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
        
        // Nếu cửa sổ chat đang mở, render các component con
        if (this.isOpen) {
            this.chatHeader.render();
            this.messageList.render();
            this.inputBar.render();
            this.inputBar.focus();
        }

        // Gắn sự kiện cho các nút
        this.attachEvents();
    }

    attachEvents() {
        const toggleBtn = document.getElementById('chat-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleChat();
                this.hideNotification();
            });
        }

        // Chỉ gắn sự kiện đóng khi cửa sổ chat đang mở
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
        
        // Thêm listener để xử lý click vào câu hỏi FAQ (chỉ 1 lần)
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

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.render(); // Re-render để cập nhật class và các components con
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

    // --- BẮT ĐẦU HÀM QUAN TRỌNG (VỚI GỠ LỖI) ---
    async handleSendMessage(message) {
    if (!message.trim()) return;
    this.messageList.addMessage(message, true); 
    this.inputBar.setLoading(true);

    const allFaqs = await window.useFaqData.getFaqs();
    const normalize = window.useFaqSearch.normalizeText; 
    const normalizedMessage = normalize(message);

    const exactMatch = allFaqs.find(f => normalize(f.question) === normalizedMessage); //

    if (exactMatch) {
        console.log('✅ Tìm thấy KẾT QUẢ CHÍNH XÁC:', exactMatch);
        setTimeout(() => {
            this.inputBar.setLoading(false);
            this.addBotMessage(exactMatch.answer); //
        }, 800);
    } else {
        console.log('ℹ️ Không khớp chính xác. Thử tìm bằng từ khóa...');
        const topFaqs = window.useFaqSearch.findTopFaqs(message, allFaqs, 3);

        // --- SỬA ĐỔI CHỖ NÀY ---
        // Chúng ta cần biến hàm setTimeout bên trong thành async
        setTimeout(async () => { 
            if (topFaqs.length > 0) {
                this.inputBar.setLoading(false);
                this.messageList.addMessage({ type: 'faqList', faqs: topFaqs }, false);
            } else {
                console.log('❌ Tìm từ khóa thất bại. Gọi Gemini AI...');
                // Không gọi generateFallbackResponse nữa
                // Thay vào đó, gọi hàm mới callGeminiAPI
                await this.callGeminiAPI(message); 
            }
        }, 1200);
        // --- KẾT THÚC SỬA ĐỔI ---
    }
}
    // --- KẾT THÚC HÀM QUAN TRỌNG ---

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

    // Hàm dự phòng
    async callGeminiAPI(userMessage) {
    // Bật loading
    this.inputBar.setLoading(true); 
    
    // --- SỬA LỖI URL VÀ MÔ HÌNH ---
    const MODEL_NAME = 'gemini-1.5-flash-latest'; // Sử dụng mô hình mới nhất
    const API_VERSION = 'v1'; // Sử dụng v1, KHÔNG DÙNG v1beta
    
    const API_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${this.GEMINI_API_KEY}`;
    // --- KẾT THÚC SỬA LỖI ---
    
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
            throw new Error(data.error?.message || `API request failed with status ${response.status}`);
        }
        
        // Kiểm tra xem có nội dung trả về không
        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            console.error('Lỗi API: Không có nội dung trả về', data);
            throw new Error("AI không trả về nội dung.");
        }

        const geminiResponse = data.candidates[0].content.parts[0].text;
        this.addBotMessage(geminiResponse);

    } catch (error) {
        console.error('❌ Lỗi gọi Gemini API:', error);
        this.addBotMessage("Tôi gặp sự cố khi kết nối với trợ lý AI. " + error.message);
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