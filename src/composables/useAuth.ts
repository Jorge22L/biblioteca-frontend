import { authService } from '@/services/authService'
import type { LoginCredentials } from '@/types/auth'
import { computed, onMounted, ref } from 'vue'

export const useAuth = () => {
  // Estado reactivo
  const currentUser = ref<User | null>(null)
  const authStatus = ref<'idle' | 'checking' | 'autenticado' | 'no autenticado'>('idle')
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => authStatus.value === 'autenticado')
  const isLoading = computed(() => authStatus.value === 'checking')

  // Métodos

  const initializeAuth = async (): Promise<void> => {
    authStatus.value = 'checking'
    error.value = null
    try {
      // Verificar si hay token almacenado
      const token = authService.getToken()
      const storedUser = authService.getStoredUser()

      if (token && storedUser) {
        // Intentar validar el token con el endpoint /me
        const user = await authService.getCurrentUser()
        currentUser.value = user
        authStatus.value = 'autenticado'
        console.info('Sesion validada ', user.email)
      } else {
        authStatus.value = 'no autenticado'
        console.info('No hay sesión activa')
      }
    } catch (error: any) {
      console.error('Error validando sesión: ', error.message)
      authService.clearAuthData()
      currentUser.value = null
      authStatus.value = 'no autenticado'
      error.value = error.message
    }
  }

  const login = async (credenciales: LoginCredentials): Promise<boolean> => {
    authStatus.value = 'checking'
    error.value = null
    try {
      const authResponse = await authService.login(credenciales)
      authStatus.value = 'autenticado'
      console.info('Login exitoso ', authResponse.usuario.email)
      return true
    } catch (err: any) {
      console.error('Error en login: ', err.message)
      error.value = err.message
      authStatus.value = 'no autenticado'
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (err: any) {
      console.warn('⚠️ Error durante logout:', err.message)
    } finally {
      currentUser.value = null
      authStatus.value = 'no autenticado'
      error.value = null
      console.info('Sesión cerrada')
    }
  }

  onMounted(() => {})

  return {
    // Estado
    currentUser: computed(() => currentUser.value),
    authStatus: computed(() => authStatus.value),
    error: computed(() => error.value),

    // Computed
    isAuthenticated,
    isLoading,

    // Métodos
    initializeAuth,
    login,
    logout,
  }
}
