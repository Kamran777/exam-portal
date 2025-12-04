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
import { Student } from '@core/models/student';
import { CreateModalComponent } from '@shared/create-modal/create-modal.component';

@Component({
  selector: 'app-student-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CreateModalComponent],
  templateUrl: './student-create-modal.component.html',
  styleUrls: ['./student-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCreateModalComponent implements OnInit {
  @Input() visible = false;
  @Input() currentStudents: Student[] = [];
  @Input() savedStudents: Student[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<Student>();

  form!: FormGroup;
  errorMessage: string | null = null;
  private initialFormValues: any = {};
  private readonly ERROR_MESSAGES = {
    numberExists: 'Bu şagird nömrəsi artıq mövcuddur!',
  };

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

    if (this.isDuplicateNumber(value.number)) {
      this.errorMessage = this.ERROR_MESSAGES.numberExists;
      return;
    }

    // if (this.isDuplicateStudent(value)) {
    //   this.errorMessage = this.ERROR_MESSAGES.duplicateStudent;
    //   return;
    // }

    const student: Student = {
      id: crypto.randomUUID(),
      number: +value.number,
      firstName: value.firstName,
      lastName: value.lastName,
      grade: +value.grade,
    };

    this.created.emit(student);
    this.closeModal();
  }

  private createForm(): void {
    this.form = this.fb.group({
      number: [null, [Validators.required, Validators.min(1), Validators.max(99999)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      grade: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
    });
  }

  private isDuplicateNumber(valueNumber: number): boolean {
    return [...this.currentStudents, ...this.savedStudents].some(
      (student) => student.number === valueNumber
    );
  }

  // private isDuplicateStudent(value: any): boolean {
  //   return [...this.currentStudents, ...this.savedStudents].some(
  //     (student) =>
  //       student.number === Number(value.number) &&
  //       student.firstName.toLowerCase() === value.firstName.toLowerCase() &&
  //       student.lastName.toLowerCase() === value.lastName.toLowerCase() &&
  //       student.grade === Number(value.grade)
  //   );
  // }
}
