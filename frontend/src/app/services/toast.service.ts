import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', duration = 3500) {
    let cleanMessage = message;
    if (type === 'error' && message) {
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('groq') || lowerMsg.includes('429') || lowerMsg.includes('too many requests') || lowerMsg.includes('rate limit') || lowerMsg.includes('limit reached')) {
        cleanMessage = 'Lỗi hệ thống hoặc quá giới hạn lượt yêu cầu. Vui lòng thử lại sau!';
      }
    }
    const id = this.counter++;
    const newToast: ToastMessage = { id, message: cleanMessage, type };
    
    // Chỉ hiển thị thông báo mới nhất để tránh spam
    this.toasts.set([newToast]);

    // Tự động xóa sau khoảng thời gian duration
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string, duration = 3500) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 3500) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3000) {
    this.show(message, 'info', duration);
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
