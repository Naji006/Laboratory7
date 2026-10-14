import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'student-directory',
    loadComponent: () => import('./pages/student-directory/student-directory.page').then( m => m.StudentDirectoryPage)
  },
  {
    path: 'update-profile',
    loadComponent: () => import('./pages/update-profile/update-profile.page').then( m => m.UpdateProfilePage)
  },
];
