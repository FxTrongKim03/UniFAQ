// UniFAQ/hooks/useFaqSearch.js

/**
 * Chuẩn hóa văn bản: xóa dấu câu, chuyển chữ thường, xóa dấu cách thừa
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[?.,!]/g, '') // Xóa các dấu câu cơ bản
        .replace(/\s+/g, ' ')   // Thay thế nhiều dấu cách bằng 1 dấu
        .trim();
}

/**
 * Tách truy vấn thành các từ khóa (đã chuẩn hóa)
 * @param {string} query
 * @returns {string[]}
 */
function getKeywords(query) {
    const normalizedQuery = normalizeText(query);
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'what', 'how', 'to'];
    
    return normalizedQuery
        .split(' ')
        .filter(k => k.length > 2 && !stopWords.includes(k)); // Lọc từ ngắn & stop words
}

/**
 * Tìm các FAQs phù hợp nhất dựa trên từ khóa
 * @param {string} userQuery - Câu hỏi của người dùng
 * @param {Array} allFaqs - Mảng tất cả FAQs
 * @param {number} count - Số lượng kết quả trả về
 * @returns {Array}
 */
function findTopFaqs(userQuery, allFaqs, count = 3) {
    const keywords = getKeywords(userQuery);
    if (keywords.length === 0) {
        return [];
    }

    const scoredFaqs = allFaqs.map(faq => {
        let score = 0;
        const normalizedQuestion = normalizeText(faq.question); //

        keywords.forEach(keyword => {
            if (normalizedQuestion.includes(keyword)) {
                score += 1; // Cộng 1 điểm cho mỗi từ khóa khớp
            }
        });

        // Thêm điểm thưởng cho so khớp gần đúng
        if (normalizedQuestion.includes(normalizeText(userQuery))) {
            score += 2;
        }

        return { faq, score };
    });

    // Lọc ra những FAQ có điểm > 0 và sắp xếp
    const sortedFaqs = scoredFaqs
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score); // Sắp xếp điểm từ cao đến thấp

    // Lấy top 3
    return sortedFaqs.slice(0, count).map(item => item.faq);
}

// Gắn vào window
window.useFaqSearch = {
    normalizeText, // Thêm hàm này để ChatApp có thể dùng
    findTopFaqs
};