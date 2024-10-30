import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NewaccountComponent } from './newaccount/newaccount.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { GoalComponent } from './goal/goal.component';
import { BudgetComponent } from './budget/budget.component';
import { SettingsComponent } from './settings/settings.component';
import { AddaccountComponent } from './account/addaccount/addaccount.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'newaccount',
    component: NewaccountComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'account/addaccount',
        component: AddaccountComponent,
      },  
      {
        path: 'goal',
        component: GoalComponent,
      },
      {
        path: 'budget',
        component: BudgetComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];
