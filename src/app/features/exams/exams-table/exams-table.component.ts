import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  signal,
  computed,
  DestroyRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Exam } from '@core/models/exam';
import { Lesson } from '@core/models/lesson';
import { Student } from '@core/models/student';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-exams-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exams-table.component.html',
  styleUrls: ['./exams-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamsTableComponent implements OnInit {
  @Input({ required: true }) exams$!: Observable<Exam[]>;
  @Input({ required: true }) lessons$!: Observable<Lesson[]>;
  @Input({ required: true }) students$!: Observable<Student[]>;

  @ViewChild('modalContainer', { read: ViewContainerRef, static: true })
  modalContainer!: ViewContainerRef;

  private examToDeleteId: string | null = null;

  readonly pageSize = 4;
  readonly exams = signal<Exam[]>([]);
  readonly lessons = signal<Lesson[]>([]);
  readonly students = signal<Student[]>([]);
  readonly filterText = signal('');
  readonly page = signal(1);
  readonly sortState = signal<{ col: string | null; dir: 'asc' | 'desc' | null }>({
    col: 'date',
    dir: 'desc',
  });

  constructor(private readonly destroyRef: DestroyRef, private storage: StorageService) {}

  ngOnInit(): void {
    this.bindInputs();
  }

  readonly mergedRows = computed(() => this.mergeRows());
  readonly filteredRows = computed(() => this.filterRows(this.mergedRows()));
  readonly sortedRows = computed(() => this.sortRows(this.filteredRows()));
  readonly vm = computed(() => this.paginate(this.sortedRows()));

  updateFilter(value: string): void {
    this.filterText.set(value);
    this.page.set(1);
  }

  changeSort(col: string): void {
    const current = this.sortState();
    const nextDir =
      current.col !== col
        ? 'asc'
        : current.dir === 'asc'
        ? 'desc'
        : current.dir === 'desc'
        ? null
        : 'asc';
    this.sortState.set({ col, dir: nextDir });
  }

  getSortDir(col: string): 'asc' | 'desc' | null {
    return this.sortState().col === col ? this.sortState().dir : null;
  }

  goToPage(page: number): void {
    this.page.set(page);
  }

  async openDeleteModal(examId: string): Promise<void> {
    this.examToDeleteId = examId;

    const { DeleteModalComponent } = await import('@shared/delete-modal/delete-modal.component');

    this.modalContainer.clear();
    const compRef = this.modalContainer.createComponent(DeleteModalComponent);
    compRef.instance.visible = true;

    compRef.instance.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.modalContainer.clear();
      this.examToDeleteId = null;
    });

    compRef.instance.confirmed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.examToDeleteId) {
        this.storage.delete('exams', this.examToDeleteId);
        this.exams.update((current: Exam[]) =>
          current.filter((exam: Exam) => exam.id !== this.examToDeleteId)
        );
      }
      this.modalContainer.clear();
    });
  }

  private bindInputs(): void {
    combineLatest([this.exams$, this.lessons$, this.students$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([exams, lessons, students]) => {
        this.exams.set(exams ?? []);
        this.lessons.set(lessons ?? []);
        this.students.set(students ?? []);
      });
  }

  private mergeRows() {
    const exams = this.exams();
    const lessons = this.lessons();
    const students = this.students();

    return exams.map((exam: Exam) => {
      const lesson = lessons.find((lesson: Lesson) => lesson.code === exam.lessonCode);
      const student = students.find(
        (student: Student) => student.number === Number(exam.studentNumber)
      );
      return {
        ...exam,
        lessonName: lesson?.name ?? exam.lessonCode,
        lessonGrade: lesson?.grade ?? null,
        studentName: student ? `${student.firstName} ${student.lastName}` : exam.studentNumber,
      };
    });
  }

  private filterRows(rows: any[]): any[] {
    const query = this.filterText().toLowerCase().trim();
    if (!query) return rows;

    return rows.filter((row) =>
      `${row.lessonName} ${row.lessonCode} ${row.studentName} ${row.studentNumber}`
        .toLowerCase()
        .includes(query)
    );
  }

  private sortRows(rows: any[]) {
    const { col, dir } = this.sortState();
    if (!col || !dir) return rows;

    return [...rows].sort((a, b) => {
      const A = a[col];
      const B = b[col];
      const compare = typeof A === 'string' ? A.localeCompare(B) : Number(A) - Number(B);
      return dir === 'asc' ? compare : -compare;
    });
  }

  private paginate(rows: any[]) {
    const page = this.page();
    const from = (page - 1) * this.pageSize;
    const to = Math.min(from + this.pageSize, rows.length);

    return {
      rows: rows.slice(from, to),
      total: rows.length,
      page,
      pageSize: this.pageSize,
      totalPages: Math.ceil(rows.length / this.pageSize),
    };
  }
}
