import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { Exam } from '@core/models/exam';
import { StorageService } from '@core/services/storage.service';
import { StateService } from '@core/services/state.service';
import { LESSON_STATE, STUDENT_STATE } from '@core/state/state.token';
import { CreateModalComponent } from '@shared/create-modal/create-modal.component';

@Component({
  selector: 'app-exam-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CreateModalComponent],
  templateUrl: './exam-create-modal.component.html',
  styleUrls: ['./exam-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCreateModalComponent implements OnInit {
  @Input() visible = false;
  @Input() lessons: Lesson[] | null = [];
  @Input() students: Student[] | null = [];
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<Exam>();

  form: any;
  private initialFormValues: any = {};

  constructor(
    @Inject(LESSON_STATE) private lessonsState: StateService<Lesson>,
    @Inject(STUDENT_STATE) private studentsState: StateService<Student>,
    private fb: FormBuilder,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.lessons = this.mergeLessons();
    this.students = this.mergeStudents();
    this.createForm();
    this.initialFormValues = this.form.getRawValue();
  }

  closeModal(): void {
    this.visible = false;
    this.closed.emit();
    this.form.reset(this.initialFormValues);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const exam: Exam = {
      id: crypto.randomUUID(),
      lessonCode: value.lessonCode,
      studentNumber: value.studentNumber,
      date: new Date(value.date).toISOString().split('T')[0],
      score: Number(value.score),
    };
    this.created.emit(exam);
    this.closeModal();
  }

  createForm(): void {
    this.form = this.fb.nonNullable.group({
      lessonCode: ['', Validators.required],
      studentNumber: ['', Validators.required],
      date: ['', Validators.required],
      score: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  private mergeLessons(): Lesson[] {
    const storageLessons = this.storage.get<Lesson>('lessons');
    const subjectLessons = this.lessonsState.value;
    return this.mergeUnique(storageLessons, subjectLessons);
  }

  private mergeStudents(): Student[] {
    const storageStudents = this.storage.get<Student>('students');
    const subjectStudents = this.studentsState.value;
    return this.mergeUnique(storageStudents, subjectStudents);
  }

  private mergeUnique<T extends { id: string | number }>(storageData: T[], stateData: T[]): T[] {
    const map = new Map<string | number, T>();
    [...storageData, ...stateData].forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
  }
}
