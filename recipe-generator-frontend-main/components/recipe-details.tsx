"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleFavorite } from "@/services/api"
import { NutritionChart } from "@/components/nutrition-chart"

interface RecipeDetailsProps {
  recipe: any
  onRecipeUpdate?: (recipe: any) => void
}

export function RecipeDetails({ recipe, onRecipeUpdate }: RecipeDetailsProps) {
  const [isFavoriting, setIsFavoriting] = useState(false)

  useEffect(() => {
    console.log("[v0] Recipe data received:", recipe)
    console.log("[v0] Nutrition data:", recipe?.nutrition)
  }, [recipe])

  const handleToggleFavorite = async () => {
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

  if (!recipe) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl text-balance">{recipe.title}</CardTitle>
            <Button
              variant={recipe.isFavorite ? "default" : "outline"}
              size="icon"
              onClick={handleToggleFavorite}
              disabled={isFavoriting}
            >
              <Heart className={`size-4 ${recipe.isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient: any, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span className="font-medium">{ingredient.quantity}g</span>
                  <span className="text-muted-foreground">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions?.map((instruction: string, index: number) => (
                <li key={index} className="flex gap-3 text-sm leading-relaxed">
                  <span className="font-semibold text-primary min-w-6">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Calories</p>
              <p className="text-2xl font-semibold">{recipe.nutrition?.calories || 0}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Protein</p>
              <p className="text-2xl font-semibold">{recipe.nutrition?.protein || 0}g</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Carbs</p>
              <p className="text-2xl font-semibold">{recipe.nutrition?.carbs || 0}g</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Fat</p>
              <p className="text-2xl font-semibold">{recipe.nutrition?.fat || 0}g</p>
            </div>
          </div>

          {recipe.nutrition && <NutritionChart nutrition={recipe.nutrition} />}
        </CardContent>
      </Card>
    </div>
  )
}
