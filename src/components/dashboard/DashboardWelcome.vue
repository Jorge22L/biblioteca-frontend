<script setup lang="ts">
defineEmits<{
  'start-auth': []
  'explore-api': []
  'check-docs': []
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Tarjeta de bienvenida -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-2xl">🎉</span>
        </div>
        <h2 class="text-2xl font-bold text-green-700 mb-2">¡Todo Listo!</h2>
        <p class="text-gray-600">
          La API está funcionando correctamente. Puedes comenzar a implementar las funcionalidades.
        </p>
      </div>
    </div>

    <!-- Próximos pasos -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Autenticación -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <span>🔐</span>
          Autenticación
        </h3>
        <ul class="text-blue-700 text-sm space-y-2">
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            Servicio de login/logout
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            Formulario de inicio de sesión
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            Gestión de tokens
          </li>
        </ul>
      </div>

      <!-- Gestión de Datos -->
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <h3 class="font-semibold text-purple-800 mb-3 flex items-center gap-2">
          <span>📚</span>
          Gestión de Datos
        </h3>
        <ul class="text-purple-700 text-sm space-y-2">
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            CRUD de Usuarios
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            CRUD de Libros
          </li>
          <li class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            Gestión de Préstamos
          </li>
        </ul>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
      <h3 class="font-semibold text-gray-800 mb-4">🚀 Comenzar Implementación</h3>
      <div class="flex flex-wrap gap-3">
        <button
          @click="$emit('start-auth')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Implementar Autenticación
        </button>
        <button
          @click="$emit('explore-api')"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Explorar Endpoints
        </button>
        <button
          @click="$emit('check-docs')"
          class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Ver Documentación
        </button>
      </div>
    </div>
  </div>
</template>
