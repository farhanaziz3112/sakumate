// supabase.service.ts
import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthSession,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environments';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseKey
);

// const changes = supabase
//   .channel('schema-db-changes')
//   .on(
//     'postgres_changes',
//     {
//       schema: 'public', // Subscribes to the "public" schema in Postgres
//       event: '*',       // Listen to all changes
//       table: 'budget'
//     },
//     (payload) => console.log(payload)
//   )
//   .subscribe()



  //-------------------------------Database---------------------------------

  //-------------------------------Profile---------------------------------

//   profile(user: User) {
//     return this.supabase
//       .from('profiles')
//       .select(`*`)
//       .eq('id', user.id)
//       .single();
//   }

//   updateProfile(profile: any) {
//     let updatedProfile = {
//       ...profile,
//       updated_at: new Date(),
//     };

//     return this.supabase.from('profiles').upsert(updatedProfile).select('*');
//   }

//   //-------------------------------Account---------------------------------

//   allaccount(user: User) {
//     return this.supabase.from('account').select(`*`).eq('userid', user.id);
//   }

//   createAccount(account: any) {
//     let newAccount = {
//       ...account,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };
//     return this.supabase.from('account').insert(newAccount).select('*');
//   }

//   updateAccount(account: any) {
//     let updatedAccount = {
//       ...account,
//       updated_at: new Date(),
//     };
//     return this.supabase.from('account').upsert(updatedAccount).select('*');
//   }

//   //-------------------------------Tags---------------------------------

//   tagById(tagId: string) {
//     return this.supabase.from('tag').select(`*`).eq('id', tagId).single();
//   }

//   allDefaultTag() {
//     return this.supabase.from('tag').select(`*`).is('userid', null);
//   }

//   createTag(tag: any) {
//     let newTag = {
//       ...tag,
//       created_at: new Date(),
//     };
//     return this.supabase.from('tag').insert(newTag).select('*');
//   }

//   createMultipleTags(tags: any[]) {
//     const newTags = tags.map((tag) => ({
//       ...tag,
//       created_at: new Date(),
//       updated_at: new Date(),
//     }));
//     return this.supabase.from('tag').insert(newTags).select('*');
//   }

//   updateTag(tag: any) {
//     let updatedTag = {
//       ...tag,
//     };
//     return this.supabase.from('tag').upsert(updatedTag).select('*');
//   }

//   //-------------------------------Budgets---------------------------------

//   budgetByUserId(user: User) {
//     return this.supabase.from('budget').select(`*`).eq('userid', user.id);
//   }

//   budgetByAccountId(accId: string) {
//     return this.supabase.from('budget').select(`*`).eq('accountid', accId);
//   }

//   createBudget(budget: any) {
//     let newBudget = {
//       ...budget,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };
//     return this.supabase.from('budget').insert(newBudget).select('*');
//   }

//   createMultipleBudget(budgets: any[]) {
//     const newBudgets = budgets.map((budget) => ({
//       ...budget,
//       created_at: new Date(),
//       updated_at: new Date(),
//     }));
//     return this.supabase.from('budget').insert(newBudgets).select('*');
//   }

//   updateBudget(budget: any) {
//     let updatedBudget = {
//       ...budget,
//       updated_at: new Date(),
//     };
//     return this.supabase.from('tag').upsert(updatedBudget).select('*');
//   }

//   //-------------------------------Goals---------------------------------

//   goal(user: User) {
//     return this.supabase.from('goal').select(`*`).eq('userid', user.id);
//   }

//   createGoal(goal: any) {
//     let newGoal = {
//       ...goal,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };
//     return this.supabase.from('goal').insert(newGoal).select('*');
//   }

//   createMultipleGoals(goals: any[]) {
//     const newGoals = goals.map((goal) => ({
//       ...goal,
//       created_at: new Date(),
//       updated_at: new Date(),
//     }));
//     return this.supabase.from('goal').insert(newGoals).select('*');
//   }

//   updateGoal(goal: any) {
//     let updatedGoal = {
//       ...goal,
//       updated_at: new Date(),
//     };
//     return this.supabase.from('goal').upsert(updatedGoal).select('*');
//   }

//   //-------------------------------Transaction---------------------------------

//   transactionByAccountId(accId: string) {
//     return this.supabase.from('transaction').select(`*`).eq('accountid', accId);
//   }

//   transactionByUserId(user: User) {
//     return this.supabase.from('transaction').select(`*`).eq('userid', user.id);
//   }

//   createTransaction(transaction: any) {
//     let newTransaction = {
//       ...transaction,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };
//     return this.supabase.from('transaction').insert(newTransaction).select('*');
//   }

//   createMultipleTransactions(transactions: any[]) {
//     const newTransactions = transactions.map((transaction) => ({
//       ...transaction,
//       created_at: new Date(),
//       updated_at: new Date(),
//     }));
//     return this.supabase
//       .from('transaction')
//       .insert(newTransactions)
//       .select('*');
//   }

//   updateTransaction(transaction: any) {
//     let updatedTransaction = {
//       ...transaction,
//       updated_at: new Date(),
//     };
//     return this.supabase
//       .from('transaction')
//       .upsert(updatedTransaction)
//       .select('*');
//   }
// }
