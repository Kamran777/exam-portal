import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LessonsStepComponent } from '../lessons-step/lessons-step.component';
import { StudentsStepComponent } from '../students-step/students-step.component';
import { ExamsStepComponent } from '../exams-step/exams-step.component';
import { StateService } from '@core/services/state.service';
import { StorageService } from '@core/services/storage.service';
import { EXAM_STATE, LESSON_STATE, STUDENT_STATE } from '@core/state/state.token';
import { Exam } from '@core/models/exam';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { REGISTRATION_STEPS } from '@shared/constants/registration.constants';

interface WizardViewModel {
  lessons: Lesson[];
  students: Student[];
  exams: Exam[];
  lessonsCount: number;
  studentsCount: number;
  examsCount: number;
}

@Component({
  selector: 'app-registration-wizard',
  imports: [
    CommonModule,
    RouterModule,
    LessonsStepComponent,
    StudentsStepComponent,
    ExamsStepComponent,
  ],
  templateUrl: './registration-wizard.component.html',
  styleUrls: ['./registration-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationWizardComponent implements OnInit {
  step = 1;
  readonly totalSteps = REGISTRATION_STEPS.length;
  readonly steps = REGISTRATION_STEPS;

  lessons$!: Observable<Lesson[]>;
  students$!: Observable<Student[]>;
  exams$!: Observable<Exam[]>;
  vm$!: Observable<WizardViewModel>;

  constructor(
    private readonly router: Router,
    @Inject(LESSON_STATE) private lessonsState: StateService<Lesson>,
    @Inject(STUDENT_STATE) private studentsState: StateService<Student>,
    @Inject(EXAM_STATE) private examsState: StateService<Exam>,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  next(): void {
    if (this.step < this.totalSteps) this.step++;
  }

  prev(): void {
    if (this.step > 1) this.step--;
  }

  canNext(vm: WizardViewModel): boolean {
    const stepRequirements: Record<number, boolean> = {
      1: vm.lessonsCount > 0,
      2: vm.studentsCount > 0,
      3: true,
    };
    return stepRequirements[this.step] ?? false;
  }

  confirm(): void {
    this.vm$.pipe(take(1)).subscribe((vm: WizardViewModel) => {
      this.storage.save('lessons', vm.lessons);
      this.storage.save('students', vm.students);
      this.storage.save('exams', vm.exams);
      alert('Məlumatlar saxlanıldı!');
      this.router.navigate(['/exams']);
    });
  }

  canConfirm(vm: WizardViewModel): boolean {
    return this.examsState.value.length > 0;
  }

  cancel(): void {
    this.examsState.clear();
    this.lessonsState.clear();
    this.studentsState.clear();
    this.router.navigate(['/exams']);
  }

  progressPercent(): number {
    return (this.step / this.totalSteps) * 100;
  }

  private loadInitialData(): void {
    const subjectLessons$ = this.lessonsState.data$;
    const subjectStudents$ = this.studentsState.data$;
    const subjectExams$ = this.examsState.data$;

    const storageLessons = this.storage.get<Lesson>('lessons') || [];
    const storageStudents = this.storage.get<Student>('students') || [];
    const storageExams = this.storage.get<Exam>('exams') || [];

    this.vm$ = combineLatest([subjectLessons$, subjectStudents$, subjectExams$]).pipe(
      map(([lessons, students, exams]) => ({
        lessons: this.mergeById(storageLessons, lessons),
        students: this.mergeById(storageStudents, students),
        exams: this.mergeById(storageExams, exams),
      })),
      map((data) => ({
        ...data,
        lessonsCount: data.lessons.length,
        studentsCount: data.students.length,
        examsCount: data.exams.length,
      }))
    );
  }

  private mergeById<T extends { id: string }>(storageItems: T[], stateItems: T[]): T[] {
    const map = new Map<string, T>();
    [...storageItems, ...stateItems].forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
  }
}
