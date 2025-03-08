"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";
import { GripVertical, Wand2 } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onToggle: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
  onGenerateWithAI: () => void;
  isGenerating: boolean;
}

export function CategoryCard({ category, onToggle, onContentChange, onGenerateWithAI, isGenerating }: CategoryCardProps) {
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
          <div className="space-y-2">
            <Textarea
              placeholder={`Enter ${category.name.toLowerCase()}...`}
              value={category.content}
              onChange={(e) => onContentChange(category.id, e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateWithAI}
              disabled={isGenerating}
              className="w-full"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate with AI
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}