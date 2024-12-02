import { Routes } from '@angular/router';
import { LoginComponent } from './authPages/login/login.component';
import { SignupComponent } from './authPages/signup/signup.component';
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
import { ForgotpasswordComponent } from './authPages/forgotpassword/forgotpassword.component';
import { authGuard } from './guard/auth.guard';
import { AccgoalComponent } from './goal/accgoal/accgoal.component';
import { OthergoalComponent } from './goal/othergoal/othergoal.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [authGuard]
  },
  {
    path: 'forgotpassword',
    component: ForgotpasswordComponent,
    canActivate: [authGuard]
  },
  {
    path: 'newaccount',
    component: NewaccountComponent,
    canActivate: [mainGuard]
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
        canActivate: [mainGuard]
      },
      {
        path: 'account/addaccount',
        component: AddaccountComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'account/:id',
        component: AccountprofileComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'goal',
        component: GoalComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'goal/addgoal',
        component: AddgoalComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'goal/:id',
        component: GoalprofileComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'goal/accgoal/:id',
        component: AccgoalComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'goal/othergoal/:id',
        component: OthergoalComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'budget',
        component: BudgetComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'budget/addbudget',
        component: AddbudgetComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'budget/:id',
        component: BudgetprofileComponent,
        canActivate: [mainGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [mainGuard]
      },
    ],
  },
];
