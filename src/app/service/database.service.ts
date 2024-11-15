import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';
import { Router } from '@angular/router';
import { AuthSession, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private user = new BehaviorSubject<User | null>(null);
  private accounts = new BehaviorSubject<any[]>([]);
  public accounts$ = this.accounts.asObservable();

  userData: User | any;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user.next(user ? user : null);
        this.userData = user;
        this.allaccount();
      }
    });
  }

  private changes = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        schema: 'public', // Subscribes to the "public" schema in Postgres
        event: '*', // Listen to all changes
        table: 'account',
      },
      (payload) => {
        console.log(payload);
        this.allaccount();
      }
    )
    .subscribe();

  //-------------------------------Profile---------------------------------

  profile() {
    return supabase.from('profiles').select(`*`).eq('id', this.userData.id).single();
  }

  updateProfile(profile: any) {
    let updatedProfile = {
      ...profile,
      updated_at: new Date(),
    };

    return supabase.from('profiles').upsert(updatedProfile).select('*');
  }

  //-------------------------------Account---------------------------------

  async allaccount() {
    const { data, error } = await supabase
      .from('account')
      .select(`*`)
      .eq('userid', this.userData.id);
    if (data && !error) {
      this.accounts.next(data);
    }
    // return supabase.from('account').select(`*`).eq('userid', user.id);
  }

  createAccount(account: any) {
    let newAccount = {
      ...account,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return supabase.from('account').insert(newAccount).select('*');
  }

  updateAccount(account: any) {
    let updatedAccount = {
      ...account,
      updated_at: new Date(),
    };
    return supabase.from('account').upsert(updatedAccount).select('*');
  }

  //-------------------------------Tags---------------------------------

  tagById(tagId: string) {
    return supabase.from('tag').select(`*`).eq('id', tagId).single();
  }

  allDefaultTag() {
    return supabase.from('tag').select(`*`).is('userid', null);
  }

  createTag(tag: any) {
    let newTag = {
      ...tag,
      created_at: new Date(),
    };
    return supabase.from('tag').insert(newTag).select('*');
  }

  createMultipleTags(tags: any[]) {
    const newTags = tags.map((tag) => ({
      ...tag,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    return supabase.from('tag').insert(newTags).select('*');
  }

  updateTag(tag: any) {
    let updatedTag = {
      ...tag,
    };
    return supabase.from('tag').upsert(updatedTag).select('*');
  }

  //-------------------------------Budgets---------------------------------

  budgetByUserId(user: User) {
    return supabase.from('budget').select(`*`).eq('userid', user.id);
  }

  budgetByUserId_type(user: User, type: string) {
    return supabase.from('budget').select(`*`).eq('userid', user.id).eq('budgettype', type);
  }

  // budgetByAccountId(accId: string) {
  //   return supabase.from('budget').select(`*`).eq('accountid', accId);
  // }

  createBudget(budget: any) {
    let newBudget = {
      ...budget,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return supabase.from('budget').insert(newBudget).select('*');
  }

  createMultipleBudget(budgets: any[]) {
    const newBudgets = budgets.map((budget) => ({
      ...budget,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    return supabase.from('budget').insert(newBudgets).select('*');
  }

  updateBudget(budget: any) {
    let updatedBudget = {
      ...budget,
      updated_at: new Date(),
    };
    return supabase.from('tag').upsert(updatedBudget).select('*');
  }

  //-------------------------------Goals---------------------------------

  goal(user: User) {
    return supabase.from('goal').select(`*`).eq('userid', user.id);
  }

  createGoal(goal: any) {
    let newGoal = {
      ...goal,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return supabase.from('goal').insert(newGoal).select('*');
  }

  createMultipleGoals(goals: any[]) {
    const newGoals = goals.map((goal) => ({
      ...goal,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    return supabase.from('goal').insert(newGoals).select('*');
  }

  updateGoal(goal: any) {
    let updatedGoal = {
      ...goal,
      updated_at: new Date(),
    };
    return supabase.from('goal').upsert(updatedGoal).select('*');
  }

  //-------------------------------Transaction---------------------------------

  transactionByAccountId(accId: string) {
    return supabase.from('transaction').select(`*`).eq('accountid', accId);
  }

  transactionByUserId(user: User) {
    return supabase.from('transaction').select(`*`).eq('userid', user.id);
  }

  createTransaction(transaction: any) {
    let newTransaction = {
      ...transaction,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return supabase.from('transaction').insert(newTransaction).select('*');
  }

  createMultipleTransactions(transactions: any[]) {
    const newTransactions = transactions.map((transaction) => ({
      ...transaction,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    return supabase.from('transaction').insert(newTransactions).select('*');
  }

  updateTransaction(transaction: any) {
    let updatedTransaction = {
      ...transaction,
      updated_at: new Date(),
    };
    return supabase.from('transaction').upsert(updatedTransaction).select('*');
  }
}
