import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { ApiService } from './services/api';
const authenticated: CanActivateFn = () =>
  inject(ApiService).authenticated || inject(Router).createUrlTree(['/login']);
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'student-directory',
    canActivate: [authenticated],
    loadComponent: () =>
      import('./pages/student-directory/student-directory.page').then(
        (m) => m.StudentDirectoryPage,
      ),
  },
  {
    path: 'update-profile',
    canActivate: [authenticated],
    loadComponent: () =>
      import('./pages/update-profile/update-profile.page').then(
        (m) => m.UpdateProfilePage,
      ),
  },
  { path: '**', redirectTo: 'login' },
];
