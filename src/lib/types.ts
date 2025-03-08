export type Category = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  order: number;
  content: string;
};

export type SDModel = 'SD 1.5' | 'SDXL' | 'SD 3.5' | 'Flux';

export type SavedPrompt = {
  id: string;
  title: string;
  prompt: string;
  negativePrompt: string;
  model: SDModel;
  categories: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type TokenCount = {
  total: number;
  limit: number;
  isOverLimit: boolean;
};