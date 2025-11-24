<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuarioStore'

const usersStore = useUsuarioStore()
const router = useRouter()

const currentPage = ref(1)
const perPage = 10

const users = computed(() => usersStore.users)
const pagination = computed(() => usersStore.pagination)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)

onMounted(() => {
  loadUsers()
})

const loadUsers = () => {
  usersStore.fetchUsers(currentPage.value, perPage)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  usersStore.fetchUsers(page, perPage)
}

const goToCreateUser = () => {
  router.push('/usuarios/crear')
}

const goToEditUser = (id: number) => {
  router.push(`/usuarios/editar/${id}`)
}

const deleteUser = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    try {
      await usersStore.deleteUser(id)
      if (users.value.length === 1 && currentPage.value > 1) {
        currentPage.value -= 1
      }
      loadUsers()
    } catch (error) {
      // El error se maneja en el store
    }
  }
}

const clearError = () => {
  usersStore.clearError()
}

const getTipoBadgeClass = (tipo: string) => {
  switch (tipo) {
    case 'estudiante':
      return 'bg-info text-info-content border-info/30'
    case 'docente':
      return 'bg-warning text-warning-content border-warning/30'
    case 'publico':
      return 'bg-secondary text-secondary-content border-secondary/30'
    default:
      return 'bg-neutral text-neutral-content border-neutral/30'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Gestión de Usuarios</h1>
        <p class="text-base-content/80 mt-1">Administra los usuarios del sistema</p>
      </div>
      <button
        @click="goToCreateUser"
        class="bg-primary text-primary-content hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <span>+</span>
        Crear Usuario
      </button>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="bg-error text-error-content p-4 rounded-lg shadow-lg flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ error }}</span>
      </div>
      <button @click="clearError" class="hover:bg-error/20 p-1 rounded">×</button>
    </div>

    <!-- Tarjeta de contenido -->
    <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 overflow-hidden">
      <!-- Loading state -->
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-base-content/70">Cargando usuarios...</p>
      </div>

      <!-- Tabla de usuarios -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-base-200 border-b border-base-300">
              <th class="text-left py-4 px-6 font-semibold text-base-content">
                ID
              </th>
              <th class="text-left py-4 px-6 font-semibold text-base-content">
                Nombre
              </th>
              <th class="text-left py-4 px-6 font-semibold text-base-content">
                Apellido
              </th>
              <th class="text-left py-4 px-6 font-semibold text-base-content">
                Email
              </th>
              <th class="text-left py-4 px-6 font-semibold text-base-content">
                Tipo
              </th>
              <th class="text-center py-4 px-6 font-semibold text-base-content">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center py-12 text-base-content/70">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-4xl opacity-50 mb-3">👥</span>
                  <p class="text-lg font-medium mb-2">No hay usuarios registrados</p>
                  <p class="text-base-content/60 mb-4">Comienza agregando el primer usuario al sistema</p>
                  <button
                    @click="goToCreateUser"
                    class="bg-primary text-primary-content hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Crear primer usuario
                  </button>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(user, index) in users"
              :key="user.id"
              :class="[
                'border-b border-base-300 transition-colors hover:bg-base-200/50',
                index % 2 === 0 ? 'bg-base-100' : 'bg-base-100/50'
              ]"
            >
              <td class="py-4 px-6">
                <span class="font-mono text-sm text-base-content bg-base-300 px-2 py-1 rounded">
                  {{ user.id }}
                </span>
              </td>
              <td class="py-4 px-6 text-base-content font-medium">
                {{ user.nombre }}
              </td>
              <td class="py-4 px-6 text-base-content font-medium">
                {{ user.apellido }}
              </td>
              <td class="py-4 px-6 text-base-content">
                {{ user.email }}
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                    getTipoBadgeClass(user.tipo)
                  ]"
                >
                  {{ user.tipo }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex justify-center gap-2">
                  <button
                    @click="goToEditUser(user.id)"
                    class="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
                    title="Editar usuario"
                  >
                    <span>✏️</span>
                    <span class="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="bg-error/20 text-error hover:bg-error/30 border border-error/30 px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
                    title="Eliminar usuario"
                  >
                    <span>🗑️</span>
                    <span class="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="pagination && pagination.lastPage > 1" class="bg-base-200 px-6 py-4 border-t border-base-300">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-sm text-base-content/70">
            Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} resultados
          </div>
          <div class="flex gap-1">
            <button
              v-for="page in pagination.lastPage"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'min-w-10 h-10 px-3 rounded-lg font-medium transition-colors border',
                page === currentPage
                  ? 'bg-primary text-primary-content border-primary'
                  : 'bg-base-100 text-base-content border-base-300 hover:bg-base-300'
              ]"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

th:first-child {
  border-top-left-radius: var(--radius-box);
}

th:last-child {
  border-top-right-radius: var(--radius-box);
}

tr:last-child td:first-child {
  border-bottom-left-radius: var(--radius-box);
}

tr:last-child td:last-child {
  border-bottom-right-radius: var(--radius-box);
}
</style>
