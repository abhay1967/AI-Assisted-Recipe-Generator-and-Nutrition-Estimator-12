"use client"

import { useEffect, useRef } from "react"
import { Chart, ArcElement, Tooltip, Legend, PieController, type ChartConfiguration } from "chart.js"

Chart.register(PieController, ArcElement, Tooltip, Legend)

interface NutritionChartProps {
  nutrition: {
    protein: number
    carbs: number
    fat: number
  }
}

export function NutritionChart({ nutrition }: NutritionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Destroy previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Use fixed palette to avoid theme/CSS variable issues
    const colors = ["#3B82F6", "#10B981", "#F59E0B"] // blue-500, emerald-500, amber-500

    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: "doughnut",
      data: {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            data: [nutrition.protein, nutrition.carbs, nutrition.fat],
            backgroundColor: colors,
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "hsl(var(--foreground))",
              padding: 16,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.parsed || 0
                return `${label}: ${value}g`
              },
            },
          },
        },
      },
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [nutrition])

  return (
    <div className="max-w-xs mx-auto" style={{ height: 260 }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
