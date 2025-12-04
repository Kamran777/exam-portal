import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { EXAM_STATE, LESSON_STATE, STUDENT_STATE } from '@core/state/state.token';
import { StateService } from '@core/services/state.service';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { Exam } from '@core/models/exam';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: LESSON_STATE,
      useFactory: () => new StateService<Lesson>(),
    },
    {
      provide: STUDENT_STATE,
      useFactory: () => new StateService<Student>(),
    },
    {
      provide: EXAM_STATE,
      useFactory: () => new StateService<Exam>(),
    },
  ],
};
