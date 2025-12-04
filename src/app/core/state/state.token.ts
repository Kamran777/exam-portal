import { InjectionToken } from '@angular/core';
import { Lesson } from '../models/lesson';
import { Student } from '../models/student';
import { Exam } from '../models/exam';
import { StateService } from '@core/services/state.service';

export const LESSON_STATE = new InjectionToken<StateService<Lesson>>('LESSON_STATE');
export const STUDENT_STATE = new InjectionToken<StateService<Student>>('STUDENT_STATE');
export const EXAM_STATE = new InjectionToken<StateService<Exam>>('EXAM_STATE');
