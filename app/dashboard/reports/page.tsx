"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const projectTrends = [
  { month: "Jan", projects: 1, completed: 0, active: 1 },
  { month: "Feb", projects: 2, completed: 0, active: 2 },
  { month: "Mar", projects: 3, completed: 1, active: 2 },
  { month: "Apr", projects: 3, completed: 1, active: 2 },
];

const budgetTrends = [
  { month: "Jan", allocated: 300, spent: 95 },
  { month: "Feb", allocated: 600, spent: 220 },
  { month: "Mar", allocated: 900, spent: 450 },
  { month: "Apr", allocated: 750, spent: 660 },
];

export default function ReportsPage() {
  const handleExportPDF = () => {
    alert("PDF export feature would be implemented here");
  };

  const handleExportExcel = () => {
    alert("Excel export feature would be implemented here");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Reports & Analytics</h2>
        <div className="flex gap-2">
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleExportPDF}
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            className="gap-2 bg-green-600 hover:bg-green-700"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937" }} />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="active" fill="#3b82f6" name="Active" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Trend (In Thousands)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={budgetTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="allocated"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Allocated"
                />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Spent"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Monthly Report", icon: FileText },
              { name: "Budget Summary", icon: FileText },
              { name: "Progress Overview", icon: FileText },
            ].map((report) => {
              const Icon = report.icon;
              return (
                <Button
                  key={report.name}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-800"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{report.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
