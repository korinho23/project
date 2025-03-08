import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { PromptBuilder } from "./components/prompt-builder";
import { ImageAnalysis } from "./components/image-analysis";
import { SavedPrompts } from "./components/saved-prompts";
import { MultipleImageAnalysis } from "./components/multiple-image-analysis";
import { Button } from "./components/ui/button";
import { AIColorPalette } from "./components/ai-color-palette";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { useState, useEffect } from "react";
import { Wand2, Sun, Moon, Palette, PlusSquare, ImageIcon, Images, Save } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("prompt-builder");
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Default dark theme
  const [isAiTheme, setIsAiTheme] = useState(true); // Default AI theme enabled
  
  // Apply theme class to body on theme change
  useEffect(() => {
    const themeClasses = [];
    
    // Dark/Light mode
    if (isDarkTheme) {
      themeClasses.push("dark");
    } else {
      themeClasses.push("light");
    }
    
    // AI theme
    if (isAiTheme) {
      themeClasses.push("ai-theme");
    }
    
    document.body.className = themeClasses.join(" ");
  }, [isDarkTheme, isAiTheme]);

  // Toggle theme functions
  const toggleDarkMode = () => setIsDarkTheme(!isDarkTheme);
  const toggleAiTheme = () => setIsAiTheme(!isAiTheme);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-primary py-3 px-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Wand2 className="h-6 w-6 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground">Stable Diffusion Prompt Builder</h1>
        </div>
        <p className="hidden md:block text-primary-foreground text-sm">
          Advanced prompt engineering for Stable Diffusion models
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="text-primary-foreground hover:bg-primary-foreground/20"
            title="Toggle dark/light mode"
          >
            {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAiTheme} 
            className={`text-primary-foreground hover:bg-primary-foreground/20 ${isAiTheme ? 'ring-1 ring-primary-foreground' : ''}`}
            title="Toggle AI theme"
          >
            <Palette className="h-5 w-5" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex text-primary-foreground bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/20"
              >
                <Palette className="h-4 w-4 mr-2" />
                Color Reference
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>AI Color Palette</DialogTitle>
              </DialogHeader>
              <AIColorPalette />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-background py-2 px-4 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-4 w-full bg-muted">
            <TabsTrigger value="prompt-builder" className="data-[state=active]:bg-background">
              <PlusSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Prompt Builder</span>
              <span className="sm:hidden">Prompt</span>
            </TabsTrigger>
            
            <TabsTrigger value="image-analysis" className="data-[state=active]:bg-background">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Image Analysis</span>
              <span className="sm:hidden">Analysis</span>
            </TabsTrigger>
            
            <TabsTrigger value="multiple-image-analysis" className="data-[state=active]:bg-background">
              <Images className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Batch Analysis</span>
              <span className="sm:hidden">Batch</span>
            </TabsTrigger>
            
            <TabsTrigger value="saved-prompts" className="data-[state=active]:bg-background">
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Saved Prompts</span>
              <span className="sm:hidden">Saved</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="prompt-builder" className="mt-0">
            <PromptBuilder />
          </TabsContent>
          
          <TabsContent value="image-analysis" className="mt-0">
            <ImageAnalysis />
          </TabsContent>
          
          <TabsContent value="multiple-image-analysis" className="mt-0">
            <MultipleImageAnalysis />
          </TabsContent>
          
          <TabsContent value="saved-prompts" className="mt-0">
            <SavedPrompts />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="mt-8 pb-4 text-center text-sm text-muted-foreground">
        <p>Stable Diffusion Prompt Builder &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}