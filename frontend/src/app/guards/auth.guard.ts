import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const url = state.url;

  return authService.checkOnboardingStatus().pipe(
    map(status => {
      if (!status.hasCharacter) {
        // Redirect to character creation page if trying to access any other page
        if (url !== '/character-customization') {
          router.navigate(['/character-customization']);
          return false;
        }
        return true;
      }

      if (!status.hasRoadmap) {
        // Redirect to placement test page if character exists but no learning roadmap
        if (url !== '/placement-test' && url !== '/character-customization') {
          router.navigate(['/placement-test']);
          return false;
        }
        return true;
      }

      // Prevent going back to character customization if setup is complete
      if (url === '/character-customization') {
        router.navigate(['/dashboard']);
        return false;
      }

      return true;
    })
  );
};
