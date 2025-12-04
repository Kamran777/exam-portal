import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'exams',
    loadComponent: () =>
      import('./features/exams/exams-shell/exams-shell.component').then(
        (m) => m.ExamsShellComponent
      ),
  },
  {
    path: 'lessons',
    loadComponent: () =>
      import('./features/lessons/lessons.component').then((m) => m.LessonsComponent),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./features/students/students.component').then((m) => m.StudentsComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/registration/registration-wizard/registration-wizard.component').then(
        (m) => m.RegistrationWizardComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'register',
  },
];
