import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Lesson } from '@core/models/lesson';
import { StateService } from '@core/services/state.service';
import { StorageService } from '@core/services/storage.service';
import { LESSON_STATE } from '@core/state/state.token';
import { DeleteModalComponent } from '@shared/delete-modal/delete-modal.component';
import { LessonsListModalComponent } from '../modals/lessons-list-modal/lessons-list-modal.component';
import { LessonCreateModalComponent } from '../modals/lesson-create-modal/lesson-create-modal.component';
import { TableComponent } from '@shared/table/table.component';
import { TableColumn } from '@shared/table/table.types';

@Component({
  selector: 'app-subjects-step',
  imports: [
    CommonModule,
    LessonCreateModalComponent,
    DeleteModalComponent,
    LessonsListModalComponent,
    TableComponent,
  ],
  templateUrl: './lessons-step.component.html',
  styleUrls: ['./lessons-step.component.scss'],
})
export class LessonsStepComponent implements OnInit {
  currentLessons$!: Observable<Lesson[]>;
  savedLessons$!: Observable<Lesson[]>;
  showModal = false;
  showLessonListModal = false;
  deleteModalVisible = false;
  lessonColumns: TableColumn<Lesson>[] = [
    { key: 'code', label: 'Kod', sortable: true },
    { key: 'name', label: 'Ad', sortable: true },
    { key: 'grade', label: 'Sinif', sortable: true },
    {
      key: 'teacherFirstName',
      label: 'Müəllim',
      sortable: false,
      cell: (r) => `${r.teacherFirstName} ${r.teacherLastName}`,
    },
  ] as const;

  private lessonId: string | null = null;

  constructor(
    @Inject(LESSON_STATE) private state: StateService<Lesson>,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  handleAction(e: any): void {
    if (e.type === 'delete') {
      this.openDeleteModal(e.row.id);
    }
  }

  confirmDelete(): void {
    if (this.lessonId) {
      this.state.delete(this.lessonId);
      this.closeDeleteModal();
    }
  }

  closeDeleteModal(): void {
    this.deleteModalVisible = false;
    this.lessonId = null;
  }

  onCreated(lesson: Lesson): void {
    this.state.add(lesson);
    this.cdr.detectChanges();
    this.showModal = false;
  }

  openCreateModal(): void {
    this.showModal = true;
  }

  openLessonsList(): void {
    this.showLessonListModal = true;
  }

  private openDeleteModal(lessonId: string): void {
    this.lessonId = lessonId;
    this.deleteModalVisible = true;
  }

  private loadLessons(): void {
    this.currentLessons$ = this.state.data$;
    this.savedLessons$ = of(this.storage.get<Lesson>('lessons'));
  }
}
