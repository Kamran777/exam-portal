import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Student } from '@core/models/student';
import { StateService } from '@core/services/state.service';
import { StorageService } from '@core/services/storage.service';
import { STUDENT_STATE } from '@core/state/state.token';
import { TableComponent } from '@shared/table/table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { STUDENT_COLUMNS } from '@shared/constants/student.constants';

@Component({
  selector: 'app-students-step',
  imports: [CommonModule, TableComponent],
  templateUrl: './students-step.component.html',
  styleUrls: ['./students-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsStepComponent implements OnInit {
  currentStudents$!: Observable<Student[]>;
  savedStudents$!: Observable<Student[]>;
  studentColumns = STUDENT_COLUMNS;

  @ViewChild('modalContainer', { read: ViewContainerRef, static: true })
  modalContainer!: ViewContainerRef;

  private studentId: string | null = null;

  constructor(
    @Inject(STUDENT_STATE) private state: StateService<Student>,
    private storage: StorageService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  handleAction(e: any): void {
    if (e.type === 'delete') {
      this.openDeleteModal(e.row.id);
    }
  }

  async openCreate(): Promise<void> {
    const { StudentCreateModalComponent } = await import(
      '../modals/student-create-modal/student-create-modal.component'
    );

    this.modalContainer.clear();
    const compRef = this.modalContainer.createComponent(StudentCreateModalComponent);

    compRef.instance.visible = true;

    const currentStudents = await firstValueFrom(this.currentStudents$);
    const savedStudents = await firstValueFrom(this.savedStudents$);

    compRef.instance.currentStudents = currentStudents ?? [];
    compRef.instance.savedStudents = savedStudents ?? [];

    compRef.instance.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.modalContainer.clear();
    });

    compRef.instance.created
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((student: Student) => {
        this.state.add(student);
        this.modalContainer.clear();
      });
  }

  async openStudentsList(): Promise<void> {
    const { StudentsListModalComponent } = await import(
      '../modals/students-list-modal/students-list-modal.component'
    );

    this.modalContainer.clear();
    const compRef = this.modalContainer.createComponent(StudentsListModalComponent);

    compRef.instance.visible = true;

    const currentStudents = await firstValueFrom(this.currentStudents$);
    const savedStudents = await firstValueFrom(this.savedStudents$);

    compRef.instance.currentStudents = currentStudents ?? [];
    compRef.instance.savedStudents = savedStudents ?? [];

    compRef.instance.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.modalContainer.clear());
  }

  private async openDeleteModal(studentId: string): Promise<void> {
    this.studentId = studentId;

    const { DeleteModalComponent } = await import('@shared/delete-modal/delete-modal.component');

    this.modalContainer.clear();
    const compRef = this.modalContainer.createComponent(DeleteModalComponent);

    compRef.instance.visible = true;

    compRef.instance.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.modalContainer.clear();
      this.studentId = null;
    });

    compRef.instance.confirmed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.studentId) {
        this.state.delete(this.studentId);
      }
      this.modalContainer.clear();
    });
  }

  private loadStudents(): void {
    this.currentStudents$ = this.state.data$;
    this.savedStudents$ = of(this.storage.get<Student>('students'));
  }
}
