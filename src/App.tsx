import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { PromptBuilder } from "./components/prompt-builder";
import { ImageAnalysis } from "./components/image-analysis";
import { SavedPrompts } from "./components/saved-prompts";
import { Button } from "./components/ui/button";
import { useState, useEffect } from "react";
import { Wand2, Settings } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("prompt-builder");
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Default dark theme
  
  // Apply theme class to body on theme change
  useEffect(() => {
    document.body.className = isDarkTheme 
      ? "bg-gray-900 text-gray-100" 
      : "bg-gray-50 text-gray-900";
  }, [isDarkTheme]);

  // Toggle theme function
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  
  // Define theme classes
  const themeClass = isDarkTheme 
    ? "bg-gray-900 text-gray-100" 
    : "bg-gray-50 text-gray-900";
  
  const cardThemeClass = isDarkTheme 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen ${themeClass} p-4 md:p-8`}>
      <header className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wand2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Stable Diffusion Prompt Builder</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Advanced prompt engineering for Stable Diffusion models
          </p>
          <Button variant="outline" size="icon" onClick={toggleTheme} title="Toggle theme">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className={`container mx-auto max-w-7xl ${cardThemeClass} rounded-lg p-6 border shadow-sm`}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
            <TabsTrigger value="prompt-builder">Prompt Builder</TabsTrigger>
            <TabsTrigger value="image-analysis">Image Analysis</TabsTrigger>
            <TabsTrigger value="saved-prompts">Saved Prompts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt-builder" className="space-y-4 mt-6">
            <PromptBuilder />
          </TabsContent>
          
          <TabsContent value="image-analysis" className="space-y-4 mt-6">
            <ImageAnalysis />
          </TabsContent>
          
          <TabsContent value="saved-prompts" className="space-y-4 mt-6">
            <SavedPrompts />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Stable Diffusion Prompt Builder &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}