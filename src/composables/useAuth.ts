import { authService } from '@/services/authService'
import type { LoginCredentials, Usuario } from '@/types/auth'
import { computed, ref } from 'vue'

export const useAuth = () => {
  // Estado reactivo
  const usuarioActual = ref<Usuario | null>(null)
  const estadoAuth = ref<'inactivo' | 'verificando' | 'autenticado' | 'no autenticado'>('inactivo')
  const error = ref<string | null>(null)

  // Computed
  const estaAutenticado = computed(() => estadoAuth.value === 'autenticado')
  const estaCargando = computed(() => estadoAuth.value === 'verificando')

  // Métodos
  const inicializarAuth = async (): Promise<void> => {
    estadoAuth.value = 'verificando'
    error.value = null
    try {
      const token = authService.getToken()
      const usuarioAlmacenado = authService.getStoredUser()

      if (token && usuarioAlmacenado) {
        const usuario = await authService.getCurrentUser()
        usuarioActual.value = usuario
        estadoAuth.value = 'autenticado'
        console.info('Sesión validada:', usuario.email)
      } else {
        estadoAuth.value = 'no autenticado'
        console.info('No hay sesión activa')
      }
    } catch (error: any) {
      console.error('Error validando sesión:', error.message)
      authService.clearAuthData()
      usuarioActual.value = null
      estadoAuth.value = 'no autenticado'
      error.value = error.message
    }
  }

  const login = async (credenciales: LoginCredentials): Promise<boolean> => {
    estadoAuth.value = 'verificando'
    error.value = null
    try {
      const respuestaAuth = await authService.login(credenciales)
      usuarioActual.value = respuestaAuth.usuario
      estadoAuth.value = 'autenticado'
      console.info('Login exitoso:', respuestaAuth.usuario.email)
      return true
    } catch (err: any) {
      console.error('Error en login:', err.message)
      error.value = err.message
      estadoAuth.value = 'no autenticado'
      return false
    }
  }

  const logout = async (): Promise<void> => {
    console.log('useAuth: Iniciando logout...')
    try {
      await authService.logout()
      console.log('useAuth: Logout exitoso en servicio')
    } catch (err: any) {
      console.warn('useAuth: Error durante logout:', err.message)
    } finally {
      usuarioActual.value = null
      estadoAuth.value = 'no autenticado'
      error.value = null
      console.log('useAuth: Estado actualizado a no autenticado')
    }
  }

  return {
    // Estado
    usuarioActual: computed(() => usuarioActual.value),
    estadoAuth: computed(() => estadoAuth.value),
    error: computed(() => error.value),

    // Computed
    estaAutenticado,
    estaCargando,

    // Métodos
    inicializarAuth,
    login,
    logout,
  }
}