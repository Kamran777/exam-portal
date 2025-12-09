import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Lesson } from '@core/models/lesson';
import { CreateModalComponent } from '@shared/create-modal/create-modal.component';

@Component({
  selector: 'app-lesson-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CreateModalComponent],
  templateUrl: './lesson-create-modal.component.html',
  styleUrls: ['./lesson-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonCreateModalComponent implements OnInit {
  @Input() visible = false;
  @Input() currentLessons: Lesson[] = [];
  @Input() savedLessons: Lesson[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<Lesson>();

  form!: FormGroup;
  errorMessage: string | null = null;
  private initialFormValues!: ReturnType<typeof this.form.getRawValue>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.initialFormValues = this.form.getRawValue();
  }

  closeModal(): void {
    this.visible = false;
    this.closed.emit();
    this.form.reset(this.initialFormValues);
    this.errorMessage = null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    if (this.isDuplicateLesson(value)) {
      this.errorMessage = 'Bu dərs, sinif və müəllim kombinasiyası artıq mövcuddur!';
      return;
    }

    const lesson: Lesson = {
      id: crypto.randomUUID(),
      code: value.code,
      name: value.name,
      grade: Number(value.grade),
      teacherFirstName: value.teacherFirstName,
      teacherLastName: value.teacherLastName,
    };

    this.created.emit(lesson);
    this.closeModal();
  }

  private createForm(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      grade: [null, [Validators.required, Validators.min(1), Validators.max(11)]],
      teacherFirstName: ['', [Validators.required, Validators.maxLength(20)]],
      teacherLastName: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

  private isDuplicateLesson(value: any): boolean {
    const allLessons = [...this.currentLessons, ...this.savedLessons];
    return allLessons.some(
      (lesson: Lesson) =>
        lesson.name.toLowerCase() === value.name.toLowerCase() &&
        lesson.grade === Number(value.grade) &&
        lesson.teacherFirstName.toLowerCase() === value.teacherFirstName.toLowerCase() &&
        lesson.teacherLastName.toLowerCase() === value.teacherLastName.toLowerCase()
    );
  }
}
