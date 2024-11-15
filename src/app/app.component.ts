import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sakumate';

  // session = this.supabase.session;

  // constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    // this.supabase.authChanges((_, session) => (this.session = session));
  }
}
