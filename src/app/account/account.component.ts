import { Component } from '@angular/core';
import { icons } from '../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faA, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  faAdd = faAdd;

  constructor(private router: Router) {}

  addAccount() {
    this.router.navigate(['/account/addaccount']);
  }

  goToAccount(id: string) {
    this.router.navigate(['/account', id]);
  }
}
