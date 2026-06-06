"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface WorkforceEntry {
  id: string;
  name: string;
  position: string;
  status: "present" | "absent" | "late" | "leave";
  checkInTime?: string;
  hoursWorked?: number;
}

const sampleWorkforce: WorkforceEntry[] = [
  {
    id: "1",
    name: "John Smith",
    position: "Supervisor",
    status: "present",
    checkInTime: "07:45",
    hoursWorked: 9,
  },
  {
    id: "2",
    name: "Maria Garcia",
    position: "Foreman",
    status: "present",
    checkInTime: "08:00",
    hoursWorked: 8.5,
  },
  {
    id: "3",
    name: "Ahmed Hassan",
    position: "Laborer",
    status: "late",
    checkInTime: "08:35",
    hoursWorked: 7.5,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    position: "Safety Officer",
    status: "leave",
  },
];

export default function WorkforcePage() {
  const [workforce] = useState<WorkforceEntry[]>(sampleWorkforce);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "absent":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "late":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "leave":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const presentCount = workforce.filter((w) => w.status === "present").length;
  const totalCount = workforce.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Workforce & Attendance</h2>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Worker
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((presentCount / totalCount) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workforce.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">{entry.position}</p>
                </div>
                <div className="flex items-center gap-4">
                  {entry.status !== "leave" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {entry.checkInTime}
                      </p>
                      {entry.hoursWorked && (
                        <p className="text-sm font-medium">
                          {entry.hoursWorked}h
                        </p>
                      )}
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(entry.status)}
                    <span className="text-xs font-medium capitalize">
                      {entry.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
