// components/ChatContainer.js
class ChatContainer {
    constructor(containerId) {
        this.containerId = containerId;
        this.GEMINI_API_KEY = 'AIzaSyAPHtchMSvtKiJ4HAB8odibdBSQWU6mNsc'; // <-- LỖ HỔNG BẢO MẬT

        this.state = {
            isOpen: false,
            messages: [],
            isLoading: false,
        };

        // Khởi tạo Presenter và truyền state ban đầu + callbacks đã bind
        this.presenter = new ChatPresenter(containerId, {
            initialState: this.state,
            callbacks: {
                onToggleChat: this.toggleChat.bind(this),
                onCloseChat: this.closeChat.bind(this),
                onSendMessage: this.handleSendMessage.bind(this),
                onSearchSuggestions: this.handleSearchSuggestions.bind(this),
                onFaqItemClick: this.handleFaqItemClick.bind(this)
            }
        });
    }

    // Hàm cập nhật state và gọi render của Presenter
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.presenter.render(this.state); // Yêu cầu Presenter render lại
    }

    init() {
        console.log('🚀 Initializing ChatContainer...');
        // Presenter đã tự render DOM ban đầu, không cần gọi render ở đây
        this.connectToSearchBar();
        window.useFaqData.loadFaqs(); // Vẫn dùng hook global để load data
        setTimeout(() => {
            this.addBotMessage("Hello! I'm UniFAQ Assistant. How can I help you today?");
        }, 500);
    }

    // --- Logic xử lý sự kiện (được gọi bởi Presenter callbacks) ---
    toggleChat() {
        this.setState({ isOpen: !this.state.isOpen });
    }
    openChat() {
        if (!this.state.isOpen) this.setState({ isOpen: true });
    }
    closeChat() {
        if (this.state.isOpen) this.setState({ isOpen: false });
    }
    handleFaqItemClick(question) {
        this.handleSendMessage(question);
    }

    // Hàm thêm tin nhắn vào state
    addMessage(content, isUser = false) {
        const newMessage = { id: Date.now() + Math.random(), content, isUser, timestamp: new Date() };
        // Cập nhật state messages (tạo mảng mới)
        this.setState({ messages: [...this.state.messages, newMessage] });

        if (!isUser && !this.state.isOpen) {
            this.presenter.showNotification(); // Yêu cầu Presenter hiển thị UI
        }
    }
    addBotMessage(textOrData) {
        this.addMessage(textOrData, false);
    }

    // Logic tìm kiếm gợi ý
    async handleSearchSuggestions(query) {
        if (query.length < 3) {
            this.presenter.clearSuggestions();
            return;
        }
        try {
            const allFaqs = await window.useFaqData.getFaqs(); // Lấy data từ hook
            const topFaqs = window.useFaqSearch.findTopFaqs(query, allFaqs, 3); // Xử lý logic tìm kiếm
            this.presenter.renderSuggestions(topFaqs); // Yêu cầu Presenter hiển thị
        } catch (error) {
            console.error("Error fetching FAQs for suggestions:", error);
            this.presenter.clearSuggestions();
        }
    }

    // Logic gửi tin nhắn
    async handleSendMessage(message) {
        if (!message.trim()) return;

        this.presenter.clearSuggestions();
        this.addMessage(message, true); // Thêm tin nhắn user vào state
        this.setState({ isLoading: true }); // Bật loading

        try {
            const allFaqs = await window.useFaqData.getFaqs();
            const normalize = window.useFaqSearch.normalizeText;
            const normalizedMessage = normalize(message);
            const exactMatch = allFaqs.find(f => normalize(f.question) === normalizedMessage);

            if (exactMatch) {
                console.log('✅ Found exact match:', exactMatch);
                setTimeout(() => {
                    this.addBotMessage(exactMatch.answer);
                    this.setState({ isLoading: false });
                }, 800);
            } else {
                console.log('ℹ️ No exact match. Calling Gemini AI...');
                await this.callGeminiAPI(message); // Gọi API (sẽ tự tắt loading trong finally)
            }
        } catch (error) {
             console.error("Error handling message:", error);
             this.addBotMessage("Sorry, I encountered an error processing your request.");
             this.setState({ isLoading: false }); // Tắt loading nếu có lỗi ở đây
        }
    }

    // Logic gọi Gemini API
    async callGeminiAPI(userMessage) { // <--- userMessage is used here
        if (!this.state.isLoading) this.setState({ isLoading: true });

        const MODEL_NAME = 'gemini-2.5-flash';
        const API_VERSION = 'v1beta';
        const API_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${this.GEMINI_API_KEY}`;

        // --- FIX: Include userMessage in the prompt ---
        const prompt = `Bạn là trợ lý ảo cho một trường đại học tên là UniFAQ.
                       Người dùng đã hỏi một câu nhưng không tìm thấy trong cơ sở dữ liệu FAQ.
                       Hãy trả lời câu hỏi của họ một cách ngắn gọn, hữu ích.
                       Câu hỏi của người dùng: "${userMessage}"`; // <-- Use userMessage here

        const requestBody = { // <-- requestBody is used below
            contents: [{ parts: [{ text: prompt }] }]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // --- FIX: Add requestBody to the fetch body ---
                body: JSON.stringify(requestBody), // <-- Use requestBody here
            });
            const data = await response.json();

            // ... (rest of the try block remains the same) ...
             if (!response.ok) { throw new Error(data.error?.message || `API Error ${response.status}`);}
             if (!data.candidates?.[0]?.content?.parts?.[0]?.text) { throw new Error("AI response empty.");}
             const geminiResponse = data.candidates[0].content.parts[0].text;
             this.addBotMessage(geminiResponse);

        } catch (error) {
            console.error('❌ Error calling Gemini API:', error);
            this.addBotMessage("Error connecting to AI assistant. (" + error.message + ")");
        } finally {
            this.setState({ isLoading: false });
        }
    }

    // --- Các hàm tiện ích khác ---
    connectToSearchBar() {
        // ... (Giữ nguyên logic kết nối search bar) ...
         const searchInput = document.querySelector('.header__search-input');
         const searchButton = document.querySelector('.header__search-btn');
         if (searchInput && searchButton) {
             const sendQuery = () => {
                 const query = searchInput.value.trim();
                 if (query) {
                     this.openChat();
                     setTimeout(() => this.handleSendMessage(query), 300); // Tăng nhẹ delay
                     searchInput.value = '';
                 }
             };
             searchButton.addEventListener('click', sendQuery);
             searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendQuery(); });
             console.log('✅ Search bar connected to ChatContainer');
         }
    }

     // Hàm để gọi từ bên ngoài
     sendMessageFromExternal(text) {
        this.openChat();
        setTimeout(() => this.handleSendMessage(text), 300);
    }
}