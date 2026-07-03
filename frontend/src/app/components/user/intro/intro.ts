import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="intro-page" [class.dark]="isDark()">

      <!-- ===== HEADER ===== -->
      <header class="intro-header">
        <div class="intro-header__inner">
          <a class="intro-logo" routerLink="/intro">
            <img src="logo.png" alt="Logo" class="intro-logo__img" />
            <span class="intro-logo__text">English Ascension</span>
          </a>

          <nav class="intro-nav">
            <a href="#features" class="intro-nav__link">Tính năng</a>
            <a href="#steps" class="intro-nav__link">Cách bắt đầu</a>

            <button class="intro-theme-btn" (click)="toggleTheme()" title="Đổi giao diện">
              @if (isDark()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              }
            </button>

            <ng-container *ngIf="!isLoggedIn; else loggedIn">
              <a routerLink="/login" class="intro-btn intro-btn--ghost">Đăng nhập</a>
              <a routerLink="/register" class="intro-btn intro-btn--solid">Đăng ký</a>
            </ng-container>
            <ng-template #loggedIn>
              <a routerLink="/dashboard" class="intro-btn intro-btn--solid">Vào học →</a>
            </ng-template>
          </nav>
        </div>
      </header>

      <!-- ===== HERO ===== -->
      <section class="intro-hero">
        <div class="intro-hero__inner">
          <div class="intro-hero__left">
            <div class="intro-badge">✦ Nền tảng học tiếng Anh AI · 2025</div>
            <h1 class="intro-hero__title">
              Chinh phục<br />tiếng Anh với<br />
              <em class="intro-hero__italic">English Ascension</em>
            </h1>
            <p class="intro-hero__desc">
              Lộ trình cá nhân hóa, đấu trường thực chiến, trợ lý AI 24/7 —
              tất cả trong một nền tảng duy nhất giúp bạn đạt mục tiêu CEFR nhanh nhất.
            </p>
            <div class="intro-hero__actions">
              <a [routerLink]="isLoggedIn ? '/dashboard' : '/register'" class="intro-btn intro-btn--solid intro-btn--lg">
                {{ isLoggedIn ? 'Tiếp tục hành trình →' : 'Bắt đầu ngay →' }}
              </a>
              <a routerLink="/login" class="intro-btn intro-btn--ghost intro-btn--lg">Đăng nhập</a>
            </div>
          </div>

          <!-- Hero Mock Cards -->
          <div class="intro-hero__right">
            <!-- Leaderboard card -->
            <div class="mock-card mock-card--leaderboard">
              <div class="mock-card__label">BẢNG XẾP HẠNG</div>
              <div class="mock-row">
                <span class="mock-rank">#1</span>
                <span class="mock-avatar mock-avatar--blue">M</span>
                <span class="mock-name">Minh Anh</span>
                <span class="mock-score">1240</span>
              </div>
              <div class="mock-row">
                <span class="mock-rank">#2</span>
                <span class="mock-avatar mock-avatar--orange">Q</span>
                <span class="mock-name">Quốc Bảo</span>
                <span class="mock-score">980</span>
              </div>
              <div class="mock-row mock-row--highlight">
                <span class="mock-rank">#3</span>
                <span class="mock-avatar mock-avatar--green">n</span>
                <span class="mock-name">nam</span>
                <span class="mock-score">840</span>
              </div>
            </div>

            <!-- Profile progress card -->
            <div class="mock-card mock-card--profile">
              <div class="mock-profile-header">
                <span class="mock-avatar mock-avatar--dark">n</span>
                <div>
                  <div class="mock-profile-name">nam</div>
                  <div class="mock-profile-level">CEFR A1 · Lv 4</div>
                </div>
                <div class="mock-streak">🔥 7 ngày</div>
              </div>
              <div class="mock-profile-xp">Tiến độ tuần này <strong>340 XP</strong></div>
              <div class="mock-progress-bar"><div class="mock-progress-fill" style="width:70%"></div></div>
              <div class="mock-skills">
                <div><span>Từ vựng</span><div class="mock-progress-bar"><div class="mock-progress-fill" style="width:65%"></div></div></div>
                <div><span>Ngữ pháp</span><div class="mock-progress-bar"><div class="mock-progress-fill" style="width:45%"></div></div></div>
                <div><span>Nghe</span><div class="mock-progress-bar"><div class="mock-progress-fill" style="width:30%"></div></div></div>
                <div><span>Đọc</span><div class="mock-progress-bar"><div class="mock-progress-fill" style="width:50%"></div></div></div>
              </div>
            </div>

            <!-- Roadmap AI card -->
            <div class="mock-card mock-card--roadmap">
              <div class="mock-roadmap-header">
                <span>LỘ TRÌNH AI</span>
                <span class="mock-badge-pct">4%</span>
              </div>
              <div class="mock-roadmap-item mock-roadmap-item--done">
                <span class="mock-dot mock-dot--done"></span>Vocabulary A1
              </div>
              <div class="mock-roadmap-item mock-roadmap-item--active">
                <span class="mock-dot mock-dot--active"></span>Verb To Be
              </div>
              <div class="mock-roadmap-item">
                <span class="mock-dot"></span>Present Simple
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== FEATURES ===== -->
      <section id="features" class="intro-section">
        <div class="intro-section__inner">
          <div class="intro-section__head">
            <p class="intro-section__eyebrow">TÍNH NĂNG NỔI BẬT</p>
            <h2 class="intro-section__title">
              Mọi thứ bạn cần để<br />
              <em class="intro-serif-italic">chinh phục tiếng Anh</em>
            </h2>
          </div>

          <div class="intro-features-grid">
            <!-- Feature A — large -->
            <div class="intro-feat intro-feat--large">
              <div class="intro-feat__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
              </div>
              <h3 class="intro-feat__title">Lộ trình học AI cá nhân hóa</h3>
              <p class="intro-feat__desc">AI phân tích điểm mạnh, điểm yếu và mục tiêu của bạn để xây dựng lộ trình học tập tối ưu nhất — không phải lộ trình chung chung.</p>
              <div class="intro-feat__list">
                <div class="intro-feat__list-item intro-feat__list-item--active">
                  <span class="intro-feat__dot intro-feat__dot--solid"></span>
                  CEFR A1 → A2
                  <span class="intro-feat__badge">Hiện tại</span>
                </div>
                <div class="intro-feat__list-item">
                  <span class="intro-feat__dot"></span>CEFR A2 → B1
                </div>
                <div class="intro-feat__list-item">
                  <span class="intro-feat__dot"></span>CEFR B1 → B2
                </div>
              </div>
            </div>

            <!-- Feature B -->
            <div class="intro-feat">
              <div class="intro-feat__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h3 class="intro-feat__title">Hệ thống RPG &amp; Level Up</h3>
              <p class="intro-feat__desc">Tích lũy EXP sau mỗi bài học, lên cấp nhân vật, mở khóa phần thưởng và leo bảng xếp hạng toàn quốc.</p>
            </div>

            <!-- Feature C -->
            <div class="intro-feat">
              <div class="intro-feat__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 class="intro-feat__title">Trợ lý AI Mentor 24/7</h3>
              <p class="intro-feat__desc">Hỏi bất cứ điều gì về ngữ pháp, từ vựng — AI giải thích chi tiết và cho ví dụ thực tế ngay lập tức.</p>
            </div>

            <!-- Feature D -->
            <div class="intro-feat">
              <div class="intro-feat__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 9.3 17 7l4 4-2.3 2.3Z"/><path d="M11.7 12.3 3.5 20.5a1.5 1.5 0 0 0 2 2l8.2-8.2Z"/></svg>
              </div>
              <h3 class="intro-feat__title">Đấu Từ Vựng Minigame</h3>
              <p class="intro-feat__desc">Phản xạ từ vựng tiếng Anh qua các màn đấu quái thú gay cấn, học mà chơi, chơi mà học.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== STEPS ===== -->
      <section id="steps" class="intro-section intro-section--alt">
        <div class="intro-steps-layout">
          <div class="intro-steps-left">
            <p class="intro-section__eyebrow">CÁCH BẮT ĐẦU</p>
            <h2 class="intro-section__title">
              4 bước để<br />
              <em class="intro-serif-italic">bắt đầu hành trình</em>
            </h2>
            <p class="intro-section__sub">
              Thiết lập tài khoản và nhận lộ trình AI chỉ trong vài phút. Không cần thẻ tín dụng.
            </p>
            <a [routerLink]="isLoggedIn ? '/dashboard' : '/register'" class="intro-btn intro-btn--solid intro-btn--lg" style="margin-top:2rem; display:inline-flex">
              Bắt đầu ngay →
            </a>
          </div>
          <div class="intro-steps-right">
            <div class="intro-step" *ngFor="let step of steps; let i = index">
              <div class="intro-step__num">{{ (i + 1).toString().padStart(2, '0') }}</div>
              <div class="intro-step__body">
                <h4 class="intro-step__title">{{ step.title }}</h4>
                <p class="intro-step__desc">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== TESTIMONIALS ===== -->
      <section class="intro-section">
        <div class="intro-section__inner">
          <div class="intro-section__head">
            <p class="intro-section__eyebrow">NGƯỜI HỌC NÓI GÌ</p>
            <h2 class="intro-section__title">
              Kết quả <em class="intro-serif-italic">thực tế</em>
            </h2>
          </div>
          <div class="intro-testimonials">
            <div class="intro-testi" *ngFor="let t of testimonials">
              <p class="intro-testi__quote">"{{ t.quote }}"</p>
              <div class="intro-testi__footer">
                <div>
                  <div class="intro-testi__name">{{ t.name }}</div>
                  <div class="intro-testi__level">{{ t.level }}</div>
                </div>
                <div class="intro-testi__score">
                  {{ t.fromScore }} → {{ t.toScore }}
                  <div class="intro-testi__duration">{{ t.duration }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== CTA BANNER ===== -->
      <section class="intro-cta-banner">
        <div class="intro-cta-banner__inner">
          <div>
            <h3 class="intro-cta-banner__title">✦ Bắt đầu chinh phục tiếng Anh miễn phí</h3>
            <p class="intro-cta-banner__sub">Lộ trình AI cá nhân hóa, không cần thẻ tín dụng.</p>
          </div>
          <div class="intro-cta-banner__actions">
            <a [routerLink]="isLoggedIn ? '/dashboard' : '/register'" class="intro-btn intro-btn--solid">
              {{ isLoggedIn ? 'Vào học ngay' : 'Đăng ký miễn phí' }}
            </a>
            <a routerLink="/login" class="intro-btn intro-btn--outline-dark">Đăng nhập</a>
          </div>
        </div>
      </section>

      <!-- ===== FOOTER ===== -->
      <footer class="intro-footer">
        <div class="intro-footer__inner">
          <div class="intro-footer__brand">
            <img src="logo.png" alt="Logo" class="intro-logo__img" />
            <span class="intro-footer__brand-name">English Ascension</span>
            <p class="intro-footer__brand-desc">Chinh phục ngoại ngữ thông qua lộ trình AI và hệ thống RPG thực chiến.</p>
            <p class="intro-footer__company">Phát triển bởi VNPT Thực Tập</p>
          </div>
          <div class="intro-footer__cols">
            <div class="intro-footer__col">
              <div class="intro-footer__col-title">HỌC TẬP</div>
              <a class="intro-footer__link" routerLink="/dashboard">Dashboard</a>
              <a class="intro-footer__link" routerLink="/vocabulary">Từ vựng</a>
              <a class="intro-footer__link" routerLink="/listening">Nghe</a>
              <a class="intro-footer__link" routerLink="/reading">Đọc</a>
            </div>
            <div class="intro-footer__col">
              <div class="intro-footer__col-title">TÀI KHOẢN</div>
              <a class="intro-footer__link" routerLink="/register">Đăng ký</a>
              <a class="intro-footer__link" routerLink="/login">Đăng nhập</a>
              <a class="intro-footer__link" routerLink="/placement-test">Kiểm tra trình độ</a>
            </div>
          </div>
        </div>
        <div class="intro-footer__bottom">
          © 2026 English Ascension. All rights reserved.
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* ============================================================
       GOOGLE FONTS + RESET
    ============================================================ */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,400;1,700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ============================================================
       CSS VARIABLES — LIGHT / DARK
    ============================================================ */
    .intro-page {
      --bg: #ffffff;
      --bg-alt: #f5f5f3;
      --bg-card: #ffffff;
      --border: #e5e5e0;
      --text: #111110;
      --text-muted: #6b6b63;
      --text-light: #9b9b90;
      --accent: #111110;
      --accent-inv: #ffffff;
      --eyebrow: #6b6b63;
      --badge-bg: #111110;
      --badge-text: #ffffff;
      --shadow: 0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.05);
      --shadow-lg: 0 2px 8px rgba(0,0,0,.08), 0 8px 32px rgba(0,0,0,.08);

      font-family: 'Inter', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      transition: background .3s, color .3s;
    }

    .intro-page.dark {
      --bg: #111110;
      --bg-alt: #1a1a18;
      --bg-card: #1e1e1c;
      --border: #2e2e2c;
      --text: #f5f5f0;
      --text-muted: #9b9b90;
      --text-light: #6b6b63;
      --accent: #f5f5f0;
      --accent-inv: #111110;
      --eyebrow: #9b9b90;
      --badge-bg: #f5f5f0;
      --badge-text: #111110;
      --shadow: 0 1px 4px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.25);
      --shadow-lg: 0 2px 8px rgba(0,0,0,.4), 0 8px 32px rgba(0,0,0,.35);
    }

    /* ============================================================
       TYPOGRAPHY HELPERS
    ============================================================ */
    .intro-serif-italic,
    .intro-hero__italic {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-weight: 400;
      color: var(--text-muted);
    }

    /* ============================================================
       BUTTONS
    ============================================================ */
    .intro-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'Inter', sans-serif;
      font-size: .8125rem; font-weight: 600;
      border-radius: 8px; padding: 9px 18px;
      cursor: pointer; text-decoration: none;
      border: 1px solid transparent;
      transition: all .18s ease;
      white-space: nowrap;
    }
    .intro-btn--solid {
      background: var(--accent); color: var(--accent-inv);
      border-color: var(--accent);
    }
    .intro-btn--solid:hover { opacity: .85; }
    .intro-btn--ghost {
      background: transparent; color: var(--text-muted);
      border-color: transparent;
    }
    .intro-btn--ghost:hover { color: var(--text); background: var(--bg-alt); }
    .intro-btn--outline-dark {
      background: transparent; color: var(--accent);
      border-color: var(--border);
    }
    .intro-btn--outline-dark:hover { background: var(--bg-alt); }
    .intro-btn--lg { font-size: .875rem; padding: 12px 24px; border-radius: 10px; }

    /* ============================================================
       HEADER
    ============================================================ */
    .intro-header {
      position: sticky; top: 0; z-index: 50;
      background: rgba(255,255,255,.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      transition: background .3s;
    }
    .intro-page.dark .intro-header {
      background: rgba(17,17,16,.92);
    }
    .intro-header__inner {
      max-width: 1200px; margin: 0 auto;
      padding: 0 40px; height: 64px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .intro-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .intro-logo__img { width: 30px; height: 30px; object-fit: contain; }
    .intro-logo__text { font-size: .875rem; font-weight: 800; color: var(--text); letter-spacing: -.02em; }
    .intro-nav { display: flex; align-items: center; gap: 6px; }
    .intro-nav__link {
      font-size: .8125rem; font-weight: 500; color: var(--text-muted);
      text-decoration: none; padding: 6px 12px; border-radius: 6px;
      transition: all .15s;
    }
    .intro-nav__link:hover { color: var(--text); background: var(--bg-alt); }
    .intro-theme-btn {
      width: 34px; height: 34px; border-radius: 8px;
      border: 1px solid var(--border); background: transparent;
      color: var(--text-muted); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s;
    }
    .intro-theme-btn:hover { color: var(--text); background: var(--bg-alt); }

    /* ============================================================
       HERO
    ============================================================ */
    .intro-hero {
      padding: 80px 40px 80px;
      max-width: 1200px; margin: 0 auto;
    }
    .intro-hero__inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }
    .intro-badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: .6875rem; font-weight: 600; color: var(--text-muted);
      border: 1px solid var(--border); border-radius: 100px;
      padding: 5px 12px; margin-bottom: 28px;
      background: var(--bg-card);
    }
    .intro-hero__title {
      font-size: clamp(2.5rem, 5vw, 3.75rem);
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -.03em;
      color: var(--text);
      margin-bottom: 24px;
    }
    .intro-hero__italic {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      display: block;
      margin-top: 4px;
    }
    .intro-hero__desc {
      font-size: .9375rem; line-height: 1.65;
      color: var(--text-muted); max-width: 420px;
      margin-bottom: 32px;
    }
    .intro-hero__actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    /* Hero Mock Cards */
    .intro-hero__right {
      position: relative; height: 320px;
      display: flex; align-items: center;
    }
    .mock-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: var(--shadow);
      position: absolute;
    }
    .mock-card--leaderboard {
      left: 0; top: 0;
      width: 230px;
      z-index: 2;
    }
    .mock-card--profile {
      right: 0; top: 20px;
      width: 220px;
      z-index: 3;
    }
    .mock-card--roadmap {
      left: 30px; bottom: 0;
      width: 180px;
      z-index: 2;
    }
    .mock-card__label {
      font-size: .6rem; font-weight: 800; letter-spacing: .12em;
      color: var(--text-light); margin-bottom: 12px;
    }
    .mock-row {
      display: flex; align-items: center; gap: 8px;
      padding: 5px 0; font-size: .75rem; color: var(--text);
    }
    .mock-row--highlight { background: var(--bg-alt); border-radius: 6px; padding: 5px 6px; margin: 0 -6px; }
    .mock-rank { font-size: .65rem; font-weight: 700; color: var(--text-light); width: 18px; }
    .mock-avatar {
      width: 22px; height: 22px; border-radius: 50%;
      font-size: .65rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: #fff;
    }
    .mock-avatar--blue { background: #3b82f6; }
    .mock-avatar--orange { background: #f97316; }
    .mock-avatar--green { background: #22c55e; }
    .mock-avatar--dark { background: var(--accent); color: var(--accent-inv); }
    .mock-name { flex: 1; font-size: .75rem; font-weight: 500; }
    .mock-score { font-size: .75rem; font-weight: 700; }
    .mock-profile-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 14px;
    }
    .mock-profile-name { font-size: .8rem; font-weight: 700; }
    .mock-profile-level { font-size: .6rem; color: var(--text-light); }
    .mock-streak { font-size: .65rem; margin-left: auto; color: var(--text-muted); white-space: nowrap; }
    .mock-profile-xp { font-size: .65rem; color: var(--text-light); margin-bottom: 4px; }
    .mock-profile-xp strong { color: var(--text); }
    .mock-progress-bar {
      height: 4px; background: var(--bg-alt);
      border-radius: 10px; overflow: hidden; margin-bottom: 2px;
    }
    .mock-progress-fill {
      height: 100%; background: var(--accent);
      border-radius: 10px; transition: width .6s ease;
    }
    .mock-skills { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
    .mock-skills > div {
      display: grid; grid-template-columns: 48px 1fr;
      gap: 6px; align-items: center;
    }
    .mock-skills > div > span { font-size: .6rem; color: var(--text-light); }
    .mock-roadmap-header {
      display: flex; justify-content: space-between; align-items: center;
      font-size: .6rem; font-weight: 800; letter-spacing: .1em;
      color: var(--text-light); margin-bottom: 12px;
    }
    .mock-badge-pct {
      background: #22c55e; color: #fff;
      font-size: .55rem; font-weight: 700;
      padding: 2px 6px; border-radius: 100px;
    }
    .mock-roadmap-item {
      display: flex; align-items: center; gap: 8px;
      font-size: .72rem; color: var(--text-muted);
      padding: 4px 0;
    }
    .mock-roadmap-item--done { color: var(--text-light); }
    .mock-roadmap-item--active { font-weight: 700; color: var(--text); }
    .mock-dot {
      width: 8px; height: 8px; border-radius: 50%;
      border: 1.5px solid var(--border); flex-shrink: 0;
    }
    .mock-dot--done { background: var(--text-light); border-color: var(--text-light); }
    .mock-dot--active { background: var(--accent); border-color: var(--accent); }

    /* ============================================================
       SECTION COMMONS
    ============================================================ */
    .intro-section {
      padding: 80px 40px;
    }
    .intro-section--alt { background: var(--bg-alt); }
    .intro-section__inner { max-width: 1200px; margin: 0 auto; }
    .intro-section__head { margin-bottom: 52px; }
    .intro-section__eyebrow {
      font-size: .6875rem; font-weight: 700; letter-spacing: .12em;
      color: var(--eyebrow); text-transform: uppercase;
      margin-bottom: 12px;
    }
    .intro-section__title {
      font-size: clamp(1.875rem, 4vw, 2.75rem);
      font-weight: 900; letter-spacing: -.025em;
      line-height: 1.12; color: var(--text);
    }
    .intro-section__sub {
      font-size: .9375rem; line-height: 1.65;
      color: var(--text-muted); max-width: 400px;
      margin-top: 16px;
    }

    /* ============================================================
       FEATURES GRID
    ============================================================ */
    .intro-features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 20px;
    }
    .intro-feat {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px 30px;
      transition: box-shadow .2s, transform .2s;
    }
    .intro-feat:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
    .intro-feat--large {
      grid-row: 1 / 3;
    }
    .intro-feat__icon {
      width: 46px; height: 46px;
      background: var(--bg-alt);
      border: 1px solid var(--border);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text); margin-bottom: 20px;
    }
    .intro-feat__title {
      font-size: 1rem; font-weight: 700;
      color: var(--text); margin-bottom: 10px; line-height: 1.3;
    }
    .intro-feat__desc {
      font-size: .875rem; line-height: 1.65;
      color: var(--text-muted);
    }
    .intro-feat__list { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; }
    .intro-feat__list-item {
      display: flex; align-items: center; gap: 10px;
      font-size: .8125rem; color: var(--text-muted); padding: 4px 0;
    }
    .intro-feat__list-item--active { font-weight: 600; color: var(--text); }
    .intro-feat__dot {
      width: 8px; height: 8px; border-radius: 50%;
      border: 1.5px solid var(--border); flex-shrink: 0;
    }
    .intro-feat__dot--solid { background: var(--accent); border-color: var(--accent); }
    .intro-feat__badge {
      margin-left: auto;
      font-size: .65rem; font-weight: 700;
      background: var(--badge-bg); color: var(--badge-text);
      padding: 2px 8px; border-radius: 100px;
    }

    /* ============================================================
       STEPS
    ============================================================ */
    .intro-steps-layout {
      max-width: 1200px; margin: 0 auto;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 80px; align-items: start;
    }
    .intro-step {
      display: flex; gap: 24px;
      padding: 20px 0;
      border-bottom: 1px solid var(--border);
    }
    .intro-step:first-child { border-top: 1px solid var(--border); }
    .intro-step__num {
      font-size: .875rem; font-weight: 800;
      color: var(--text-light); flex-shrink: 0;
      padding-top: 2px; min-width: 28px;
    }
    .intro-step__title {
      font-size: .9375rem; font-weight: 700;
      color: var(--text); margin-bottom: 6px;
    }
    .intro-step__desc { font-size: .875rem; line-height: 1.6; color: var(--text-muted); }

    /* ============================================================
       TESTIMONIALS
    ============================================================ */
    .intro-testimonials {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .intro-testi {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px 26px;
      display: flex; flex-direction: column;
      justify-content: space-between; gap: 20px;
      transition: box-shadow .2s;
    }
    .intro-testi:hover { box-shadow: var(--shadow-lg); }
    .intro-testi__quote {
      font-size: .9rem; line-height: 1.7;
      color: var(--text-muted);
    }
    .intro-testi__footer { display: flex; justify-content: space-between; align-items: flex-end; }
    .intro-testi__name { font-size: .875rem; font-weight: 700; color: var(--text); }
    .intro-testi__level { font-size: .75rem; color: var(--text-light); margin-top: 2px; }
    .intro-testi__score { font-size: 1rem; font-weight: 800; color: var(--text); text-align: right; }
    .intro-testi__duration { font-size: .75rem; color: var(--text-light); margin-top: 2px; }

    /* ============================================================
       CTA BANNER
    ============================================================ */
    .intro-cta-banner {
      background: var(--bg-card);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 40px 40px;
    }
    .intro-cta-banner__inner {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between;
      gap: 32px; flex-wrap: wrap;
    }
    .intro-cta-banner__title {
      font-size: 1.0625rem; font-weight: 700; color: var(--text);
      margin-bottom: 4px;
    }
    .intro-cta-banner__sub { font-size: .875rem; color: var(--text-muted); }
    .intro-cta-banner__actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

    /* ============================================================
       FOOTER
    ============================================================ */
    .intro-footer { background: var(--bg-alt); padding: 60px 40px 0; }
    .intro-footer__inner {
      max-width: 1200px; margin: 0 auto;
      display: grid; grid-template-columns: 1.4fr 1fr;
      gap: 60px; padding-bottom: 48px;
      border-bottom: 1px solid var(--border);
    }
    .intro-footer__brand { max-width: 320px; }
    .intro-footer__brand-name { font-size: .9375rem; font-weight: 800; color: var(--text); margin: 10px 0 10px; display: block; }
    .intro-footer__brand-desc { font-size: .8125rem; line-height: 1.65; color: var(--text-muted); }
    .intro-footer__company { font-size: .75rem; color: var(--text-light); margin-top: 16px; }
    .intro-footer__cols { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
    .intro-footer__col { display: flex; flex-direction: column; gap: 10px; }
    .intro-footer__col-title { font-size: .65rem; font-weight: 800; letter-spacing: .12em; color: var(--text-light); text-transform: uppercase; margin-bottom: 4px; }
    .intro-footer__link { font-size: .8125rem; color: var(--text-muted); text-decoration: none; transition: color .15s; }
    .intro-footer__link:hover { color: var(--text); }
    .intro-footer__bottom {
      max-width: 1200px; margin: 0 auto;
      padding: 20px 0;
      font-size: .75rem; color: var(--text-light);
    }

    /* ============================================================
       RESPONSIVE
    ============================================================ */
    @media (max-width: 900px) {
      .intro-hero__inner { grid-template-columns: 1fr; }
      .intro-hero__right { display: none; }
      .intro-features-grid { grid-template-columns: 1fr; }
      .intro-feat--large { grid-row: auto; }
      .intro-steps-layout { grid-template-columns: 1fr; gap: 40px; }
      .intro-testimonials { grid-template-columns: 1fr; }
      .intro-footer__inner { grid-template-columns: 1fr; }
      .intro-header__inner { padding: 0 20px; }
      .intro-hero { padding: 48px 20px; }
      .intro-section { padding: 60px 20px; }
      .intro-nav__link { display: none; }
    }
  `]
})
export class IntroComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isDark = signal(false);

  steps = [
    { title: 'Tạo tài khoản miễn phí', desc: 'Đăng ký trong 30 giây với email hoặc Google. Không cần thẻ tín dụng.' },
    { title: 'Làm bài kiểm tra trình độ', desc: 'AI đánh giá trình độ của bạn qua 15 câu hỏi để xác định CEFR level.' },
    { title: 'Nhận lộ trình học cá nhân', desc: 'Hệ thống tạo lộ trình tối ưu dựa trên mục tiêu, lịch học và điểm yếu của bạn.' },
    { title: 'Học mỗi ngày & lên cấp', desc: 'Hoàn thành bài học, tích EXP, leo bảng xếp hạng và chinh phục mục tiêu CEFR.' }
  ];

  testimonials = [
    {
      quote: 'Hệ thống RPG giúp tôi duy trì động lực mỗi ngày. Không bỏ học một ngày nào trong 3 tháng qua.',
      name: 'Nguyễn Minh Anh', level: 'CEFR B1',
      fromScore: 450, toScore: 620, duration: '3 tháng'
    },
    {
      quote: 'Trợ lý AI giải thích ngữ pháp cực kỳ rõ ràng. Tôi hiểu được những điểm ngữ pháp mà trước đây cứ nhầm mãi.',
      name: 'Trần Quốc Bảo', level: 'CEFR A2',
      fromScore: 300, toScore: 450, duration: '2 tháng'
    },
    {
      quote: 'Lộ trình AI thực sự khác biệt. Tôi học đúng điểm yếu, không mất thời gian ôn những thứ đã biết.',
      name: 'Lê Thị Hương', level: 'CEFR B2',
      fromScore: 620, toScore: 780, duration: '4 tháng'
    }
  ];

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }

  ngOnInit(): void {
    this.checkCurrentTheme();
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      if (user && user.role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin-roadmap']);
        return;
      }
      this.authService.checkOnboardingStatus().subscribe({
        next: (status) => {
          if (status.hasCharacter && status.hasRoadmap) {
            this.router.navigate(['/dashboard'], { queryParams: { tab: 'suggested' } });
          }
        }
      });
    }
  }

  checkCurrentTheme(): void {
    if (typeof window !== 'undefined') {
      this.isDark.set(document.documentElement.classList.contains('dark'));
    }
  }

  toggleTheme(): void {
    if (typeof window !== 'undefined') {
      const next = !this.isDark();
      this.isDark.set(next);
      document.documentElement.classList.toggle('dark', next);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/intro']);
  }
}
