"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/lib/types";
import { GripVertical } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onToggle: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
}

export function CategoryCard({ category, onToggle, onContentChange }: CategoryCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center space-x-4 py-2">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
        <div className="flex-1">
          <Label htmlFor={`category-${category.id}`} className="text-sm font-medium">
            {category.name}
          </Label>
          <p className="text-xs text-muted-foreground">{category.description}</p>
        </div>
        <Switch
          id={`category-${category.id}`}
          checked={category.active}
          onCheckedChange={() => onToggle(category.id)}
        />
      </CardHeader>
      {category.active && (
        <CardContent>
          <Textarea
            placeholder={`Enter ${category.name.toLowerCase()}...`}
            value={category.content}
            onChange={(e) => onContentChange(category.id, e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      )}
    </Card>
  );
}