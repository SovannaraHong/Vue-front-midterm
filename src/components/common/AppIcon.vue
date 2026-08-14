<script setup lang="ts">
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faHouse,
  faTableCells,
  faLayerGroup,
  faSliders,
  faPen,
  faCode,
  faChartBar,
  faTable,
  faMessage,
  faBell,
  faStar,
  faLocationDot,
  faUser,
  faTriangleExclamation,
  faFile,
  faCartShopping,
  faEnvelope,
  faCalendar,
  faSquareCheck,
  faImage,
  faBookOpen,
  faMagnifyingGlass,
  faFilter,
  faHeart,
  faCartPlus,
  faPlus,
  faMinus,
  faTrash,
  faXmark,
  faBars,
  faDownload,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

import type { IconName } from '@/types/icon'

interface Props {
  name: IconName
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
})

const icons = {
  home: faHouse,
  grid: faTableCells,
  layers: faLayerGroup,
  sliders: faSliders,
  edit: faPen,
  code: faCode,
  barChart: faChartBar,
  table: faTable,
  messageSquare: faMessage,
  bell: faBell,
  star: faStar,
  mapPin: faLocationDot,
  user: faUser,
  alertTriangle: faTriangleExclamation,
  file: faFile,
  shoppingCart: faCartShopping,
  mail: faEnvelope,
  calendar: faCalendar,
  checkSquare: faSquareCheck,
  image: faImage,
  bookOpen: faBookOpen,

  search: faMagnifyingGlass,
  filter: faFilter,
  heart: faHeart,
  cart: faCartPlus,
  plus: faPlus,
  minus: faMinus,
  trash: faTrash,
  x: faXmark,
  menu: faBars,

  download: faDownload,
  chevronLeft: faChevronLeft,
  chevronRight: faChevronRight,
}

const icon = computed(() => icons[props.name])
</script>

<template>
  <FontAwesomeIcon
    :icon="icon"
    :style="{ fontSize: `${size}px` }"
  />
</template>
