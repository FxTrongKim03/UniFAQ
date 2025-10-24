// UniFAQ/hooks/useFaqData.js

// Sử dụng "Singleton" pattern để chỉ fetch 1 lần
let faqsCache = null;
let fetchPromise = null;

async function loadFaqs() {
    if (faqsCache) {
        return faqsCache;
    }
    if (fetchPromise) {
        return fetchPromise;
    }

    console.log('🔄 Fetching faqs.json...');
    fetchPromise = fetch('./faqs.json') //
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.faqs) { //
                throw new Error('Invalid data structure: missing "faqs" property'); //
            }
            faqsCache = data.faqs; //
            console.log('✅ FAQs loaded and cached:', faqsCache.length);
            fetchPromise = null;
            return faqsCache;
        })
        .catch(error => {
            console.error('❌ Fetch failed:', error);
            fetchPromise = null;
            return []; // Trả về mảng rỗng khi lỗi
        });
    return fetchPromise;
}

async function getFaqs() {
    if (faqsCache) {
        return faqsCache;
    }
    return await loadFaqs();
}

// Export các hàm
// (Vì chúng ta không dùng module bundler, chúng ta sẽ gắn nó vào `window`)
window.useFaqData = {
    loadFaqs,
    getFaqs
};