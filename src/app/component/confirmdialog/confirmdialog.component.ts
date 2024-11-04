import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faCircleExclamation, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirmdialog',
  standalone: true,
  imports: [DialogModule, CommonModule, FontAwesomeModule],
  templateUrl: './confirmdialog.component.html',
  styleUrl: './confirmdialog.component.css'
})
export class ConfirmdialogComponent {

  faXmark = faXmark;
  faCircleExclamation = faCircleExclamation;
  faCheck = faCheck;

  @Input() visible: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are sure you want to proceed?';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }


}
