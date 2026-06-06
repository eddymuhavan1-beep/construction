"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, AlertTriangle, Wrench as ServiceIcon } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "operational" | "maintenance" | "idle" | "retired";
  location: string;
  acquisitionCost: number;
  lastService?: string;
  nextService?: string;
}

const sampleEquipment: Equipment[] = [
  {
    id: "1",
    name: "Excavator CAT 320",
    type: "Excavator",
    status: "operational",
    location: "Site A",
    acquisitionCost: 450000,
    lastService: "2024-01-10",
    nextService: "2024-02-10",
  },
  {
    id: "2",
    name: "Concrete Mixer",
    type: "Mixer",
    status: "maintenance",
    location: "Site B",
    acquisitionCost: 25000,
    lastService: "2024-01-08",
    nextService: "2024-02-08",
  },
  {
    id: "3",
    name: "Bulldozer CAT D6",
    type: "Bulldozer",
    status: "operational",
    location: "Site A",
    acquisitionCost: 550000,
    lastService: "2024-01-05",
    nextService: "2024-02-05",
  },
];

export default function EquipmentPage() {
  const [equipment] = useState<Equipment[]>(sampleEquipment);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-900 text-green-200";
      case "maintenance":
        return "bg-amber-900 text-amber-200";
      case "idle":
        return "bg-gray-900 text-gray-200";
      case "retired":
        return "bg-red-900 text-red-200";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Equipment & Assets</h2>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      <div className="grid gap-4">
        {equipment.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <Wrench className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.type} • Location: {item.location}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Acquisition Cost
                  </p>
                  <p className="font-semibold mt-1">
                    ${(item.acquisitionCost / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Service</p>
                  <p className="font-semibold mt-1">
                    {item.lastService || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Service</p>
                  <p className="font-semibold mt-1">
                    {item.nextService || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  {item.status === "maintenance" && (
                    <p className="flex items-center gap-1 text-amber-400 mt-1">
                      <AlertTriangle className="h-4 w-4" />
                      In Maintenance
                    </p>
                  )}
                  {item.status === "operational" && (
                    <p className="text-green-400 mt-1">Operational</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
