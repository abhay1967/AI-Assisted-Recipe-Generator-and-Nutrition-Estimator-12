"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeCard } from "@/components/recipe-card"
import { getFavoriteRecipes } from "@/services/api"
import { Loader2, Heart } from "lucide-react"

interface FavoritesProps {
  onRecipeSelect: (recipe: any) => void
}

export function Favorites({ onRecipeSelect }: FavoritesProps) {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    setError(null)
    try {
      const recipes = await getFavoriteRecipes()
      setFavorites(recipes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load favorites")
    } finally {
      setLoading(false)
    }
  }

  const handleRecipeUpdated = (updatedRecipe: any) => {
    // Remove from favorites if unfavorited
    if (!updatedRecipe.isFavorite) {
      setFavorites(favorites.filter((r) => r.id !== updatedRecipe.id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-5" />
            Favorite Recipes
          </CardTitle>
          <CardDescription>Recipes you've favorited will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-center">
              No favorite recipes yet.
              <br />
              Generate and favorite a recipe to see it here!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Heart className="size-6 fill-current text-primary" />
          Favorite Recipes
        </h2>
        <p className="text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? "recipe" : "recipes"} saved
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onRecipeSelect(recipe)}
            onRecipeUpdate={handleRecipeUpdated}
          />
        ))}
      </div>
    </div>
  )
}
