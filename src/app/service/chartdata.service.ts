import { Injectable } from '@angular/core';
import { colorToHex } from './color.service';

@Injectable({
  providedIn: 'root',
})
export class ChartdataService {
  constructor() {}

  monthsLabel = [
    'Jan',
    'Feb',
    'Mac',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  dayslabel = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  extractUniqueMonths(transactions: any[]) {
    const monthSet = new Set<string>();

    transactions.forEach((transaction: any) => {
      const date = new Date(transaction.created_at);
      const monthYear = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      monthSet.add(monthYear);
    });

    let months = Array.from(monthSet).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

    months.push('All');
    return months;
  }

  getMonthLabel(months: any[]) {
    const currentDate = new Date();
    let monthsWithoutAll = [...months];
    monthsWithoutAll = monthsWithoutAll.filter((month) => month !== 'All');
    return monthsWithoutAll;
  }

  getGoalLabel(goals: any[]) {
    let goalsLabel: any[] = [];
    goals.forEach((goal: any) => {
      goalsLabel.push(goal.goalname);
    });
    return goalsLabel;
  }

  getDailyLabel(selectedMonth: any) {
    const currentDate = new Date();
    const [monthStr, yearStr] = selectedMonth.split(' ');
    const date = new Date(`${monthStr} 1, ${yearStr}`);
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (date.getMonth() === currentDate.getMonth()) {
      return this.dayslabel.slice(0, currentDate.getDate());
    } else {
      return this.dayslabel.slice(0, newDate.getDate());
    }
  }

  getDailyTransactionsData(transactions: any[], type: string) {
    let data: any[] = [];
    for (let i = 1; i < 32; i++) {
      let total = 0;
      transactions.forEach((transaction) => {
        let date = new Date(transaction.created_at);
        if (transaction.type === type && date.getDate() === i) {
          if (type === 'income') {
            total += transaction.amount;
          } else {
            total += -transaction.amount;
          }
        }
      });
      data.push(total);
    }
    return data;
  }

  getMonthlyTransactionsData(months: any[], transactions: any[], type: string) {
    let data: any[] = [];
    for (let i = 0; i < months.length; i++) {
      if (months[i] === 'All') {
        continue;
      }
      let total = 0;
      const [monthStr, yearStr] = months[i].split(' ');
      const date = new Date(`${monthStr} 1, ${yearStr}`);
      transactions.forEach((transaction: any) => {
        let transactiondate = new Date(transaction.created_at);
        if (
          transaction.type === type &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          if (type === 'income') {
            total += transaction.amount;
          } else {
            total += -transaction.amount;
          }
        }
      });
      data.push(total);
    }
    return data;
  }

  getMonthlyExpensesData(months: any[], transactions: any[]) {
    let data: any[] = [];
    for (let i = 0; i < months.length; i++) {
      if (months[i] === 'All') {
        continue;
      }
      let total = 0;
      const [monthStr, yearStr] = months[i].split(' ');
      const date = new Date(`${monthStr} 1, ${yearStr}`);
      transactions.forEach((transaction: any) => {
        let transactiondate = new Date(transaction.created_at);
        if (
          transaction.type === 'expense' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          total += -transaction.amount;
        }
      });
      data.push(total);
    }
    return data;
  }

  getGoalsProgressPercentage(goals: any[]) {
    let data: any[] = [];
    goals.forEach((goal: any) => {
      if (goal.account) {
        data.push(
          parseFloat(
            ((goal.account.currentbalance / goal.targetamount) * 100).toFixed(2)
          )
        );
      } else {
        data.push(
          parseFloat(
            ((goal.currentamount / goal.targetamount) * 100).toFixed(2)
          )
        );
      }
    });
    return data;
  }

  getUniqueIncomes(transactions: any[]) {
    let income: any[] = [];
    transactions.forEach((transaction: any) => {
      if (transaction.type === 'income' && transaction.budget) {
        let exists = income.find(
          (budget: any) => budget.id === transaction.budget.id
        );
        if (!exists) {
          income.push(transaction.budget);
        }
      }
    });
    return income;
  }

  getUniqueExpenses(transactions: any[]) {
    let expense: any[] = [];
    transactions.forEach((transaction: any) => {
      if (transaction.type === 'expense' && transaction.budget) {
        let exists = expense.find(
          (budget: any) => budget.id === transaction.budget.id
        );
        if (!exists) {
          expense.push(transaction.budget);
        }
      }
    });
    return expense;
  }

  getUniqueGoals(transactions: any[]) {
    let goals: any[] = [];
    transactions.forEach((transaction: any) => {
      if (transaction.type === 'goal' && transaction.goal) {
        let exists = goals.find((goal: any) => goal.id === transaction.goal.id);
        if (!exists) {
          goals.push(transaction.goal);
        }
      }
    });
    return goals;
  }

  getTransactionOverallTotal(transactions: any[], type: string) {
    let total = 0;
    transactions.forEach((transaction: any) => {
      if (transaction.type === type) {
        if (type === 'income') {
          total += transaction.amount;
        } else {
          total += -transaction.amount;
        }
      }
    });
    return total;
  }

  getTransactionTotal(uniqueType: any[], transactions: any[], type: string) {
    let data: any[] = [];
    for (let i = 0; i < uniqueType.length; i++) {
      let total = 0;
      transactions.forEach((transaction: any) => {
        if (type === 'goal') {
          if (transaction.goal.id === uniqueType[i].id) {
            total += -transaction.amount;
          }
        } else {
          if (type === 'income') {
            if (transaction.budget.id === uniqueType[i].id) {
              total += transaction.amount;
            }
          } else {
            if (transaction.budget.id === uniqueType[i].id) {
              total += -transaction.amount;
            }
          }
        }
      });
      if (type === 'goal') {
        data.push({
          goal: uniqueType[i],
          total: total,
        });
      } else {
        data.push({
          budget: uniqueType[i],
          total: total,
        });
      }
    }
    return data;
  }

  getTransactionsStackedData(
    uniqueType: any[],
    transactions: any[],
    months: any[],
    type: string
  ) {
    let data: any[] = [];
    for (let i = 0; i < uniqueType.length; i++) {
      let monthlyTotal: any[] = [];
      for (let j = 0; j < months.length; j++) {
        if (months[j] === 'All') {
          continue;
        }
        let total = 0;
        const [monthStr, yearStr] = months[j].split(' ');
        const date = new Date(`${monthStr} 1, ${yearStr}`);
        transactions.forEach((transaction) => {
          let transactiondate = new Date(transaction.created_at);
          if (type === 'income') {
            if (
              transaction.type === 'income' &&
              transaction.budget.id === uniqueType[i].id &&
              date.getMonth() === transactiondate.getMonth()
            ) {
              total += transaction.amount;
            }
          } else if (type === 'expense') {
            if (
              transaction.type === 'expense' &&
              transaction.budget.id === uniqueType[i].id &&
              date.getMonth() === transactiondate.getMonth()
            ) {
              total += -transaction.amount;
            }
          } else {
            if (
              transaction.type === 'goal' &&
              transaction.goal.id === uniqueType[i].id &&
              date.getMonth() === transactiondate.getMonth()
            ) {
              total += -transaction.amount;
            }
          }
        });
        monthlyTotal.push(total);
      }
      let colorToConvert = ('bg-' +
        uniqueType[i].tag.color +
        '-600') as keyof typeof colorToHex;
      data.push({
        data: monthlyTotal,
        label:
          type === 'income'
            ? uniqueType[i].budgetname
            : type === 'expense'
            ? uniqueType[i].budgetName
            : uniqueType[i].goalname,
        backgroundColor: colorToHex[colorToConvert],
        stack: 'a',
        barThickness: 30,
      });
    }
    return data;
  }

  getMonthlyNetIncome(months: any[], transactions: any[]) {
    let data: any[] = [];
    for (let i = 0; i < months.length; i++) {
      if (months[i] === 'All') {
        continue;
      }
      let incomeTotal = 0;
      let expenseTotal = 0;
      let goalTotal = 0;
      const [monthStr, yearStr] = months[i].split(' ');
      const date = new Date(`${monthStr} 1, ${yearStr}`);
      transactions.forEach((transaction) => {
        let transactiondate = new Date(transaction.created_at);
        if (
          transaction.type === 'income' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          incomeTotal += transaction.amount;
        }
        if (
          transaction.type === 'expense' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          expenseTotal += -transaction.amount;
        }
        if (
          transaction.type === 'goal' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          goalTotal += -transaction.amount;
        }
      });
      data.push(incomeTotal - (expenseTotal + goalTotal));
    }
    return data;
  }

  getAccountMonthlyBalance(
    months: any[],
    transactions: any[],
    initialbalance: number,
    forAccountGoal: boolean
  ) {
    let data: any[] = [];
    let monthlybalance: { year: number; month: number; balance: number }[] = [];
    let currentBalance = initialbalance;

    transactions?.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA.getTime() - dateB.getTime();
    });

    transactions?.forEach((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1;

      let monthBalance = monthlybalance.find(
        (item) => item.year === year && item.month === month
      );

      if (!monthBalance) {
        monthBalance = { year, month, balance: currentBalance };
        monthlybalance.push(monthBalance);
      }

      if (forAccountGoal) {
        monthBalance.balance += transaction.amount;
      } else {
        transaction.type === 'goal'
          ? (monthBalance.balance += -transaction.amount)
          : (monthBalance.balance += transaction.amount);
      }

      currentBalance = monthBalance.balance;
    });

    monthlybalance.forEach((balance) => {
      data.push(balance.balance);
    });
    return data;
  }
}
