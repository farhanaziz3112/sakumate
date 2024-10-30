import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme: 'light' | 'dark' = 'light';
  private themeSubject = new BehaviorSubject<'light' | 'dark'>(this.theme);

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    this.theme = savedTheme || 'light';
    this.applyTheme();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('them', this.theme);
    this.applyTheme();
    this.themeSubject.next(this.theme);
  }

  private applyTheme() {
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  get currentTheme() {
    return this.theme;
  }

  get theme$() {
    return this.themeSubject.asObservable();
  }
}
