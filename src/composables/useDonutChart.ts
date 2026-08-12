import { Chart, type ChartConfiguration } from 'chart.js/auto'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export interface DonutSlice {
  label: string
  value: number
  color: string
}

export function useDonutChart(canvasRef: Ref<HTMLCanvasElement | null>, slices: DonutSlice[]) {
  let chart: Chart | null = null

  const render = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
        cutout: '70%',
        plugins: { legend: { display: false } },
      },
    }

    chart = new Chart(ctx, config)
  }

  onMounted(render)
  onBeforeUnmount(() => chart?.destroy())

  return { destroy: () => chart?.destroy() }
}
