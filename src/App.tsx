import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptBuilder } from "@/components/prompt-builder";
import { ImageAnalysis } from "@/components/image-analysis";
import { SavedPrompts } from "@/components/saved-prompts";
import { Wand2 } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-4 md:p-8">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wand2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Stable Diffusion Prompt Builder</h1>
        </div>
        <p className="text-muted-foreground">Advanced prompt engineering for Stable Diffusion models</p>
      </header>

      <main className="container mx-auto max-w-7xl">
        <Tabs defaultValue="prompt-builder" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
            <TabsTrigger value="prompt-builder">Prompt Builder</TabsTrigger>
            <TabsTrigger value="image-analysis">Image Analysis</TabsTrigger>
            <TabsTrigger value="saved-prompts">Saved Prompts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt-builder" className="space-y-4">
            <PromptBuilder />
          </TabsContent>
          
          <TabsContent value="image-analysis" className="space-y-4">
            <ImageAnalysis />
          </TabsContent>
          
          <TabsContent value="saved-prompts" className="space-y-4">
            <SavedPrompts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}