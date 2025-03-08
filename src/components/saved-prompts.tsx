"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Search, MoreVertical, Copy, Pencil, Trash, Clock } from "lucide-react";
import { SavedPrompt, SDModel } from "@/lib/types";
import { toast } from "sonner";
import { format } from "date-fns";

export function SavedPrompts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prompts, setPrompts] = useState<SavedPrompt[]>([
    {
      id: "1",
      title: "Fantasy Landscape",
      prompt: "majestic mountain range, ethereal fog, mystical forest, dramatic lighting, fantasy atmosphere, highly detailed, professional photography, 8k",
      negativePrompt: "blurry, bad quality, low resolution",
      model: "SDXL",
      categories: {
        subject: "mountain range",
        style: "fantasy, ethereal",
        lighting: "dramatic lighting",
        quality: "highly detailed, 8k",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    toast.success("Prompt deleted successfully!");
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <ScrollArea className="h-[600px] mt-4">
            {filteredPrompts.length > 0 ? (
              <div className="space-y-4">
                {filteredPrompts.map((prompt) => (
                  <Card key={prompt.id} className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{prompt.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {prompt.prompt}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(prompt.createdAt), "MMM d, yyyy")}
                            </span>
                            <span className="px-1">•</span>
                            <span>{prompt.model}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => copyToClipboard(prompt.prompt)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Prompt
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deletePrompt(prompt.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No saved prompts found</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}