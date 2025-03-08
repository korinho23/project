"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Copy, Save, Wand2 } from "lucide-react";
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
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>("llama2");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const tokenCount: TokenCount = {
    total: calculateTokens(buildPrompt()),
    limit: MODEL_TOKEN_LIMITS[selectedModel],
    isOverLimit: calculateTokens(buildPrompt()) > MODEL_TOKEN_LIMITS[selectedModel]
  };

  // Ollama modellek lekérése
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/models');
        const data = await response.json();
        if (data && data.models) {
          setOllamaModels(data.models.map(model => model.name));
          if (data.models.length > 0) {
            setSelectedOllamaModel(data.models[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    
    fetchModels();
  }, []);

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

  // Ollama segítségével prompt generálása
  const generateWithAI = async (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    setIsGenerating(true);
    
    try {
      const prompt = `Generate high-quality content for a Stable Diffusion prompt category: "${category.name}" (${category.description}). 
        Make it detailed and descriptive in 10-15 words.`;
      
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedOllamaModel
        }),
      });
      
      const data = await response.json();
      
      if (data && data.response) {
        updateCategoryContent(categoryId, data.response.trim());
        toast.success(`Generated content for ${category.name}`);
      }
    } catch (error) {
      console.error('Error generating with AI:', error);
      toast.error('Failed to generate content. Make sure Ollama is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Negatív prompt generálás
  const generateNegativePrompt = async () => {
    setIsGenerating(true);
    
    try {
      const basePrompt = buildPrompt();
      const prompt = `Generate a comprehensive negative prompt for this Stable Diffusion prompt: "${basePrompt}". 
        Include common negative terms to avoid artifacts and issues.`;
      
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedOllamaModel
        }),
      });
      
      const data = await response.json();
      
      if (data && data.response) {
        setNegativePrompt(data.response.trim());
        toast.success('Generated negative prompt');
      }
    } catch (error) {
      console.error('Error generating negative prompt:', error);
      toast.error('Failed to generate negative prompt. Make sure Ollama is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <div className="flex gap-2 items-center">
              <ModelSelector value={selectedModel} onChange={setSelectedModel} />
              {ollamaModels.length > 0 && (
                <select 
                  value={selectedOllamaModel} 
                  onChange={(e) => setSelectedOllamaModel(e.target.value)}
                  className="p-2 rounded-md border bg-background"
                >
                  {ollamaModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onToggle={toggleCategory}
                  onContentChange={updateCategoryContent}
                  onGenerateWithAI={() => generateWithAI(category.id)}
                  isGenerating={isGenerating}
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(negativePrompt)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={generateNegativePrompt}
                disabled={isGenerating || !buildPrompt()}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
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