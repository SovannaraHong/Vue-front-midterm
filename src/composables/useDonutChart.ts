// src/composables/useDonutChart.ts
import { Chart, type ChartConfiguration } from 'chart.js/auto'
import type { Ref } from 'vue'

export interface DonutSlice {
  label: string
  value: number
  color: string
}

export function useDonutChart(canvasRef: Ref<HTMLCanvasElement | null>, slices: DonutSlice[]) {
  const canvas = canvasRef.value
  if (!canvas) return null

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Destroy any existing chart bound to this canvas before creating a new one
  // (prevents "Canvas is already in use" when this runs again on refetch)
  const existing = Chart.getChart(canvas)
  existing?.destroy()

  const config: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: {
      labels: slices.map((s) => s.label),
      datasets: [
        {
          data: slices.map((s) => s.value),
          backgroundColor: slices.map((s) => s.color),
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: { legend: { display: false } },
    },
  }

  return new Chart(ctx, config)
}
