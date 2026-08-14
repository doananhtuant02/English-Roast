ENGLISH ROAST V6 - VOICE AFTER MIC

Sửa lỗi V5 không phát tiếng trên điện thoại.

Cơ chế mới:
1. Bấm mic.
2. Web mở Speech Recognition.
3. Người dùng nói.
4. Web chấm đúng/sai nhưng CHƯA phát voice ngay.
5. Speech Recognition kết thúc và giải phóng microphone.
6. Sau khoảng 240ms, web mới phát câu khen/cà khịa bằng SpeechSynthesis.

Ngoài ra:
- TTS được "unlock" ngay từ lần bấm mic đầu tiên.
- Không còn chờ voice tiếng Việt theo kiểu V5.
- Nếu máy có voice vi-VN thì tự dùng.
- Nếu không có, trình duyệt vẫn cố phát với lang=vi-VN.

Cập nhật GitHub:
- Thay index.html cũ bằng index.html V6.
- Commit changes.
- Chờ Pages deploy lại.
- Mở website bằng TAB MỚI trên điện thoại.
