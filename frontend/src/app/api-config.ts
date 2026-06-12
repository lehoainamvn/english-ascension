// Centralized API Configuration
// Tự động chuyển đổi giữa Localhost và URL deploy thực tế của Backend trên Render.
export const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://english-ascension.onrender.com'; // Hãy cập nhật link Render thực tế của bạn tại đây
