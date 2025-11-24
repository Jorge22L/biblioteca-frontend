<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStores'
import HealthCheck from '@/components/common/HealthCheck.vue'
import LoadingState from '@/components/states/LoadingState.vue'
import UserMenu from '@/components/auth/UserMenu.vue'

const appName = import.meta.env.VITE_APP_NAME
const showHealthCheck = import.meta.env.MODE === 'development'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const { estaAutenticado, usuarioActual, estadoAuth } = storeToRefs(authStore)

const usuarioListo = computed(() => {
  return usuarioActual.value && usuarioActual.value.usuario_id > 0
})

console.log('🔍 AppLayout - Montado - usuarioActual:', usuarioActual.value)

const handleLogout = async () => {
  console.log('🚪 Logout iniciado desde Layout')
  await authStore.logout()
  router.push('/login')
}

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  console.log('🚀 AppLayout: Inicializando aplicación...')
  authStore.inicializarAuth()
})
</script>

<template>
  <div class="min-h-screen bg-base-300">
    <!-- Header siempre visible cuando está autenticado -->
    <header v-if="estaAutenticado && usuarioListo" class="bg-neutral shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-neutral-content">{{ appName }}</h1>
          <nav class="hidden md:flex items-center gap-2">
            <button
              @click="navigateTo('/')"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                route.name === 'dashboard'
                  ? 'bg-primary text-primary-content'
                  : 'text-neutral-content hover:bg-base-200'
              ]"
            >
              Dashboard
            </button>
            <button
              @click="navigateTo('/usuarios')"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                route.name === 'usuarios'
                  ? 'bg-primary text-primary-content'
                  : 'text-neutral-content hover:bg-base-200'
              ]"
            >
              Usuarios
            </button>
            <button
              @click="navigateTo('/libros')"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                route.name === 'libros'
                  ? 'bg-primary text-primary-content'
                  : 'text-neutral-content hover:bg-base-200'
              ]"
            >
              Libros
            </button>
            <button
              @click="navigateTo('/prestamos')"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                route.name === 'prestamos'
                  ? 'bg-primary text-primary-content'
                  : 'text-neutral-content hover:bg-base-200'
              ]"
            >
              Préstamos
            </button>
          </nav>
          <UserMenu :user="usuarioActual" @logout="handleLogout" />
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main :class="estaAutenticado && usuarioListo ? 'container mx-auto px-4 py-6' : ''">
      <!-- Estado de carga global -->
      <div v-if="estadoAuth === 'verificando'">
        <LoadingState message="Verificando sesión..." />
      </div>

      <!-- Contenido de las rutas hijas -->
      <RouterView />
    </main>

    <!-- Health Check -->
    <!-- <HealthCheck
      v-if="showHealthCheck"
      :auto-check="true"
      :show-details="false"
      class="fixed bottom-4 right-4 w-80"
    /> -->
  </div>
</template>
