"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  status: "pending" | "completed" | "failed";
}

interface Budget {
  category: string;
  allocated: number;
  spent: number;
}

const expenseCategories = [
  { name: "Materials", value: 145000, fill: "#3b82f6" },
  { name: "Labor", value: 98000, fill: "#10b981" },
  { name: "Equipment", value: 52000, fill: "#f59e0b" },
  { name: "Other", value: 35000, fill: "#8b5cf6" },
];

const budgets: Budget[] = [
  { category: "Materials", allocated: 300000, spent: 145000 },
  { category: "Labor", allocated: 200000, spent: 98000 },
  { category: "Equipment", allocated: 150000, spent: 52000 },
  { category: "Other", allocated: 100000, spent: 35000 },
];

const expenses: Expense[] = [
  {
    id: "1",
    category: "Materials",
    amount: 45000,
    date: "2024-01-15",
    vendor: "BuildCo",
    status: "completed",
  },
  {
    id: "2",
    category: "Labor",
    amount: 35000,
    date: "2024-01-14",
    vendor: "Internal",
    status: "completed",
  },
  {
    id: "3",
    category: "Equipment",
    amount: 12000,
    date: "2024-01-15",
    vendor: "Equipment Rental",
    status: "pending",
  },
];

export default function FinancialPage() {
  const totalBudget = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetRemaining = totalBudget - totalSpent;
  const budgetPercentage = ((totalSpent / totalBudget) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Financial Tracking</h2>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Log Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalBudget / 1000).toFixed(0)}K
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalSpent / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budgetPercentage}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(budgetRemaining / 1000).toFixed(0)}K
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name}: $${(value / 1000).toFixed(0)}K`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((budget) => {
            const percentage = ((budget.spent / budget.allocated) * 100).toFixed(
              0
            );
            return (
              <div key={budget.category}>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">{budget.category}</p>
                  <span className="text-sm text-muted-foreground">
                    ${(budget.spent / 1000).toFixed(0)}K / $
                    {(budget.allocated / 1000).toFixed(0)}K ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{expense.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.vendor} • {expense.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(expense.amount / 1000).toFixed(0)}K
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      expense.status === "completed"
                        ? "text-green-400"
                        : "text-amber-400"
                    }`}
                  >
                    {expense.status.charAt(0).toUpperCase() +
                      expense.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
