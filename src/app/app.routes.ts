import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      {
        path: 'tasks/new',
        loadComponent: () =>
          import('./components/task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
      {
        path: 'tasks/edit/:id',
        loadComponent: () =>
          import('./components/task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('./components/task-stats/task-stats.component').then(
            (m) => m.TaskStatsComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
