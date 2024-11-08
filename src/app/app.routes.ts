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
import { AccountprofileComponent } from './account/accountprofile/accountprofile.component';
import { AddgoalComponent } from './goal/addgoal/addgoal.component';
import { GoalprofileComponent } from './goal/goalprofile/goalprofile.component';
import { AddbudgetComponent } from './budget/addbudget/addbudget.component';
import { BudgetprofileComponent } from './budget/budgetprofile/budgetprofile.component';
import { mainGuard } from './guard/main.guard';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'forgotpassword',
    component: ForgotpasswordComponent,
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
        canActivate: [mainGuard]
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
        path: 'account/:id',
        component: AccountprofileComponent,
      },  
      {
        path: 'goal',
        component: GoalComponent,
      },
      {
        path: 'goal/addgoal',
        component: AddgoalComponent,
      },
      {
        path: 'goal/:id',
        component: GoalprofileComponent,
      },
      {
        path: 'budget',
        component: BudgetComponent,
      },
      {
        path: 'budget/addbudget',
        component: AddbudgetComponent,
      },
      {
        path: 'budget/:id',
        component: BudgetprofileComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];
