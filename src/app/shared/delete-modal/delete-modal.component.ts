import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() visible = false;
  @Input() backdrop: 'static' | boolean = 'static';
  @Input() keyboard = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('deleteModal', { static: true }) private modalElem!: ElementRef<HTMLDivElement>;
  private deleteModal!: Modal;

  ngOnInit(): void {
    this.setupModal();
    if (this.visible) this.showModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.deleteModal) return;

    if (changes['visible'] && !changes['visible'].isFirstChange()) {
      this.visible ? this.showModal() : this.hideModal();
    }
  }

  confirm(): void {
    this.confirmed.emit();
    this.hideModal();
  }

  close(): void {
    this.closed.emit();
    this.hideModal();
  }

  private setupModal(): void {
    this.deleteModal = new Modal(this.modalElem.nativeElement, {
      backdrop: this.backdrop,
      keyboard: this.keyboard,
    });
  }

  private showModal(): void {
    if (!this.deleteModal) return;
    this.deleteModal.show();
  }

  private hideModal(): void {
    if (!this.deleteModal) return;
    this.deleteModal.hide();
  }

  ngOnDestroy(): void {
    this.deleteModal?.dispose();
  }
}
