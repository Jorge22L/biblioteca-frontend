<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import HealthCheck from '@/components/common/HealthCheck.vue'
import LoadingState from '@/components/states/LoadingState.vue'
import LoginView from '@/components/auth/LoginView.vue'
import DashboardView from '@/components/dashboard/DashboardView.vue'
import UserMenu from '@/components/auth/UserMenu.vue'
import { useAuth } from '@/composables/useAuth'

const appName = import.meta.env.VITE_APP_NAME
const showHealthCheck = import.meta.env.MODE === 'development'

// Usar el composable de autenticación
const { 
  estaAutenticado, 
  usuarioActual, 
  estadoAuth, 
  inicializarAuth,
  logout 
} = useAuth()

const apiStatus = ref<'checking' | 'conectado' | 'error'>('checking')

// Watch para debuggear cambios de autenticación
watch(estaAutenticado, (newValue) => {
  console.log('🔄 Estado de autenticación cambiado:', newValue)
})

watch(estadoAuth, (newValue) => {
  console.log('🔄 estadoAuth cambiado:', newValue)
})

const handleApiStatusChange = (status: 'checking' | 'conectado' | 'error') => {
  apiStatus.value = status
  console.log('🌐 Estado API:', status)
}

const handleLoginSuccess = () => {
  console.log('🎉 Evento login-success recibido en Layout')
}

const handleLogout = async () => {
  console.log('🚪 Logout iniciado desde Layout')
  await logout() //LLAMAR AL MÉTODO logout
}

// Inicializar autenticación inmediatamente
onMounted(() => {
  console.log('🚀 Inicializando aplicación...')
  inicializarAuth() //LLAMAR AL MÉTODO inicializarAuth
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header condicional - solo mostrar cuando esté autenticado -->
    <header v-if="estaAutenticado" class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-800">{{ appName }}</h1>
          <UserMenu :user="usuarioActual" @logout="handleLogout" />
        </div>
      </div>
    </header>

    <!-- Contenido principal dinámico -->
    <main :class="estaAutenticado ? 'container mx-auto px-4 py-6' : ''">
      <!-- Estado: Verificando autenticación (PRIMERO) -->
      <div v-if="estadoAuth === 'verificando'">
        <LoadingState message="Verificando sesión..." />
      </div>

      <!-- Estado: No autenticado -->
      <div v-else-if="!estaAutenticado">
        <LoginView @login-success="handleLoginSuccess" />
      </div>

      <!-- Estado: Autenticado -->
      <div v-else-if="estaAutenticado">
        <DashboardView :user="usuarioActual" @logout="handleLogout" />
      </div>

      <!-- Estado por defecto -->
      <div v-else>
        <LoadingState message="Cargando aplicación..." />
      </div>
    </main>

    <!-- Health Check separado - no bloquea la UI -->
    <HealthCheck
      v-if="showHealthCheck"
      :auto-check="true"
      :show-details="false"
      class="fixed bottom-4 right-4 w-80"
      @status-change="handleApiStatusChange"
    />
  </div>
</template>