document.getElementById('startBtn').addEventListener('click', async () => {
    const url = document.getElementById('youtubeUrl').value.trim();
    if (!url) return alert('Vui lòng nhập link YouTube!');

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes("gemini.google.com")) {
        return alert('Vui lòng mở trang web https://gemini.google.com/app trước!');
    }

    // Thử gửi message luôn
    chrome.tabs.sendMessage(tab.id, { action: "start_prompting", url: url }, function(response) {
        if(chrome.runtime.lastError) {
             // Nếu lỗi do content script chưa chạy (vì trang mở trước khi cài extension), tự động inject
             chrome.scripting.executeScript({
                 target: { tabId: tab.id },
                 files: ['content.js']
             }, () => {
                 // Gửi lại lần 2 sau khi inject xong
                 chrome.tabs.sendMessage(tab.id, { action: "start_prompting", url: url });
                 window.close();
             });
        } else {
             window.close();
        }
    });
});
