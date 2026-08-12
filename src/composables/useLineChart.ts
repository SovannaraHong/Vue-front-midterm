import { Chart, type ChartConfiguration } from 'chart.js/auto'
import { onBeforeUnmount, onMounted, type Ref, watch } from 'vue'

/**
 * Renders the gradient area "Online / Store" line chart used on the
 * earnings card. Handles gradient creation, mount/unmount, and cleanup.
 */
export function useLineChart(canvasRef: Ref<HTMLCanvasElement | null>) {
  let chart: Chart | null = null

  const render = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const magentaFill = ctx.createLinearGradient(0, 0, 0, 220)
    magentaFill.addColorStop(0, 'rgba(236,72,153,0.35)')
    magentaFill.addColorStop(1, 'rgba(236,72,153,0)')

    const orangeFill = ctx.createLinearGradient(0, 0, 0, 220)
    orangeFill.addColorStop(0, 'rgba(251,146,60,0.35)')
    orangeFill.addColorStop(1, 'rgba(251,146,60,0)')

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Online',
            data: [12, 19, 14, 22, 18, 24],
            borderColor: '#ec4899',
            backgroundColor: magentaFill,
            fill: true,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: '#ec4899',
            borderWidth: 3,
          },
          {
            label: 'Store',
            data: [8, 10, 16, 12, 25, 15],
            borderColor: '#fb923c',
            backgroundColor: orangeFill,
            fill: true,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: '#fb923c',
            borderWidth: 3,
          },
        ],
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
            max: 35,
            grid: { color: '#f1f1f5' },
            ticks: { color: '#a3a9b7', stepSize: 5, font: { size: 11 } },
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

  const destroy = () => {
    chart?.destroy()
    chart = null
  }

  onMounted(render)
  onBeforeUnmount(destroy)
  watch(canvasRef, (next) => {
    if (next) {
      destroy()
      render()
    }
  })

  return { destroy }
}
