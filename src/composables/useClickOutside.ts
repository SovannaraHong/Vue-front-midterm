import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(target: Ref<HTMLElement | null>, onOutside: () => void) {
  const handleClick = (event: MouseEvent) => {
    if (target.value && !target.value.contains(event.target as Node)) {
      onOutside()
    }
  }
  onMounted(() => document.addEventListener('mousedown', handleClick))
  onUnmounted(() => document.removeEventListener('mousedown', handleClick))
}
