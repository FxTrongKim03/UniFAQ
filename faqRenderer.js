class FAQRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ Container not found:', containerId);
            return;
        }
        console.log('✅ FAQ Renderer initialized for:', containerId);
        this.faqs = [];
        this.isLoading = false;
        this.error = null;
    }

    async fetchFAQs() {
        console.log('🔄 [FAQRenderer] Starting fetch from API...');
        this.error = null;
        this.setLoading(true);

        try {
            const apiUrl = 'http://localhost:3001/api/faqs'; // URL backend
            console.log(`📡 [FAQRenderer] Fetching from: ${apiUrl}`);
            const response = await fetch(apiUrl);
            console.log('📡 [FAQRenderer] Response status:', response.status);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log('✅ [FAQRenderer] Data received from API:', data);

            if (!Array.isArray(data)) throw new Error('API did not return an array');

            const sortedFaqs = data.sort((a, b) => b.votes - a.votes);
            this.faqs = sortedFaqs.slice(0, 5); // Lấy top 10

            console.log(`📊 [FAQRenderer] Filtered top ${this.faqs.length} FAQs from API.`);

        } catch (error) {
            console.error('❌ [FAQRenderer] Fetch API failed:', error);
            this.error = error.message;
        } finally {
            this.setLoading(false); // Sẽ gọi render()
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        if (loading) {
            console.log('🔄 Setting loading state: true');
        } else {
            console.log('🔄 Setting loading state: false');
        }
        
        // --- THAY ĐỔI QUAN TRỌNG ---
        // Gọi render() MỖI KHI trạng thái loading thay đổi
        this.render();
        // --- KẾT THÚC THAY ĐỔI ---
    }

    render() {
        console.log('🎨 Rendering...', {
            isLoading: this.isLoading,
            error: this.error,
            faqsCount: this.faqs.length
        });

        // Khi setLoading(true) gọi render(), nó sẽ vào đây
        if (this.isLoading) {
            console.log('🎨 Rendering LOADING state');
            this.renderLoading();
            return;
        }

        // Khi setLoading(false) gọi render() (lần 2),
        // isLoading sẽ là false, và nó sẽ tiếp tục xuống đây:

        if (this.error) {
            console.log('🎨 Rendering ERROR state:', this.error);
            this.renderError();
            return;
        }

        if (this.faqs.length === 0) {
            console.log('🎨 Rendering EMPTY state');
            this.renderEmpty();
            return;
        }

        console.log('🎨 Rendering FAQS state with', this.faqs.length, 'items');
        this.renderFAQs();
    }

    renderLoading() {
        this.container.innerHTML = `
            <div class="faq-loading">
                <div class="loading-spinner"></div>
                <p>Loading FAQs...</p>
            </div>
        `;
    }

    renderError() {
        this.container.innerHTML = `
            <div class="faq-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to Load FAQs</h3>
                <p>${this.error}</p>
                <button class="retry-btn">Try Again</button>
            </div>
        `;
        
        // Add event listener
        const retryBtn = this.container.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.fetchFAQs();
            });
        }
    }

    renderEmpty() {
        this.container.innerHTML = `
            <div class="faq-empty">
                <i class="fas fa-inbox"></i>
                <h3>No FAQs Available</h3>
                <p>Check back later for frequently asked questions.</p>
            </div>
        `;
    }

    renderFAQs() {
        console.log('🎨 Actually rendering FAQ items...');
        
        const faqsHTML = this.faqs.map(faq => `
            <div class="faq-item" data-category="${faq.category}">
                <div class="faq-question">
                    <h3>${this.escapeHtml(faq.question)}</h3>
                    <span class="faq-votes">${faq.votes} votes</span>
                </div>
                <div class="faq-answer">
                    <p>${this.escapeHtml(faq.answer)}</p>
                </div>
                <div class="faq-meta">
                    <span class="faq-category">${this.escapeHtml(faq.category)}</span>
                </div>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="faq-header">
                <h2>Frequently Asked Questions</h2>
                <p>Top ${this.faqs.length} questions available</p> 
            </div>
            <div class="faq-list">
                ${faqsHTML}
            </div>
        `;
        
        console.log('✅ FAQ rendering completed');
    }

    // Helper function to prevent XSS
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
    module.exports = FAQRenderer;
}   