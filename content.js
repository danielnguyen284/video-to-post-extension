// content.js - Chạy bên trong trang Gemini

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start_prompting") {
        sendResponse({status: "started"});
        startSequence(request.url);
    }
    return true;
});

async function startSequence(url) {
    const prompt1 = `Xin chào. Đây là nội dung tôi cần bạn giúp. Vui lòng ĐỌC transcript của video YouTube sau (nếu xem được) hoặc dựa vào TÊN và MÔ TẢ của link để TRÍCH XUẤT NỘI DUNG CHÍNH. Sau đó, hãy viết một bài đăng Facebook với độ dài ngắn gọn, súc tích (khoảng 200 - 300 chữ), văn phong tự nhiên, chia sẻ cá nhân (xưng "mình - bạn/anh em", giọng điệu đam mê công nghệ). Yêu cầu cấu trúc bài viết (Phải có đủ 5 phần này): 1. Câu HOOK thu hút sự chú ý một cách tự nhiên (có thể so sánh, bắt trend). 2. Giới thiệu nguồn/kênh khéo léo. 3. Nội dung chính: Tóm tắt điểm đột phá (dùng bullet point với icon như ✅ để trình bày rõ). 4. Nhận định cá nhân sâu sắc của bạn. 5. Kết luận hướng người đọc xuống bình luận để lấy link video. Link video: ${url}`;

    const prompt2 = `Tuyệt vời, cảm ơn phần nội dung của bạn. Bây giờ, hãy tạo một bức ảnh minh họa duy nhất phản ánh nội dung chính của bài viết bạn vừa tạo. Kích thước ngang (tỷ lệ 16:9) để phù hợp đăng lên Facebook nhé.`;

    console.log("Bắt đầu gửi Prompt 1...");
    let success = await sendPrompt(prompt1);
    if(!success) {
        alert("Bot không thể tìm thấy ô nhập liệu của Gemini. Giao diện có thể đã đổi.");
        return;
    }

    console.log("Đợi Gemini trả lời xong Prompt 1...");
    await waitForGeminiCompletion();

    console.log("Gemini đã viết xong bài, tiếp tục gửi Prompt 2...");
    await sendPrompt(prompt2);
}

// Function để điền text vào ô của Gemini và ấn nút send
async function sendPrompt(text) {
    // Ô input của Gemini thường đổi nhưng hay có <rich-textarea> hoặc div có contenteditable
    let inputBox = document.querySelector('rich-textarea div[contenteditable="true"]') || document.querySelector('div[contenteditable="true"]');
    
    if (!inputBox) return false;

    // Focus vào ô input
    inputBox.click();
    inputBox.focus();

    // Dùng execCommand để giả lập việc Paste text vào, giúp Gemini nhận diện được event thay đổi text
    document.execCommand('delete', false, null); // Xoá text cũ nếu có
    document.execCommand('insertText', false, text);
    
    // Đợi UI cập nhật react state
    await new Promise(r => setTimeout(r, 600));

    // Tìm nút Send
    let sendButton = document.querySelector('button[aria-label="Send message"]') || document.querySelector('button[aria-label="Gửi tin nhắn"]');
    
    if (sendButton && !sendButton.disabled && sendButton.style.display !== 'none') {
        sendButton.click();
        return true;
    }

    return false;
}

// Function đợi Gemini generate xong
async function waitForGeminiCompletion() {
    return new Promise(resolve => {
        // Đợi 3 giây để giao diện chuyển sang trạng thái "Đang trả lời"
        setTimeout(() => {
            let checkInterval = setInterval(() => {
                // Kiểm tra xem nút Send đã hiện lại và có thể ấn được không (Tức là đã trả lời xong)
                let sendButton = document.querySelector('button[aria-label="Send message"]') || document.querySelector('button[aria-label="Gửi tin nhắn"]');
                let stopButton = document.querySelector('button[aria-label="Stop generating"]') || document.querySelector('button[aria-label="Dừng tạo"]');
                
                // Nếu thấy Stop button nghĩa là đang chạy -> vẫn đợi
                if (stopButton) return;

                // Nếu Send button xuất hiện lại và không bị disabled -> đã xong
                if (sendButton && !sendButton.disabled) {
                    clearInterval(checkInterval);
                    // Nghỉ 2 giây trước khi chốt
                    setTimeout(resolve, 2000);
                }
            }, 1000); // Check mỗi giây
        }, 3000);
    });
}
