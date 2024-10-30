import { Component } from '@angular/core';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
})
export class OverlayComponent {
  isOpen: boolean = false;

  toggleOverlay() {
    this.isOpen = !this.isOpen;
  }
}
