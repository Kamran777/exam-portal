import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Lesson } from '@core/models/lesson';
import { StateService } from '@core/services/state.service';
import { StorageService } from '@core/services/storage.service';
import { LESSON_STATE } from '@core/state/state.token';
import { TableComponent } from '@shared/table/table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LESSON_COLUMNS } from '@shared/constants/lesson.constants';

@Component({
  selector: 'app-subjects-step',
  imports: [CommonModule, TableComponent],
  templateUrl: './lessons-step.component.html',
  styleUrls: ['./lessons-step.component.scss'],
})
export class LessonsStepComponent implements OnInit {
  currentLessons$!: Observable<Lesson[]>;
  savedLessons$!: Observable<Lesson[]>;
  showModal = false;
  showLessonListModal = false;
  deleteModalVisible = false;
  lessonColumns = LESSON_COLUMNS;

  private lessonId: string | null = null;

  @ViewChild('modalContainer', { read: ViewContainerRef, static: true })
  modalContainer!: ViewContainerRef;

  constructor(
    @Inject(LESSON_STATE) private state: StateService<Lesson>,
    private storage: StorageService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  handleAction(e: any): void {
    if (e.type === 'delete') {
      this.openDeleteModal(e.row.id);
    }
  }

  async openCreateModal(): Promise<void> {
    const { LessonCreateModalComponent } = await import(
      '../modals/lesson-create-modal/lesson-create-modal.component'
    );

    this.modalContainer.clear();
    const compRef = this.modalContainer.createComponent(LessonCreateModalComponent);

    compRef.instance.visible = true;

    const currentLessons = await firstValueFrom(this.currentLessons$);
    const savedLessons = await firstValueFrom(this.savedLessons$);

    compRef.instance.currentLessons = currentLessons ?? [];
    compRef.instance.savedLessons = savedLessons ?? [];

    compRef.instance.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.modalContainer.clear();
    });

    compRef.instance.created
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lesson: Lesson) => {
        this.state.add(lesson);
        this.modalContainer.clear();
      });
  }

  async openLessonsList(): Promise<void> {
    const { LessonsListModalComponent } = await import(
      '../modals/lessons-list-modal/lessons-list-modal.component'
    );

    this.modalContainer.clear();
    const compRef = this.modalContainer.createComponent(LessonsListModalComponent);

    compRef.instance.visible = true;

    const currentLessons = await firstValueFrom(this.currentLessons$);
    const savedLessons = await firstValueFrom(this.savedLessons$);

    compRef.instance.currentLessons = currentLessons ?? [];
    compRef.instance.savedLessons = savedLessons ?? [];

    compRef.instance.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.modalContainer.clear());
  }

  private async openDeleteModal(lessonId: string): Promise<void> {
    this.lessonId = lessonId;

    const { DeleteModalComponent } = await import('@shared/delete-modal/delete-modal.component');

    this.modalContainer.clear();
    const compRef = this.modalContainer.createComponent(DeleteModalComponent);

    compRef.instance.visible = true;

    compRef.instance.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.modalContainer.clear();
      this.lessonId = null;
    });

    compRef.instance.confirmed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.lessonId) {
        this.state.delete(this.lessonId);
      }
      this.modalContainer.clear();
    });
  }

  private loadLessons(): void {
    this.currentLessons$ = this.state.data$;
    this.savedLessons$ = of(this.storage.get<Lesson>('lessons'));
  }
}
