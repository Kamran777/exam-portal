import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Lesson } from '@core/models/lesson';
import { ListModalComponent } from '@shared/list-modal/list-modal.component';

@Component({
  selector: 'app-lessons-list-modal',
  imports: [CommonModule, ListModalComponent],
  templateUrl: './lessons-list-modal.component.html',
  styleUrls: ['./lessons-list-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsListModalComponent {
  @Input() visible = false;
  @Input() currentLessons: Lesson[] = [];
  @Input() savedLessons: Lesson[] = [];
  @Output() closed = new EventEmitter<void>();

  errorMessage: string | null = null;

  closeModal(): void {
    this.visible = false;
    this.closed.emit();
  }
}
