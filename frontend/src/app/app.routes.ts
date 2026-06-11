import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProfileComponent } from './components/profile/profile';
import { PlacementTestComponent } from './components/placement-test/placement-test';
import { StudyComponent } from './components/study/study';
import { WordBattleComponent } from './components/word-battle/word-battle';
import { AiDocumentLearningComponent } from './components/ai-document-learning/ai-document-learning';
import { CharacterCustomizationComponent } from './components/character-customization/character-customization';
import { authGuard } from './guards/auth.guard';

// New Imports
import { VocabularyComponent } from './components/vocabulary/vocabulary';
import { VocabularyStudyComponent } from './components/vocabulary/vocabulary-study';
import { ListeningComponent } from './components/listening/listening';
import { ListeningStudyComponent } from './components/listening/listening-study';
import { ReadingComponent } from './components/reading/reading';
import { ReadingStudyComponent } from './components/reading/reading-study';
import { ExamsComponent } from './components/exams/exams';
import { GrammarTopicsComponent } from './components/grammar-topics/grammar-topics';
import { GrammarStudyComponent } from './components/grammar/grammar-study';
import { ProgressComponent } from './components/progress/progress';
import { MyVocabularyComponent } from './components/my-vocabulary/my-vocabulary';
import { CommunityComponent } from './components/community/community';
import { IntroComponent } from './components/intro/intro';
import { ShopComponent } from './components/shop/shop';
import { PresetRoadmapDetailComponent } from './components/preset-roadmap-detail/preset-roadmap-detail';
import { ClassroomComponent } from './components/classroom/classroom';

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

  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: '**', redirectTo: 'intro' }
];

