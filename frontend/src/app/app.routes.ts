import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { DashboardComponent } from './components/user/dashboard/dashboard';
import { ProfileComponent } from './components/user/profile/profile';
import { PlacementTestComponent } from './components/user/placement-test/placement-test';
import { StudyComponent } from './components/user/study/study';
import { WordBattleComponent } from './components/user/word-battle/word-battle';
import { AiDocumentLearningComponent } from './components/user/ai-document-learning/ai-document-learning';
import { CharacterCustomizationComponent } from './components/user/character-customization/character-customization';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminRoadmapComponent } from './components/admin/admin-roadmap/admin-roadmap';

// New Imports
import { VocabularyComponent } from './components/user/vocabulary/vocabulary';
import { VocabularyStudyComponent } from './components/user/vocabulary/vocabulary-study';
import { ListeningComponent } from './components/user/listening/listening';
import { ListeningStudyComponent } from './components/user/listening/listening-study';
import { ReadingComponent } from './components/user/reading/reading';
import { ReadingStudyComponent } from './components/user/reading/reading-study';
import { ExamsComponent } from './components/user/exams/exams';
import { GrammarTopicsComponent } from './components/user/grammar-topics/grammar-topics';
import { GrammarStudyComponent } from './components/user/grammar/grammar-study';
import { ProgressComponent } from './components/user/progress/progress';
import { MyVocabularyComponent } from './components/user/my-vocabulary/my-vocabulary';
import { CommunityComponent } from './components/user/community/community';
import { IntroComponent } from './components/user/intro/intro';
import { ShopComponent } from './components/user/shop/shop';
import { PresetRoadmapDetailComponent } from './components/user/preset-roadmap-detail/preset-roadmap-detail';
import { ClassroomComponent } from './components/user/classroom/classroom';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'character-customization', component: CharacterCustomizationComponent, canActivate: [authGuard] },
  { path: 'placement-test', component: PlacementTestComponent, canActivate: [authGuard] },
  { path: 'study/:moduleId', component: StudyComponent, canActivate: [authGuard] },
  { path: 'word-battle/:moduleId', component: WordBattleComponent, canActivate: [authGuard] },
  { path: 'document-learning', component: AiDocumentLearningComponent, canActivate: [authGuard] },
  { path: 'shop', component: ShopComponent, canActivate: [authGuard] },
  
  // New paths
  { path: 'vocabulary', component: VocabularyComponent, canActivate: [authGuard] },
  { path: 'vocabulary-study/:topicId', component: VocabularyStudyComponent, canActivate: [authGuard] },
  { path: 'listening', component: ListeningComponent, canActivate: [authGuard] },
  { path: 'listening-study/:topicId', component: ListeningStudyComponent, canActivate: [authGuard] },
  { path: 'reading', component: ReadingComponent, canActivate: [authGuard] },
  { path: 'reading-study/:id', component: ReadingStudyComponent, canActivate: [authGuard] },
  { path: 'exams', component: ExamsComponent, canActivate: [authGuard] },
  { path: 'grammar-topics', component: GrammarTopicsComponent, canActivate: [authGuard] },
  { path: 'grammar-study/:lessonId', component: GrammarStudyComponent, canActivate: [authGuard] },
  { path: 'progress', component: ProgressComponent, canActivate: [authGuard] },
  { path: 'my-vocabulary', component: MyVocabularyComponent, canActivate: [authGuard] },
  { path: 'community', component: CommunityComponent, canActivate: [authGuard] },
  { path: 'preset-roadmap/:id', component: PresetRoadmapDetailComponent, canActivate: [authGuard] },
  { path: 'classroom', component: ClassroomComponent, canActivate: [authGuard] },
  { path: 'admin-roadmap', component: AdminRoadmapComponent, canActivate: [adminGuard] },

  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: '**', redirectTo: 'intro' }
];

