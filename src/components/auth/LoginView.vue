<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStores'

const appName = import.meta.env.VITE_APP_NAME

// Usar el store de autenticación
const authStore = useAuthStore()
const { estaAutenticado, estaCargando, error } = storeToRefs(authStore)

// Agregar después de usar useAuth()
console.log('🔍 LoginView: Estado inicial -', {
  estaAutenticado: estaAutenticado.value,
  estaCargando: estaCargando.value,
  error: error.value
})

const emit = defineEmits<{
  'login-success': []
}>()

const form = reactive({
  email: '',
  password: '',
})

const errorLocal = ref<string>('')

// Watch para detectar cuando la autenticación cambia a true
watch(estaAutenticado, (newValue) => {
  console.log('🔍 LoginView: Cambio en estaAutenticado -', newValue)
  if (newValue) {
    console.log('Login exitoso - Redirigiendo...')
    emit('login-success')
  }
})

const handleSubmit = async () => {
  errorLocal.value = ''

  console.log('Intentando login...', { email: form.email })

  const success = await authStore.login({
    email: form.email,
    password: form.password,
  })

  if (success) {
    console.log('Login procesado exitosamente')
    // El watch se encargará de emitir el evento cuando isAuthenticated cambie
  } else {
    errorLocal.value = error.value || 'Error al iniciar sesión'
    console.error('Error en login:', error.value)
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
        <p class="mt-2 text-center text-sm text-gray-600">Accede a {{ appName }}</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              placeholder="Correo electrónico"
              :disabled="estaCargando"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              placeholder="Contraseña"
              :disabled="estaCargando"
            />
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorLocal" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 text-sm">{{ errorLocal }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="estaCargando"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="estaCargando" class="flex items-center">
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
              ></div>
              Iniciando sesión...
            </span>
            <span v-else> Iniciar Sesión </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
