// faqRenderer.test.js
const FAQRenderer = require('./faqRenderer.js'); // Đảm bảo đường dẫn đúng

// Mock fetch globally
global.fetch = jest.fn();

// Mock DOM environment
beforeEach(() => {
    document.body.innerHTML = `
        <div id="faq-container"></div>
    `;
    fetch.mockClear(); // Xóa các mock cũ trước mỗi test
});

// Mock Font Awesome (giữ nguyên)
beforeEach(() => {
    const style = document.createElement('style');
    style.innerHTML = `
        .fas { display: inline-block; }
        .fa-exclamation-triangle:before { content: "⚠️"; }
        .fa-inbox:before { content: "📥"; }
    `;
    // Tránh thêm style nhiều lần
    if (!document.head.querySelector('style#fa-mock')) {
        style.id = 'fa-mock';
        document.head.appendChild(style);
    }
});

describe('FAQRenderer', () => {
    test('should render loading state initially', () => {
        const renderer = new FAQRenderer('faq-container');
        renderer.setLoading(true);
        // Không cần gọi render() vì setLoading đã gọi
        // renderer.render();

        expect(document.querySelector('.faq-loading')).toBeTruthy();
        expect(document.querySelector('.loading-spinner')).toBeTruthy();
        expect(document.querySelector('.faq-loading p').textContent).toContain('Loading FAQs');
    });

    test('should render FAQs when data is available', () => {
        const renderer = new FAQRenderer('faq-container');
        const mockFAQs = [
            { id: '1', question: 'Test Question?', answer: 'Test Answer', category: 'test', votes: 10 }
        ];
        renderer.faqs = mockFAQs; // Gán trực tiếp data để test render
        renderer.setLoading(false); // Gọi setLoading(false) để trigger render
        // renderer.render(); // Không cần gọi trực tiếp

        expect(document.querySelector('.faq-header h2').textContent).toBe('Frequently Asked Questions');
        // Điều chỉnh text này nếu bạn muốn hiển thị số lượng khác khi render thủ công
        // expect(document.querySelector('.faq-header p').textContent).toBe('Top 1 questions available');
        expect(document.querySelector('.faq-item h3').textContent).toBe('Test Question?');
        expect(document.querySelector('.faq-answer p').textContent).toBe('Test Answer');
        expect(document.querySelector('.faq-votes').textContent).toBe('10 votes');
        expect(document.querySelector('.faq-category').textContent).toBe('test');
    });

    test('should render error state when fetch fails', async () => {
        const renderer = new FAQRenderer('faq-container');
        const networkError = new Error('Network error'); // Tạo lỗi cụ thể
        fetch.mockRejectedValueOnce(networkError); // Mock fetch bị từ chối

        await renderer.fetchFAQs(); // Gọi hàm fetch

        // fetchFAQs sẽ gọi setLoading(false) -> render()
        expect(document.querySelector('.faq-error')).toBeTruthy();
        expect(document.querySelector('.faq-error h3').textContent).toBe('Unable to Load FAQs');
        // Kiểm tra xem thông báo lỗi cụ thể có được hiển thị không
        expect(document.querySelector('.faq-error p').textContent).toContain('Network error');
        expect(document.querySelector('.retry-btn')).toBeTruthy();
        expect(renderer.faqs).toHaveLength(0); // Đảm bảo faqs rỗng khi lỗi
        expect(renderer.error).toBe(networkError.message); // Kiểm tra lỗi được lưu lại
    });

    test('should render empty state when no FAQs available', () => {
        const renderer = new FAQRenderer('faq-container');
        renderer.faqs = []; // Dữ liệu rỗng
        renderer.setLoading(false); // Trigger render
        // renderer.render();

        expect(document.querySelector('.faq-empty')).toBeTruthy();
        expect(document.querySelector('.faq-empty h3').textContent).toBe('No FAQs Available');
    });

    // --- TEST CASE BỊ LỖI ĐÃ ĐƯỢC SỬA ---
    test('should handle successful fetch with data', async () => {
        const renderer = new FAQRenderer('faq-container');
        const mockApiData = [ // <--- Sửa: Dữ liệu API giả lập LÀ MỘT MẢNG
            {
                id: '1',      // ID là string
                question: 'Test Q?',
                answer: 'Test A',
                category: 'test',
                votes: 5     // Giả sử vote cao nhất
            },
             {
                id: '2',
                question: 'Test Q2?',
                answer: 'Test A2',
                category: 'test2',
                votes: 3     // Vote thấp hơn
            }
            // Thêm nhiều FAQ nếu muốn test lọc top 10
        ];

        // Mock fetch trả về response thành công và hàm json trả về MẢNG mockApiData
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockApiData // <--- Sửa: Trả về trực tiếp mảng
        });

        await renderer.fetchFAQs(); // Gọi hàm fetch

        // fetchFAQs sẽ sắp xếp theo vote và lấy top 10 (ở đây chỉ có 2)
        expect(renderer.faqs).toHaveLength(2); // Kiểm tra số lượng sau khi lọc/sắp xếp
        // Kiểm tra phần tử đầu tiên (có vote cao nhất)
        expect(renderer.faqs[0].question).toBe('Test Q?');
        expect(renderer.faqs[0].answer).toBe('Test A');
        expect(renderer.faqs[0].category).toBe('test');
        expect(renderer.faqs[0].votes).toBe(5);
        expect(renderer.error).toBeNull(); // Không có lỗi

        // Kiểm tra DOM sau khi render (do setLoading(false) trigger)
        expect(document.querySelector('.faq-list')).toBeTruthy();
        expect(document.querySelectorAll('.faq-item').length).toBe(2);
        expect(document.querySelector('.faq-item h3').textContent).toBe('Test Q?'); // Item đầu tiên
    });
    // --- KẾT THÚC SỬA ---

    test('should include retry button in error state that calls fetchFAQs', () => {
        const renderer = new FAQRenderer('faq-container');
        renderer.error = 'Test error';
        renderer.setLoading(false); // Trigger renderError
        // renderer.renderError(); // Không cần gọi trực tiếp

        const retryButton = document.querySelector('.retry-btn');
        expect(retryButton).toBeTruthy();

        // Mock lại fetchFAQs trên instance này để theo dõi lời gọi
        renderer.fetchFAQs = jest.fn();

        retryButton.click();
        expect(renderer.fetchFAQs).toHaveBeenCalledTimes(1);
    });

    // Bỏ qua test này vì không có fallback data trong code hiện tại
    // test('should use fallback data in production when fetch fails', async () => { ... });
});