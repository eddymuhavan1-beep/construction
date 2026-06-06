"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MapPin, Cloud, Thermometer } from "lucide-react";

interface DiaryEntry {
  id: string;
  date: string;
  weather: string;
  temperature: number;
  workforce: number;
  progress: string;
  issues: string;
}

const sampleEntries: DiaryEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    weather: "Sunny",
    temperature: 28,
    workforce: 45,
    progress: "Completed foundation work on Block A",
    issues: "Minor material delay",
  },
  {
    id: "2",
    date: "2024-01-14",
    weather: "Cloudy",
    temperature: 25,
    workforce: 42,
    progress: "Continued formwork installation",
    issues: "None",
  },
];

export default function DiaryPage() {
  const [entries] = useState<DiaryEntry[]>(sampleEntries);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Site Diary</h2>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-semibold mt-1">{entry.date}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Cloud className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Weather</p>
                    <p className="font-semibold">{entry.weather}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Thermometer className="h-4 w-4 mt-1 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-semibold">{entry.temperature}°C</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Workforce</p>
                  <p className="font-semibold">{entry.workforce} workers</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.progress}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Issues</p>
                  <p className="text-sm text-amber-200">{entry.issues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
