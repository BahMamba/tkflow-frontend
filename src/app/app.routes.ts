import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'tasks',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./components/task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
    ],
  },

  {
    path: 'stats',
    loadComponent: () =>
    import('./components/task-stats/task-stats.component').then(m => m.TaskStatsComponent),
    canActivate: [AuthGuard],
  },


  { path: '**', redirectTo: '/login' },
];
