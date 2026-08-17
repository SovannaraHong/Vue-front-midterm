import { Chart, type ChartConfiguration } from 'chart.js/auto'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export interface LineChartDataset {
  label: string
  data: number[]
  color: string
}

/**
 * Renders the gradient area line chart used on the earnings card.
 * Call `update(labels, datasets)` whenever real data becomes available
 * (e.g. after an async fetch) to redraw with actual numbers.
 */
export function useLineChart(canvasRef: Ref<HTMLCanvasElement | null>) {
  let chart: Chart | null = null

  const hexToRgba = (hex: string, alpha: number) => {
    const bigint = parseInt(hex.replace('#', ''), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r},${g},${b},${alpha})`
  }

  const render = (labels: string[] = [], datasets: LineChartDataset[] = []) => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    chart?.destroy()

    const allValues = datasets.flatMap((d) => d.data)
    const maxVal = allValues.length > 0 ? Math.max(...allValues) : 10

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((ds) => {
          const fill = ctx.createLinearGradient(0, 0, 0, 220)
          fill.addColorStop(0, hexToRgba(ds.color, 0.35))
          fill.addColorStop(1, hexToRgba(ds.color, 0))

          return {
            label: ds.label,
            data: ds.data,
            borderColor: ds.color,
            backgroundColor: fill,
            fill: true,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: ds.color,
            borderWidth: 3,
          }
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8 },
        },
        scales: {
          y: {
            min: 0,
            max: Math.ceil(maxVal * 1.2) || 10,
            grid: { color: '#f1f1f5' },
            ticks: { color: '#a3a9b7', font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#a3a9b7', font: { size: 11 } },
          },
        },
      },
    }

    chart = new Chart(ctx, config)
  }

  const update = (labels: string[], datasets: LineChartDataset[]) => {
    render(labels, datasets)
  }

  const destroy = () => {
    chart?.destroy()
    chart = null
  }

  onMounted(() => render())
  onBeforeUnmount(destroy)

  return { update, destroy }
}
