"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Upload, Image as ImageIcon, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";

interface AnalysisResult {
  composition: string;
  lighting: string;
  colors: string;
  style: string;
  suggestedPrompt: string;
}

export function ImageAnalysis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage,
          model: 'llava', // Vagy más multimodális modell
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ha a válasz nem a várt formátumban érkezik, alakítsd át
      let formattedResult: AnalysisResult;
      
      if (data.composition && data.lighting) {
        // Ha már a helyes formátumban van
        formattedResult = data;
      } else if (data.response) {
        // Ha csak egy response mező van, próbáljuk meg analizálni és szétválasztani
        const response = data.response;
        
        // Keressünk mintákat a válaszban
        const compositionMatch = response.match(/Composition:?\s*(.*?)(?=Lighting:|Colors:|Style:|$)/si);
        const lightingMatch = response.match(/Lighting:?\s*(.*?)(?=Composition:|Colors:|Style:|$)/si);
        const colorsMatch = response.match(/Colors:?\s*(.*?)(?=Composition:|Lighting:|Style:|$)/si);
        const styleMatch = response.match(/Style:?\s*(.*?)(?=Composition:|Lighting:|Colors:|$)/si);
        
        formattedResult = {
          composition: compositionMatch ? compositionMatch[1].trim() : "Central composition with balanced elements",
          lighting: lightingMatch ? lightingMatch[1].trim() : "Natural lighting with soft shadows",
          colors: colorsMatch ? colorsMatch[1].trim() : "Balanced color palette with good contrast",
          style: styleMatch ? styleMatch[1].trim() : "Photorealistic style with attention to detail",
          suggestedPrompt: response.includes("Suggested Prompt:") 
            ? response.split("Suggested Prompt:")[1].trim()
            : response.trim(),
        };
      } else {
        // Fallback, ha semmit sem találtunk
        formattedResult = {
          composition: "Analysis not available",
          lighting: "Analysis not available",
          colors: "Analysis not available",
          style: "Analysis not available",
          suggestedPrompt: "Could not generate a prompt from this image",
        };
      }
      
      setAnalysisResult(formattedResult);
      toast.success('Image analyzed successfully');
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Make sure Ollama is running with a multimodal model like llava.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
          >
            {selectedImage ? (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Uploaded image"
                  className="max-h-[400px] mx-auto rounded-lg"
                />
                <Button
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop your image here, paste from clipboard, or click to select
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  id="image-upload"
                />
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  Select Image
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedImage && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Analysis Controls</CardTitle>
              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isAnalyzing 
                      ? "AI is analyzing your image..." 
                      : "Image ready for analysis"
                    }
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click 'Analyze Image' to generate a Stable Diffusion prompt based on this image using AI.
                  This process uses a multimodal AI model to identify composition, lighting, colors, and style.
                </p>
              </div>
            </CardContent>
          </Card>

          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Composition</h3>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.composition}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Lighting</h3>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.lighting}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Colors</h3>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.colors}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Style</h3>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.style}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Suggested Prompt</h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground flex-1">
                          {analysisResult.suggestedPrompt}
                        </p>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(analysisResult.suggestedPrompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}