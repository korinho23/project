"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Copy, Save } from "lucide-react";
import { toast } from "sonner";
import { CategoryCard } from "./category-card";
import { TokenCounter } from "./token-counter";
import { ModelSelector } from "./model-selector";
import { DEFAULT_CATEGORIES, MODEL_TOKEN_LIMITS } from "@/lib/constants";
import { Category, SDModel, TokenCount } from "@/lib/types";

export function PromptBuilder() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<SDModel>("SD 1.5");
  
  const tokenCount: TokenCount = {
    total: calculateTokens(buildPrompt()),
    limit: MODEL_TOKEN_LIMITS[selectedModel],
    isOverLimit: calculateTokens(buildPrompt()) > MODEL_TOKEN_LIMITS[selectedModel]
  };

  function calculateTokens(text: string): number {
    return text.split(/\s+/).length;
  }

  function buildPrompt(): string {
    return categories
      .filter(cat => cat.active && cat.content.trim())
      .sort((a, b) => a.order - b.order)
      .map(cat => cat.content.trim())
      .join(", ");
  }

  const toggleCategory = (id: string) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  const updateCategoryContent = (id: string, content: string) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === id ? { ...cat, content } : cat
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const savePrompt = () => {
    const prompt = buildPrompt();
    if (!prompt) {
      toast.error("Please add some content to your prompt before saving");
      return;
    }
    
    // Save prompt logic will be implemented later
    toast.success("Prompt saved successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <ModelSelector value={selectedModel} onChange={setSelectedModel} />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onToggle={toggleCategory}
                  onContentChange={updateCategoryContent}
                />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Final Prompt</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(buildPrompt())}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={savePrompt}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Your prompt will appear here..."
              value={buildPrompt()}
              readOnly
              className="min-h-[200px]"
            />
            <TokenCounter tokenCount={tokenCount} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Negative Prompt</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(negativePrompt)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Your negative prompt will appear here..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}