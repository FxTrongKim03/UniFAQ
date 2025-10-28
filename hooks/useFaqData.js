// UniFAQ/hooks/useFaqData.js

// Sử dụng "Singleton" pattern để chỉ fetch 1 lần
let faqsCache = null;
let fetchPromise = null;

async function loadFaqs() {
    if (faqsCache) return faqsCache;
    if (fetchPromise) return fetchPromise;

    console.log('🔄 [useFaqData] Fetching FAQs from API...');
    const apiUrl = 'http://localhost:3001/api/faqs'; // URL backend

    fetchPromise = fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`API Error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) throw new Error('API did not return an array');
            faqsCache = data;
            console.log(`✅ [useFaqData] FAQs loaded from API: ${faqsCache.length}`);
            fetchPromise = null;
            return faqsCache;
        })
        .catch(error => {
            console.error('❌ [useFaqData] Fetch API failed:', error);
            fetchPromise = null;
            return [];
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