<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStores' // ✅ CORREGIR: authStore

const appName = import.meta.env.VITE_APP_NAME
const router = useRouter()

// Usar el store de autenticación
const authStore = useAuthStore()
const { estaAutenticado, estaCargando, error } = storeToRefs(authStore)

// Debug inicial
console.log('🔍 LoginView: Estado inicial -', {
  estaAutenticado: estaAutenticado.value,
  estaCargando: estaCargando.value,
  error: error.value
})

const form = reactive({
  email: '',
  password: '',
})

const errorLocal = ref<string>('')

const handleSubmit = async () => {
  errorLocal.value = ''

  console.log('🔐 LoginView: Intentando login...', { email: form.email })

  const exito = await authStore.login({
    email: form.email,
    password: form.password,
  })

  if (exito) {
    console.log('✅ LoginView: Login procesado exitosamente')
  } else {
    errorLocal.value = error.value || 'Error al iniciar sesión'
    console.error('❌ LoginView: Error en login:', error.value)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center bg-base-200 justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-base-100 p-6 rounded-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Iniciar Sesión</h2>
        <p class="mt-2 text-center text-sm text-white">Accede a {{ appName }}</p>
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
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white rounded-lg focus:outline-white focus:ring-white focus:border-white focus:z-10 transition-all ease-in-out duration-500"
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
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white rounded-lg focus:outline-white focus:ring-white focus:border-white focus:z-10 transition-all ease-in-out duration-500"
              placeholder="Contraseña"
              :disabled="estaCargando"
            />
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorLocal" class="bg-red-50 border border-error rounded-lg p-4">
          <p class="text-error-content text-sm">{{ errorLocal }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="estaCargando"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-warning-content bg-warning hover:bg-warning-content hover:text-warning focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-info disabled:cursor-not-allowed transition-colors"
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
