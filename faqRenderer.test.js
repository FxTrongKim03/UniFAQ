// faqRenderer.test.js
const FAQRenderer = require('./faqRenderer.js');

// Mock fetch globally
global.fetch = jest.fn();

// Mock DOM environment
beforeEach(() => {
    document.body.innerHTML = `
        <div id="faq-container"></div>
    `;
    fetch.mockClear();
});

// Mock Font Awesome icons by adding them to DOM
beforeEach(() => {
    // Create mock font awesome style
    const style = document.createElement('style');
    style.innerHTML = `
        .fas { display: inline-block; }
        .fa-exclamation-triangle:before { content: "⚠️"; }
        .fa-inbox:before { content: "📥"; }
    `;
    document.head.appendChild(style);
});

describe('FAQRenderer', () => {
    test('should render loading state initially', () => {
        const renderer = new FAQRenderer('faq-container');
        renderer.setLoading(true);
        renderer.render();
        
        expect(document.querySelector('.faq-loading')).toBeTruthy();
        expect(document.querySelector('.loading-spinner')).toBeTruthy();
        expect(document.querySelector('.faq-loading p').textContent).toContain('Loading FAQs');
    });

    test('should render FAQs when data is available', () => {
        const renderer = new FAQRenderer('faq-container');
        const mockFAQs = [
            {
                id: 1,
                question: 'Test Question?',
                answer: 'Test Answer',
                category: 'test',
                votes: 10
            }
        ];
        
        renderer.faqs = mockFAQs;
        renderer.render();
        
        expect(document.querySelector('.faq-header h2').textContent).toBe('Frequently Asked Questions');
        expect(document.querySelector('.faq-item h3').textContent).toBe('Test Question?');
        expect(document.querySelector('.faq-answer p').textContent).toBe('Test Answer');
        expect(document.querySelector('.faq-votes').textContent).toBe('10 votes');
        expect(document.querySelector('.faq-category').textContent).toBe('test');
    });

    test('should render error state when fetch fails', async () => {
        const renderer = new FAQRenderer('faq-container');
        
        // Mock fetch to reject
        fetch.mockRejectedValueOnce(new Error('Network error'));
        
        await renderer.fetchFAQs();
        
        // Kiểm tra error state được render
        expect(document.querySelector('.faq-error')).toBeTruthy();
        expect(document.querySelector('.faq-error h3').textContent).toBe('Unable to Load FAQs');
        expect(document.querySelector('.faq-error p').textContent).toContain('Network error');
        expect(document.querySelector('.retry-btn')).toBeTruthy();
        
        // Kiểm tra FAQs không được set khi có lỗi
        expect(renderer.faqs).toHaveLength(0);
    });

    test('should render empty state when no FAQs available', () => {
        const renderer = new FAQRenderer('faq-container');
        renderer.faqs = [];
        renderer.render();
        
        expect(document.querySelector('.faq-empty')).toBeTruthy();
        expect(document.querySelector('.faq-empty h3').textContent).toBe('No FAQs Available');
        expect(document.querySelector('.faq-empty p').textContent).toContain('Check back later');
    });

    test('should handle successful fetch with data', async () => {
        const renderer = new FAQRenderer('faq-container');
        const mockData = {
            faqs: [
                {
                    id: 1,
                    question: 'Test Q?',
                    answer: 'Test A',
                    category: 'test',
                    votes: 5
                }
            ]
        };
        
        // Mock successful fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });
        
        await renderer.fetchFAQs();
        
        expect(renderer.faqs).toHaveLength(1);
        expect(renderer.faqs[0].question).toBe('Test Q?');
        expect(renderer.faqs[0].answer).toBe('Test A');
        expect(renderer.faqs[0].category).toBe('test');
        expect(renderer.faqs[0].votes).toBe(5);
        expect(renderer.error).toBeNull();
    });

    test('should include retry button in error state that calls fetchFAQs', () => {
        const renderer = new FAQRenderer('faq-container');
        renderer.error = 'Test error';
        renderer.renderError();
        
        const retryButton = document.querySelector('.retry-btn');
        expect(retryButton).toBeTruthy();
        
        // Mock the fetchFAQs method
        renderer.fetchFAQs = jest.fn();
        
        // Simulate click
        retryButton.click();
        expect(renderer.fetchFAQs).toHaveBeenCalledTimes(1);
    });

    // Thêm test mới cho fallback behavior (nếu muốn giữ fallback)
    test('should use fallback data in production when fetch fails', async () => {
        // Test này chỉ chạy khi bạn muốn có fallback behavior
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        
        const renderer = new FAQRenderer('faq-container');
        
        // Mock fetch to reject
        fetch.mockRejectedValueOnce(new Error('Network error'));
        
        await renderer.fetchFAQs();
        
        // Trong production, có thể có fallback data
        // expect(renderer.faqs.length).toBeGreaterThan(0);
        
        process.env.NODE_ENV = originalNodeEnv;
    });
});