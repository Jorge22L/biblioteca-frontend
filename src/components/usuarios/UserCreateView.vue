<script setup lang="ts">
import type { CreatedUserData } from '@/services/usuariosService'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const usersStore = useUsuarioStore()
const router = useRouter()

const form = reactive<CreatedUserData>({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  tipo: '',
})

const loading = ref(false)
const error = ref('')
const successMsg = ref('')

// Validación
const validateForm = (): boolean => {
  if (!form.nombre.trim()) {
    error.value = 'El nombre es requerido'
    return false
  }

  if (!form.apellido.trim()) {
    error.value = 'El apellido es requerido'
    return false
  }

  if (!form.email.trim()) {
    error.value = 'El email es requerido'
    return false
  }

  if (!form.password.trim()) {
    error.value = 'La contraseña es requerida'
    return false
  }

  if (!form.tipo) {
    error.value = 'El tipo de usuario es requerido'
    return false
  }

  // Validación de email básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    error.value = 'El formato de email no es valido'
    return false
  }

  return true
}

const submit = async () => {
  // Limpiar mensajes
  error.value = ''
  successMsg.value = ''

  // Validar formulario
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const nuevoUsuario = await usersStore.createUser({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      password: form.password,
      tipo: form.tipo,
    })

    successMsg.value = `Usuario ${nuevoUsuario.nombre} ${nuevoUsuario.apellido} creado exitosamente`

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      router.push('/usuarios')
    }, 1500)
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Error al crear el usuario'

    // Manejo de errores específicos
    if (e.response?.data?.errors) {
      const errors = e.response.data.errors
      if (errors.email) {
        error.value = `Email: ${errors.email[0]}`
      } else if (errors.password) {
        error.value = `Contraseña: ${errors.password[0]}`
      }
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/usuarios')
}

const clearError = () => {
  error.value = ''
}

const clearSuccess = () => {
  successMsg.value = ''
}
</script>
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Crear Usuario</h1>
        <p class="text-base-content/80 mt-1">Agregar nuevo usuario al sistema</p>
      </div>
      <button
        @click="goBack"
        class="bg-base-300 text-base-content hover:bg-base-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <span>←</span>
        Volver a Usuarios
      </button>
    </div>

    <!-- Mensaje de éxito -->
    <div
      v-if="successMsg"
      class="bg-success text-success-content p-4 rounded-lg shadow-lg flex justify-between items-center"
    >
      <div class="flex items-center gap-2">
        <span>✅</span>
        <span>{{ successMsg }}</span>
      </div>
      <button @click="clearSuccess" class="hover:bg-success/20 p-1 rounded">×</button>
    </div>

    <!-- Mensaje de error -->
    <div
      v-if="error"
      class="bg-error text-error-content p-4 rounded-lg shadow-lg flex justify-between items-center"
    >
      <div class="flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ error }}</span>
      </div>
      <button @click="clearError" class="hover:bg-error/20 p-1 rounded">×</button>
    </div>

    <!-- Formulario -->
    <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
      <form @submit.prevent="submit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre -->
          <div class="space-y-2">
            <label for="nombre" class="block text-base-content font-semibold">
              Nombre <span class="text-error">*</span>
            </label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              class="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
              placeholder="Ingresa el nombre"
              :disabled="loading"
            />
            <p class="text-sm text-base-content/60">Ej: Juan</p>
          </div>

          <!-- Apellido -->
          <div class="space-y-2">
            <label for="apellido" class="block text-base-content font-semibold">
              Apellido <span class="text-error">*</span>
            </label>
            <input
              id="apellido"
              v-model="form.apellido"
              type="text"
              class="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
              placeholder="Ingresa el apellido"
              :disabled="loading"
            />
            <p class="text-sm text-base-content/60">Ej: Pérez</p>
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label for="email" class="block text-base-content font-semibold">
            Email <span class="text-error">*</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
            placeholder="usuario@ejemplo.com"
            :disabled="loading"
          />
          <p class="text-sm text-base-content/60">El email debe ser único en el sistema</p>
        </div>

        <!-- Contraseña -->
        <div class="space-y-2">
          <label for="password" class="block text-base-content font-semibold">
            Contraseña <span class="text-error">*</span>
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
            placeholder="Mínimo 6 caracteres"
            minlength="6"
            :disabled="loading"
          />
          <p class="text-sm text-base-content/60">La contraseña debe tener al menos 6 caracteres</p>
        </div>

        <!-- Tipo de Usuario -->
        <div class="space-y-2">
          <label for="tipo" class="block text-base-content font-semibold">
            Tipo de Usuario <span class="text-error">*</span>
          </label>
          <select
            id="tipo"
            v-model="form.tipo"
            class="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
            :disabled="loading"
          >
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="publico">Público</option>
          </select>
          <p class="text-sm text-base-content/60">Selecciona el tipo de usuario</p>
        </div>

        <!-- Información del formulario -->
        <div class="bg-base-200 rounded-lg p-4 border border-base-300">
          <h3 class="font-semibold text-base-content mb-2">Información importante:</h3>
          <ul class="text-sm text-base-content/80 space-y-1">
            <li>
              • Todos los campos marcados con <span class="text-error">*</span> son obligatorios
            </li>
            <li>• El email debe ser único y válido</li>
            <li>• La contraseña se almacenará de forma segura</li>
            <li>• El tipo de usuario determina los permisos en el sistema</li>
          </ul>
        </div>

        <!-- Acciones -->
        <div class="flex justify-end gap-3 pt-6 border-t border-base-300">
          <button
            type="button"
            @click="goBack"
            class="bg-base-300 text-base-content hover:bg-base-400 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-primary text-primary-content hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"
            ></span>
            <span>{{ loading ? 'Creando...' : 'Crear Usuario' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
