"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Package, AlertCircle } from "lucide-react";

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: "available" | "shortage" | "on_order" | "delayed";
  supplier: string;
}

const sampleMaterials: Material[] = [
  {
    id: "1",
    name: "Cement",
    category: "Building Material",
    quantity: 450,
    unit: "bags",
    status: "available",
    supplier: "BuildCo",
  },
  {
    id: "2",
    name: "Steel Rebar",
    category: "Reinforcement",
    quantity: 15,
    unit: "tons",
    status: "shortage",
    supplier: "Steel Pro",
  },
  {
    id: "3",
    name: "Bricks",
    category: "Building Material",
    quantity: 0,
    unit: "thousands",
    status: "on_order",
    supplier: "BrickHouse",
  },
];

export default function MaterialsPage() {
  const [materials] = useState<Material[]>(sampleMaterials);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-900 text-green-200";
      case "shortage":
        return "bg-amber-900 text-amber-200";
      case "on_order":
        return "bg-blue-900 text-blue-200";
      case "delayed":
        return "bg-red-900 text-red-200";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Materials & Inventory</h2>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Material
        </Button>
      </div>

      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">{material.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {material.category} • Supplier: {material.supplier}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    material.status
                  )}`}
                >
                  {material.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-semibold mt-1">
                    {material.quantity} {material.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Unit</p>
                  <p className="font-semibold mt-1 capitalize">
                    {material.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold mt-1">
                    {material.status === "shortage" && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        Low Stock
                      </span>
                    )}
                    {material.status === "on_order" && (
                      <span className="text-blue-400">On Order</span>
                    )}
                    {material.status === "available" && (
                      <span className="text-green-400">In Stock</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
