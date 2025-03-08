"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { useState, useEffect } from "react";
import { Search, MoreVertical, Copy, Pencil, Trash, Clock, Edit, X } from "lucide-react";
import { SavedPrompt, SDModel } from "@/lib/types";
import { toast } from "sonner";
import { format } from "date-fns";

interface SavedPromptsProps {
  onLoadPrompt?: (promptId: string) => void;
}

export function SavedPrompts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);

  // Load saved prompts from localStorage
  useEffect(() => {
    const savedPromptsData = localStorage.getItem('savedPrompts');
    if (savedPromptsData) {
      try {
        setPrompts(JSON.parse(savedPromptsData));
      } catch (e) {
        console.error('Error loading saved prompts:', e);
      }
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const deletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
    toast.success("Prompt deleted successfully!");
    setDeletePromptId(null);
  };

  const editPrompt = (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      setEditingPrompt(prompt);
      setIsDialogOpen(true);
    }
  };

  const saveEditedPrompt = () => {
    if (!editingPrompt) return;

    const updatedPrompts = prompts.map(p => 
      p.id === editingPrompt.id ? editingPrompt : p
    );
    
    setPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
    setIsDialogOpen(false);
    setEditingPrompt(null);
    toast.success("Prompt updated successfully!");
  };

  const loadPrompt = (id: string) => {
    // This function is intended to load and update the Prompt Builder UI with the selected prompt
    // We need to trigger a parent component state update
    const event = new CustomEvent('loadSavedPrompt', { detail: id });
    document.dispatchEvent(event);
    toast.success("Prompt loaded for editing!");
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
                        <div className="space-y-1 max-w-[80%]">
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
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => loadPrompt(prompt.id)}
                          >
                            Load
                          </Button>
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
                              <DropdownMenuItem
                                onClick={() => editPrompt(prompt.id)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeletePromptId(prompt.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>
              Make changes to your saved prompt.
            </DialogDescription>
          </DialogHeader>
          
          {editingPrompt && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={editingPrompt.title}
                  onChange={(e) => setEditingPrompt({...editingPrompt, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt</label>
                <textarea 
                  className="w-full min-h-[100px] p-2 rounded-md border"
                  value={editingPrompt.prompt}
                  onChange={(e) => setEditingPrompt({...editingPrompt, prompt: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Negative Prompt</label>
                <textarea 
                  className="w-full min-h-[60px] p-2 rounded-md border"
                  value={editingPrompt.negativePrompt}
                  onChange={(e) => setEditingPrompt({...editingPrompt, negativePrompt: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedPrompt}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePromptId} onOpenChange={(open) => !open && setDeletePromptId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setDeletePromptId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletePromptId && deletePrompt(deletePromptId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}