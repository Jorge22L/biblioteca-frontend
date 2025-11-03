import { env } from '@/config/env'
import apiClient from '@/services/api'

export const checkApiConnection = async (): Promise<{
  connected: boolean
  requiresAuth: boolean
  error?: string
}> => {
  try {
    console.info('Verificando conexión con API...')
    console.info('URL base: ', env.API_URL)

    // Crear timeout para detectar api
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 segundos

    try {
      // Intentar OPTIONS request
      const response = await apiClient.options('/login', {
        signal: controller.signal,
        timeout: 2000,
      })

      clearTimeout(timeoutId)
      console.info('API responde correctamente')
      return { connected: true, requiresAuth: true }
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('ERR_CONNECTION_REFUSED') ||
        error.name === 'AbortError'
      ) {
        console.error('API no conectada - Error de red')
        return { connected: false, requiresAuth: false, error: 'API no responde' }
      }
    }

    // Si recibimos error CORS
    if (error.message?.includes('CORS') || error.message?.includes('cors')) {
      console.warn('API no conectada - Error CORS')
      return {
        connected: false,
        requiresAuth: false,
        error: 'Error CORS - No se puede conectar con la API',
      }
    }

    // Cualquier otra respuesta
    console.info('API Conectada - Responde con error HTTP: ', error.response?.status)
    return { connected: true, requiresAuth: false, error: 'Error HTTP ' + error.response?.status }
  } catch (error: any) {
    console.error('Error al verificar la conexión con la API: ', error)
    return {
      connected: false,
      requiresAuth: false,
      error: 'Error al verificar la conexión con la API',
    }
  }
}

// Verificar si hay token almacenado
export const checkStoredAuth = (): { hasToken: boolean; hasUser: boolean } => {
  const token = localStorage.getItem('token')
  const userData = localStorage.getItem('user_data')

  console.info('Token en localStorage: ', token ? 'PRESENTE' : 'AUSENTE')
  console.info('User Data en localStorage: ', userData ? 'PRESENTE' : 'AUSENTE')

  return { hasToken: !!token, hasUser: !!userData }
}
