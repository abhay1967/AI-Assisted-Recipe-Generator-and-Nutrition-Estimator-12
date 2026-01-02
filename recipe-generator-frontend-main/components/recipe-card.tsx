"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleFavorite } from "@/services/api"

interface RecipeCardProps {
  recipe: any
  onClick: () => void
  onRecipeUpdate?: (recipe: any) => void
}

export function RecipeCard({ recipe, onClick, onRecipeUpdate }: RecipeCardProps) {
  const [isFavoriting, setIsFavoriting] = useState(false)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!recipe?.id) return

    setIsFavoriting(true)
    try {
      const updatedRecipe = await toggleFavorite(recipe.id)
      if (onRecipeUpdate) {
        onRecipeUpdate(updatedRecipe)
      }
    } catch (error) {
      console.error("[v0] Failed to toggle favorite:", error)
    } finally {
      setIsFavoriting(false)
    }
  }

  return (
    <Card className="cursor-pointer hover:border-primary transition-colors" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg text-balance">{recipe.title}</CardTitle>
          <Button
            variant={recipe.isFavorite ? "default" : "outline"}
            size="icon"
            className="shrink-0"
            onClick={handleToggleFavorite}
            disabled={isFavoriting}
          >
            <Heart className={`size-4 ${recipe.isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Calories</p>
            <p className="font-semibold">{recipe.nutrition?.calories || 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Protein</p>
            <p className="font-semibold">{recipe.nutrition?.protein || 0}g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Carbs</p>
            <p className="font-semibold">{recipe.nutrition?.carbs || 0}g</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
