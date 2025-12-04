import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from '@core/models/student';
import { ListModalComponent } from '@shared/list-modal/list-modal.component';

@Component({
  selector: 'app-students-list-modal',
  imports: [CommonModule, ListModalComponent],
  templateUrl: './students-list-modal.component.html',
  styleUrls: ['./students-list-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsListModalComponent {
  @Input() visible = false;
  @Input() currentStudents: Student[] = [];
  @Input() savedStudents: Student[] = [];
  @Output() closed = new EventEmitter<void>();

  errorMessage: string | null = null;

  constructor() {}

  closeModal(): void {
    this.visible = false;
    this.closed.emit();
  }
}
