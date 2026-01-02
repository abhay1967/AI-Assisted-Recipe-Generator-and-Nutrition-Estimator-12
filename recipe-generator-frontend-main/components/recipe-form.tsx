"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateRecipe } from "@/services/api"
import { parseIngredients, isDishPrompt } from "@/lib/parse-ingredients"
import { Loader2, Sparkles, Info } from "lucide-react"

interface RecipeFormProps {
  onRecipeGenerated: (recipe: any) => void
}

export function RecipeForm({ onRecipeGenerated }: RecipeFormProps) {
  const [input, setInput] = useState("")
  const [diet, setDiet] = useState("balanced")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)

    try {
      const isPrompt = isDishPrompt(input)

      console.log("[v0] Input detected as:", isPrompt ? "Dish prompt" : "Ingredient list")

      let requestBody: any

      if (isPrompt) {
        // Send as dish description
        requestBody = {
          dish: input.trim(),
          preferences: { diet },
        }
      } else {
        // Parse as ingredient list
        const ingredients = parseIngredients(input)
        console.log("[v0] Parsed ingredients:", ingredients)
        requestBody = {
          ingredients,
          preferences: { diet },
        }
      }

      const recipe = await generateRecipe(requestBody)
      console.log("[v0] Passing recipe to parent:", recipe)
      onRecipeGenerated(recipe)

      // Clear input on success
      setInput("")
    } catch (err) {
      console.error("[v0] Error generating recipe:", err)
      setError(err instanceof Error ? err.message : "Failed to generate recipe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Create Your Recipe
        </CardTitle>
        <CardDescription>Enter ingredients with quantities or describe what you want to cook</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients or Dish Description</Label>
            <Textarea
              id="ingredients"
              placeholder="Examples:&#10;&#10;Ingredient mode:&#10;Chicken breast 300g&#10;Olive oil 15g&#10;Garlic 2 cloves&#10;&#10;Dish mode:&#10;High-protein chicken dinner&#10;Vegan pasta with vegetables"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={10}
              className="resize-none font-mono text-sm"
            />
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <Info className="size-4 shrink-0 mt-0.5" />
              <p>
                <strong>Tip:</strong> For ingredient lists, put each on a new line with quantity. For dish ideas,
                describe what you want in a single sentence.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diet">Dietary Preference</Label>
            <Select value={diet} onValueChange={setDiet}>
              <SelectTrigger id="diet">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="high-protein">High Protein</SelectItem>
                <SelectItem value="low-carb">Low Carb</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading || !input.trim()}>
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                Generate Recipe
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
