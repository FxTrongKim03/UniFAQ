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
        console.log('🔄 Starting FAQ fetch...');
        this.setLoading(true);
        this.error = null;
        
        try {
            console.log('📡 Fetching from: ./faqs.json');
            const response = await fetch('./faqs.json');
            console.log('📡 Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Raw data received:', data);
            
            // VALIDATION QUAN TRỌNG - Kiểm tra cấu trúc data
            if (!data || !data.faqs) {
                throw new Error('Invalid data structure: missing "faqs" property');
            }
            
            this.faqs = data.faqs;
            console.log('📊 FAQs loaded:', this.faqs.length);
            
            if (this.faqs.length === 0) {
                console.log('ℹ️ No FAQs found in data');
            }
            
            this.render();
            
        } catch (error) {
            console.error('❌ Fetch failed:', error);
            this.error = error.message;
            this.renderError();
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        if (loading) {
            console.log('🔄 Setting loading state: true');
        } else {
            console.log('🔄 Setting loading state: false');
        }
    }

    render() {
        console.log('🎨 Rendering...', {
            isLoading: this.isLoading,
            error: this.error,
            faqsCount: this.faqs.length
        });

        if (this.isLoading) {
            console.log('🎨 Rendering LOADING state');
            this.renderLoading();
            return;
        }

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
                <p>${this.faqs.length} questions available</p>
            </div>
            <div class="faq-list">
                ${faqsHTML}
            </div>
        `;
        
        console.log('✅ FAQ rendering completed');
    }

    // Helper function to prevent XSS
    escapeHtml(unsafe) {
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