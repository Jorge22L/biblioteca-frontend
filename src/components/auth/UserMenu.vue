<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Usuario } from '@/types/auth'

interface Props {
  user: Usuario
}

const props = defineProps<Props>()
const emit = defineEmits<{
  logout: []
}>()

const isMenuOpen = ref(false)

const userInitials = computed(() => {
  return `${props.user.nombre.charAt(0)}${props.user.apellido.charAt(0)}`.toUpperCase()
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  emit('logout')
  isMenuOpen.value = false
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isMenuOpen.value = false
  }
}

// Agregar event listener para clics fuera
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>
<template>
  <div class="relative">
    <!-- Botón del usuario -->
    <button
      @click="toggleMenu"
      class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
    >
      <div
        class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
      >
        {{ userInitials }}
      </div>
      <span class="text-sm text-gray-700 hidden sm:block">{{ user.nombre }}</span>
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    <!-- Menú desplegable -->
    <div
      v-if="isMenuOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <div class="px-4 py-2 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-900">{{ user.nombre }} {{ user.apellido }}</p>
        <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
        <p class="text-xs text-gray-400 mt-1">Tipo: {{ user.tipo }}</p>
      </div>

      <button
        @click="handleLogout"
        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>
