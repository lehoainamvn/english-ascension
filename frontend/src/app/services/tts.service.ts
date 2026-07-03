import { Injectable, signal } from '@angular/core';

/**
 * TtsService — Web Speech API (SpeechSynthesis)
 * Hoàn toàn miễn phí, chạy thẳng trong trình duyệt.
 * Không cần API key, không cần backend.
 */
@Injectable({ providedIn: 'root' })
export class TtsService {

  /** true khi đang phát âm */
  readonly isSpeaking = signal(false);

  private synth: SpeechSynthesis = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Phát âm một đoạn văn bản tiếng Anh.
   * @param text  Văn bản cần đọc
   * @param rate  Tốc độ đọc (0.5 – 2.0, mặc định 0.85 cho học tiếng Anh)
   * @param pitch Cao độ (0 – 2, mặc định 1)
   */
  speak(text: string, rate = 0.85, pitch = 1): void {
    if (!text?.trim()) return;

    // Hủy bất kỳ phát âm nào đang chạy
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang  = 'en-US';
    utterance.rate  = rate;
    utterance.pitch = pitch;

    // Ưu tiên chọn giọng Google US tiêu chuẩn nếu có
    const voices = this.synth.getVoices();
    const preferred = voices.find(v =>
      v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural'))
    ) ?? voices.find(v => v.lang === 'en-US')
      ?? voices.find(v => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => this.isSpeaking.set(true);
    utterance.onend   = () => this.isSpeaking.set(false);
    utterance.onerror = () => this.isSpeaking.set(false);

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /** Dừng phát âm đang chạy */
  stop(): void {
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    this.isSpeaking.set(false);
    this.currentUtterance = null;
  }

  /** Toggle: nếu đang nói thì dừng, không thì phát */
  toggle(text: string, rate = 0.85): void {
    if (this.isSpeaking()) {
      this.stop();
    } else {
      this.speak(text, rate);
    }
  }

  /** Kiểm tra trình duyệt có hỗ trợ Web Speech API không */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}
