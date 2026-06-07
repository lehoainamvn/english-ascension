import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CharacterCustomizationComponent } from './components/character-customization/character-customization';
import { PlacementTestComponent } from './components/placement-test/placement-test';
import { RoadmapComponent } from './components/roadmap/roadmap';
import { StudyComponent } from './components/study/study';
import { WorldMapComponent } from './components/world-map/world-map';
import { WordBattleComponent } from './components/word-battle/word-battle';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'character-customization', component: CharacterCustomizationComponent, canActivate: [authGuard] },
  { path: 'placement-test', component: PlacementTestComponent, canActivate: [authGuard] },
  { path: 'roadmap', component: RoadmapComponent, canActivate: [authGuard] },
  { path: 'study/:moduleId', component: StudyComponent, canActivate: [authGuard] },
  { path: 'world-map', component: WorldMapComponent, canActivate: [authGuard] },
  { path: 'word-battle/:moduleId', component: WordBattleComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'world-map', pathMatch: 'full' },
  { path: '**', redirectTo: 'world-map' }
];
