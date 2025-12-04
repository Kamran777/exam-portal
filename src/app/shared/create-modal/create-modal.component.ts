import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() description = '';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
