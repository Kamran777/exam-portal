import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '@core/models/exam';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { StateService } from '@core/services/state.service';
import { EXAM_STATE, LESSON_STATE, STUDENT_STATE } from '@core/state/state.token';
import { ExamCreateModalComponent } from '../modals/exam-create-modal/exam-create-modal.component';
import { TableColumn } from '@shared/table/table.types';
import { TableComponent } from '@shared/table/table.component';
import { DeleteModalComponent } from '@shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-exams-step',
  imports: [CommonModule, ExamCreateModalComponent, TableComponent, DeleteModalComponent],
  templateUrl: './exams-step.component.html',
  styleUrls: ['./exams-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamsStepComponent implements OnInit {
  exams$!: Observable<Exam[]>;
  lessons$!: Observable<Lesson[]>;
  students$!: Observable<Student[]>;
  showModal = false;
  deleteModalVisible = false;

  private examId: string | null = null;

  examColumns: TableColumn<Exam>[] = [
    { key: 'lessonCode', label: 'Dərs', sortable: true },
    { key: 'studentNumber', label: 'Şagird', sortable: true },
    { key: 'score', label: 'Qiymət', sortable: true },
    { key: 'date', label: 'Tarix', sortable: true },
  ] as const;

  constructor(
    @Inject(EXAM_STATE) private examsState: StateService<Exam>,
    @Inject(LESSON_STATE) private lessonsState: StateService<Lesson>,
    @Inject(STUDENT_STATE) private studentsState: StateService<Student>
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  openModal(): void {
    this.showModal = true;
  }

  handleAction(e: any): void {
    if (e.type === 'delete') {
      this.openDeleteModal(e.row.id);
    }
  }

  confirmDelete(): void {
    if (this.examId) {
      this.examsState.delete(this.examId);
      this.closeDeleteModal();
    }
  }

  closeDeleteModal(): void {
    this.deleteModalVisible = false;
    this.examId = null;
  }

  onCreated(exam: Exam): void {
    this.examsState.add(exam);
    this.showModal = false;
  }

  private loadInitialData(): void {
    this.exams$ = this.examsState.data$;
    this.lessons$ = this.lessonsState.data$;
    this.students$ = this.studentsState.data$;
  }

  private openDeleteModal(examId: string): void {
    this.examId = examId;
    this.deleteModalVisible = true;
  }
}
