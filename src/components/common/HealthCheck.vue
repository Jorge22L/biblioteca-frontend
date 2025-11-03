<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { checkApiConnection, checkStoredAuth } from '@/utils/config-checker'

// Props (opcional, para hacerlo reutilizable)
interface Props {
  autoCheck?: boolean
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoCheck: true,
  showDetails: true,
})

// Emits para comunicación con parent
const emit = defineEmits<{
  statusChange: [status: 'checking' | 'connected' | 'error']
  healthChecked: [result: { connected: boolean; error?: string }]
}>()

// Estado del componente
const status = ref<'checking' | 'connected' | 'error'>('checking')
const errorDetails = ref<string>('')
const isChecking = ref(false)
const authStatus = ref({ hasToken: false, hasUser: false })

// Computed properties
const statusText = computed(() => {
  switch (status.value) {
    case 'checking':
      return 'Verificando...'
    case 'connected':
      return 'Conectado'
    case 'error':
      return 'No Conectado'
    default:
      return 'Desconocido'
  }
})

const statusClasses = computed(() => {
  switch (status.value) {
    case 'checking':
      return 'bg-yellow-100 text-yellow-800'
    case 'connected':
      return 'bg-green-100 text-green-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const showRecommendations = computed(() => props.showDetails && status.value !== 'checking')
const hasStoredAuth = computed(() => authStatus.value.hasToken || authStatus.value.hasAuth)

// Configuración desde env
const apiUrl = import.meta.env.VITE_APP_URL || 'http://localhost:9000/api'
const mode = import.meta.env.MODE || 'development'

// Métodos
const checkHealth = async (): Promise<void> => {
  isChecking.value = true
  status.value = 'checking'
  errorDetails.value = ''

  try {
    const connection = await checkApiConnection()

    status.value = connection.connected ? 'connected' : 'error'
    errorDetails.value = connection.error || ''

    // Actualizar estado de autenticación
    authStatus.value = checkStoredAuth()

    // Emitir eventos
    emit('statusChange', status.value)
    emit('healthChecked', {
      connected: connection.connected,
      error: connection.error,
    })
  } catch (error: any) {
    status.value = 'error'
    errorDetails.value = `Error inesperado: ${error.message}`
  } finally {
    isChecking.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (props.autoCheck) {
    checkHealth()
  }
})

// Exponer métodos al parent (opcional)
defineExpose({
  checkHealth,
  getStatus: () => status.value,
})
</script>
<template>
  <div class="health-check">
    <!-- Estado principal -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <span class="text-gray-600">Estado del Sistema</span>
        <button
          @click="checkHealth"
          :disabled="isChecking"
          class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
        ></button>
      </h2>

      <div class="space-y-3">
        <!-- Estado de API -->
        <div class="flex justify-between items-center">
          <span class="text-gray-600">API Laravel:</span>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded text-sm font-medium" :class="statusClasses">
              {{ statusText }}
            </span>
            <div
              v-if="isChecking"
              class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
        </div>

        <!-- Detalles del error -->
        <div v-if="errorDetails" class="bg-red-50 border border-red-200 rounded p-3">
          <p class="text-red-700 text-sm font-medium">Detalles del error:</p>
          <p class="text-red-600 text-sm mt-1">{{ errorDetails }}</p>
        </div>

        <!-- Información de configuración -->
        <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p class="text-xs text-gray-500">URL API</p>
            <p class="text-sm font-mono text-blue-600 truncate" :title="apiUrl">
              {{ apiUrl }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Modo</p>
            <p class="text-sm text-gray-700">{{ mode }}</p>
          </div>
        </div>

        <!-- Autenticación almacenada -->
        <div v-if="hasStoredAuth" class="bg-green-50 border border-green-200 rounded p-3">
          <p class="text-green-700 text-sm font-medium">Sesión almacenada</p>
          <p class="text-green-600 text-xs mt-1">Hay datos de autenticación en el navegador</p>
        </div>
      </div>
    </div>

    <!-- Recomendaciones según estado -->
    <div v-if="showRecommendations" class="mt-4">
      <div v-if="status === 'connected'" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 class="font-semibold text-green-800 mb-2">Listo para continuar</h3>
        <p class="text-green-700 text-sm">
          La API está respondiendo correctamente. Puedes implementar el sistema de autenticación.
        </p>
      </div>

      <div v-else-if="status === 'error'" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 class="font-semibold text-red-800 mb-2">❌ Acción requerida</h3>
        <ul class="text-red-700 text-sm list-disc list-inside space-y-1">
          <li>
            Inicia el servidor Laravel:
            <code class="bg-red-100 px-1 rounded">php artisan serve</code>
          </li>
          <li>
            Verifica que el puerto coincida con:
            <code class="bg-red-100 px-1 rounded">{{ apiUrl }}</code>
          </li>
          <li>Confirma que CORS esté configurado en Laravel</li>
        </ul>
      </div>
    </div>
  </div>
</template>
