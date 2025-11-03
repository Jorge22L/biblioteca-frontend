export interface LoginCredentials {
  email: string
  password: string
}

export interface Usuario {
  usuario_id: number
  nombre: string
  apellido: string
  email: string
  tipo: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface ApiError {
  errors?: Record<string, string[]>
  message: string
}
