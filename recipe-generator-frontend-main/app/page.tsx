"use client"

import { useState } from "react"
import { RecipeForm } from "@/components/recipe-form"
import { RecipeDetails } from "@/components/recipe-details"
import { Favorites } from "@/components/favorites"
import { Button } from "@/components/ui/button"
import { ChefHat, Heart, Sparkles } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"generate" | "favorites">("generate")
  const [currentRecipe, setCurrentRecipe] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <ChefHat className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                AI Recipe Generator
                <Sparkles className="size-4 text-primary" />
              </h1>
              <p className="text-xs text-muted-foreground">Powered by AI & Nutrition Data</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <Button
              variant={activeTab === "generate" ? "default" : "ghost"}
              onClick={() => setActiveTab("generate")}
              className="gap-2"
            >
              <Sparkles className="size-4" />
              Generate
            </Button>
            <Button
              variant={activeTab === "favorites" ? "default" : "ghost"}
              onClick={() => setActiveTab("favorites")}
              className="gap-2"
            >
              <Heart className="size-4" />
              Favorites
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "generate" ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <RecipeForm onRecipeGenerated={setCurrentRecipe} />
            </div>
            <div>
              {currentRecipe ? (
                <RecipeDetails recipe={currentRecipe} onRecipeUpdate={setCurrentRecipe} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-border rounded-xl bg-card/50 backdrop-blur">
                  <div className="flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
                    <ChefHat className="size-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-center text-lg font-medium mb-2">No Recipe Yet</p>
                  <p className="text-muted-foreground/70 text-center text-sm max-w-xs">
                    Enter ingredients or describe a dish to generate your personalized recipe
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Favorites onRecipeSelect={setCurrentRecipe} />
        )}
      </main>
    </div>
  )
}
