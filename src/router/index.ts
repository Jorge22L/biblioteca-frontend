import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStores";
import AppLayout from "@/components/layout/AppLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/auth/LoginView.vue'),
      meta: {
        title: 'Iniciar Sesión',
        requiresGuest: true,
        layout: 'empty' // Sin layout para login
      }
    },
    {
      path: '/',
      component: AppLayout, // ✅ LAYOUT COMO COMPONENTE PADRE
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/components/dashboard/DashboardView.vue'),
          meta: { title: 'Dashboard' }
        },

      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.title) {
    document.title = `${to.meta.title} - Biblioteca Digital`;
  }

  // Ruta que requiere autenticación
  if (to.meta.requiresAuth && !authStore.estaAutenticado) {
    console.log('🛡️ Ruta protegida, guardando redirección:', to.path);
    authStore.establecerRutaRedireccion(to.path);
    next('/login');
    return;
  }

  // Ruta para invitados (cuando ya está autenticado)
  if (to.meta.requiresGuest && authStore.estaAutenticado) {
    console.log('🛡️ Ya autenticado, redirigiendo al dashboard');
    next('/');
    return;
  }

  next();
});

export default router;
