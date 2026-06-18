import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/common/navbar/navbar';
import { AiChatBubbleComponent } from './components/common/ai-chat-bubble/ai-chat-bubble';
import { ToastService } from './services/toast.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AiChatBubbleComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  public readonly toastService = inject(ToastService);

  protected readonly title = signal('frontend');
  currentUrl = signal('');

  constructor() {
    // Đánh thức server backend (Render cold start mitigation)
    this.authService.ping().subscribe();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.urlAfterRedirects || event.url);
    });
  }

  showNavbar = computed(() => {
    const url = this.currentUrl();
    const loggedIn = this.authService.currentUser() !== null;
    return loggedIn && 
           !url.includes('/login') && 
           !url.includes('/register') && 
           !url.includes('/character-customization') && 
           !url.includes('/placement-test') &&
           !url.includes('/intro') &&
           !url.includes('/admin-roadmap');
  });
}

