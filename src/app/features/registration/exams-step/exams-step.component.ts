import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
  DestroyRef,
} from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Exam } from '@core/models/exam';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { StateService } from '@core/services/state.service';
import { EXAM_STATE, LESSON_STATE, STUDENT_STATE } from '@core/state/state.token';
import { TableComponent } from '@shared/table/table.component';
import { EXAM_COLUMNS } from '@shared/constants/exam.constants';

@Component({
  selector: 'app-exams-step',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './exams-step.component.html',
  styleUrls: ['./exams-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamsStepComponent implements OnInit {
  exams$!: Observable<Exam[]>;
  lessons$!: Observable<Lesson[]>;
  students$!: Observable<Student[]>;
  examRows$!: Observable<any[]>;

  @ViewChild('modalContainer', { read: ViewContainerRef, static: true })
  modalContainer!: ViewContainerRef;
  examColumns = EXAM_COLUMNS;

  private examId: string | null = null;

  constructor(
    @Inject(EXAM_STATE) private examsState: StateService<Exam>,
    @Inject(LESSON_STATE) private lessonsState: StateService<Lesson>,
    @Inject(STUDENT_STATE) private studentsState: StateService<Student>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.prepareExamRows();
  }

  handleAction(event: any): void {
    if (event.type === 'delete') {
      this.openDeleteModal(event.row.id);
    }
  }

  async openModal(): Promise<void> {
    const { ExamCreateModalComponent } = await import(
      '../modals/exam-create-modal/exam-create-modal.component'
    );

    this.modalContainer.clear();
    const modalRef = this.modalContainer.createComponent(ExamCreateModalComponent);

    modalRef.instance.visible = true;

    modalRef.instance.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      modalRef.destroy();
    });

    modalRef.instance.created.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((exam: Exam) => {
      this.examsState.add(exam);
      modalRef.destroy();
    });
  }

  private loadData(): void {
    this.exams$ = this.examsState.data$;
    this.lessons$ = this.lessonsState.data$;
    this.students$ = this.studentsState.data$;
  }

  private prepareExamRows(): void {
    this.examRows$ = combineLatest([this.exams$, this.lessons$, this.students$]).pipe(
      takeUntilDestroyed(this.destroyRef),
      map(([exams, lessons, students]) =>
        exams.map((exam: Exam) => ({
          ...exam,
          lessonCode:
            lessons.find((lesson) => lesson.code === exam.lessonCode)?.name ?? exam.lessonCode,
          studentNumber: students.find(
            (student: Student) => student.number === Number(exam.studentNumber)
          )
            ? `${
                students.find((student: Student) => student.number === Number(exam.studentNumber))!
                  .firstName
              } ${
                students.find((student: Student) => student.number === Number(exam.studentNumber))!
                  .lastName
              }`
            : exam.studentNumber,
        }))
      )
    );
  }

  private async openDeleteModal(examId: string): Promise<void> {
    this.examId = examId;

    const { DeleteModalComponent } = await import('@shared/delete-modal/delete-modal.component');
    this.modalContainer.clear();

    const modalRef = this.modalContainer.createComponent(DeleteModalComponent);
    modalRef.instance.visible = true;

    modalRef.instance.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      modalRef.destroy();
      this.examId = null;
    });

    modalRef.instance.confirmed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.examId) this.examsState.delete(this.examId);
      modalRef.destroy();
      this.examId = null;
    });
  }
}
