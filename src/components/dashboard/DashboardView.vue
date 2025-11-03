<script setup lang="ts">
import type { Usuario } from '@/types/auth'

interface Props {
  user: Usuario
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [section: string]
}>()

const appName = import.meta.env.VITE_APP_NAME
const apiUrl = import.meta.env.VITE_APP_URL
</script>

<template>
  <div class="space-y-6">
    <!-- Banner de bienvenida -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg text-white p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">¡Bienvenido, {{ user.nombre }}!</h1>
          <p class="opacity-90">Has iniciado sesión correctamente en {{ appName }}</p>
        </div>
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-2xl">👋</span>
        </div>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Tipo de Usuario</p>
            <p class="text-lg font-semibold text-gray-800 capitalize">{{ user.tipo }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-500">👤</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Sesión Activa</p>
            <p class="text-lg font-semibold text-gray-800">Conectado</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-green-500">✅</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Email Verificado</p>
            <p class="text-lg font-semibold text-gray-800">{{ user.email }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span class="text-purple-500">📧</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones principales -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Acciones Disponibles</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          @click="$emit('navigate', 'usuarios')"
          class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
        >
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors"
          >
            <span class="text-blue-600 text-xl">👥</span>
          </div>
          <h3 class="font-semibold text-gray-800 mb-1">Gestión de Usuarios</h3>
          <p class="text-sm text-gray-600">Administrar usuarios del sistema</p>
        </button>

        <button
          @click="$emit('navigate', 'libros')"
          class="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group"
        >
          <div
            class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors"
          >
            <span class="text-green-600 text-xl">📚</span>
          </div>
          <h3 class="font-semibold text-gray-800 mb-1">Catálogo de Libros</h3>
          <p class="text-sm text-gray-600">Explorar y gestionar libros</p>
        </button>

        <button
          @click="$emit('navigate', 'prestamos')"
          class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group"
        >
          <div
            class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors"
          >
            <span class="text-purple-600 text-xl">🔄</span>
          </div>
          <h3 class="font-semibold text-gray-800 mb-1">Préstamos</h3>
          <p class="text-sm text-gray-600">Gestionar préstamos de libros</p>
        </button>
      </div>
    </div>

    <!-- Información de la API -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 class="font-medium text-gray-700 mb-2">Información de Conexión</h3>
      <div class="text-sm text-gray-600 space-y-1">
        <p>
          🔗 Conectado a: <code class="bg-gray-100 px-2 py-1 rounded">{{ apiUrl }}</code>
        </p>
        <p>
          🆔 User ID: <code class="bg-gray-100 px-2 py-1 rounded">{{ user.usuario_id }}</code>
        </p>
        <p>👤 Nombre completo: {{ user.nombre }} {{ user.apellido }}</p>
      </div>
    </div>
  </div>
</template>
