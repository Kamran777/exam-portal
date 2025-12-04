import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '@core/models/student';
import { StateService } from '@core/services/state.service';
import { StorageService } from '@core/services/storage.service';
import { STUDENT_STATE } from '@core/state/state.token';
import { DeleteModalComponent } from '@shared/delete-modal/delete-modal.component';
import { StudentCreateModalComponent } from '../modals/student-create-modal/student-create-modal.component';
import { StudentsListModalComponent } from '../modals/students-list-modal/students-list-modal.component';
import { TableComponent } from '@shared/table/table.component';
import { TableColumn } from '@shared/table/table.types';

@Component({
  selector: 'app-students-step',
  imports: [
    CommonModule,
    StudentCreateModalComponent,
    DeleteModalComponent,
    StudentsListModalComponent,
    TableComponent,
  ],
  templateUrl: './students-step.component.html',
  styleUrls: ['./students-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsStepComponent implements OnInit {
  currentStudents$!: Observable<Student[]>;
  savedStudents$!: Observable<Student[]>;
  showModal = false;
  deleteModalVisible = false;
  showStudentListModal = false;
  studentColumns: TableColumn<Student>[] = [
    { key: 'number', label: 'Nömrə', sortable: true },
    { key: 'firstName', label: 'Ad', sortable: true },
    { key: 'lastName', label: 'Soyad', sortable: true },
    { key: 'grade', label: 'Sinif', sortable: true },
  ] as const;

  private studentId: string | null = null;

  constructor(
    @Inject(STUDENT_STATE) private state: StateService<Student>,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  handleAction(e: any): void {
    if (e.type === 'delete') {
      this.openDeleteModal(e.row.id);
    }
  }

  openStudentsList(): void {
    this.showStudentListModal = true;
  }

  openCreate(): void {
    this.showModal = true;
  }

  onCreated(student: Student): void {
    this.state.add(student);
    this.showModal = false;
  }

  confirmDelete(): void {
    if (this.studentId) {
      this.state.delete(this.studentId);
      this.closeDeleteModal();
    }
  }

  closeDeleteModal(): void {
    this.deleteModalVisible = false;
    this.studentId = null;
  }

  private loadStudents(): void {
    this.currentStudents$ = this.state.data$;
    this.savedStudents$ = of(this.storage.get<Student>('students'));
  }

  private openDeleteModal(studentId: string): void {
    this.studentId = studentId;
    this.deleteModalVisible = true;
  }
}
