// components/ChatPresenter.js
class ChatPresenter {
    // Nhận containerId và các callbacks/dữ liệu từ Container
    constructor(containerId, { initialState, callbacks }) {
        this.containerElement = document.getElementById(containerId);
        if (!this.containerElement) {
            console.error('❌ ChatPresenter container element not found:', containerId);
            return;
        }

        this.initialState = initialState; // Lưu state ban đầu
        this.callbacks = callbacks;       // Lưu các hàm callback

        // Presenter quản lý các instance UI con
        this.chatHeader = null;
        this.messageList = null;
        this.inputBar = null;

        // Cờ trạng thái để tránh gắn listener nhiều lần
        this.listenersAttached = {
            toggleButton: false,
            headerButtons: false,
            faqClick: false
        };

        this._setupInitialDOM(); // Tạo cấu trúc DOM cơ bản
    }

    _setupInitialDOM() {
        // Tạo cấu trúc HTML tĩnh
        this.containerElement.innerHTML = `
            <div
                class="chat-app ${this.initialState.isOpen ? 'chat-app--open' : 'chat-app--closed'}"
                style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; width: 380px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden;"
            >
                <div id="chat-header"></div>
                <div id="message-list" style="flex: 1; overflow: hidden;"></div>
                <div id="input-bar"></div>
            </div>
            <button class="chat-toggle" id="chat-toggle" style="position: fixed; bottom: 20px; right: 20px; z-index: 999; width: 60px; height: 60px; border-radius: 50%; border: none; background: linear-gradient(135deg, #4b6cb7, #182848); color: white; font-size: 24px; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-comments"></i>
                <span class="chat-toggle__badge" id="chat-notification" style="display: none; position: absolute; top: -5px; right: -5px; background: #ff7a18; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; font-weight: bold; line-height: 20px; text-align: center;">!</span>
            </button>
        `;

        // Khởi tạo các UI component con
        this.chatHeader = new ChatHeader('chat-header');
        this.messageList = new MessageList('message-list');
        // Truyền callbacks từ Container xuống InputBar
        this.inputBar = new InputBar('input-bar', this.callbacks.onSendMessage, this.callbacks.onSearchSuggestions);

        this._attachStaticListeners(); // Gắn các listener không đổi
    }

     _attachStaticListeners() {
        // Nút Toggle
        const toggleBtn = document.getElementById('chat-toggle');
        if (toggleBtn && !this.listenersAttached.toggleButton) {
             toggleBtn.addEventListener('click', () => {
                 this.callbacks.onToggleChat();
                 this.hideNotification(); // Presenter tự xử lý UI này
             });
             this.listenersAttached.toggleButton = true;
        }

        // Click vào FAQ item trong container
        if (!this.listenersAttached.faqClick) {
            this.containerElement.addEventListener('click', (e) => {
                const faqItem = e.target.closest('.message__faq-item');
                if (faqItem && faqItem.dataset.question) {
                    e.preventDefault();
                    this.callbacks.onFaqItemClick(faqItem.dataset.question);
                }
            });
            this.listenersAttached.faqClick = true;
        }
     }

    // Hàm render được gọi bởi Container
    render({ isOpen, messages, isLoading }) {
        const chatAppDiv = this.containerElement.querySelector('.chat-app');
        if (!chatAppDiv) return;

        // Cập nhật class open/closed
        chatAppDiv.classList.toggle('chat-app--open', isOpen);
        chatAppDiv.classList.toggle('chat-app--closed', !isOpen);

        if (isOpen) {
            // Render Header (chỉ render 1 lần khi mở)
            if (!this.chatHeaderRendered) {
                this.chatHeader.render();
                this._attachHeaderListeners(); // Gắn listener nút close/minimize
                this.chatHeaderRendered = true;
            }

            // Cập nhật và render MessageList
            this.messageList.messages = messages;
            this.messageList.render();
            this.messageList.scrollToBottom();

            // Render InputBar (chỉ render 1 lần khi mở) và cập nhật loading
            if (!this.inputBarRendered) {
                 this.inputBar.render();
                 this.inputBarRendered = true;
            }
            this.inputBar.setLoading(isLoading);
            this.inputBar.focus();

        } else {
             // Reset cờ render khi đóng để render lại khi mở lần sau
             this.chatHeaderRendered = false;
             this.inputBarRendered = false;
             this.listenersAttached.headerButtons = false; // Cho phép gắn lại listener
        }
    }

     _attachHeaderListeners() {
         if (this.listenersAttached.headerButtons) return;

         const closeBtn = this.containerElement.querySelector('.chat-header__actions .chat-header__btn:last-child');
         if (closeBtn) {
             closeBtn.addEventListener('click', this.callbacks.onCloseChat);
         }
         const minimizeBtn = this.containerElement.querySelector('.chat-header__actions .chat-header__btn:first-child');
          if (minimizeBtn) {
             minimizeBtn.addEventListener('click', this.callbacks.onCloseChat);
         }
         this.listenersAttached.headerButtons = true;
     }

    // Các hàm cập nhật UI con (được gọi bởi Container)
    renderSuggestions(faqs) {
        if (this.inputBar) this.inputBar.renderSuggestions(faqs);
    }
    clearSuggestions() {
        if (this.inputBar) this.inputBar.clearSuggestions();
    }
    showNotification() {
        const notification = document.getElementById('chat-notification');
        if (notification) notification.style.display = 'block';
    }
    hideNotification() {
        const notification = document.getElementById('chat-notification');
        if (notification) notification.style.display = 'none';
    }
}