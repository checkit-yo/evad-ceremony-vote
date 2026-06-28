<script setup lang="ts">
import { adminFetch, setAdminPassword, useAdminPassword } from '~/composables/useAdmin'

const password = useAdminPassword()
const isAuthenticated = ref(false)
const isVerifying = ref(false)
const loginInput = ref('')
const loginError = ref('')

// Vérifie le password au montage (s'il est déjà en sessionStorage) en pingant une route admin
onMounted(async () => {
  if (!password.value) return
  isVerifying.value = true
  try {
    await adminFetch('/api/admin/categories')
    isAuthenticated.value = true
  } catch {
    setAdminPassword('')
  } finally {
    isVerifying.value = false
  }
})

async function login() {
  if (!loginInput.value) {
    loginError.value = 'Veuillez entrer le mot de passe'
    return
  }
  isVerifying.value = true
  loginError.value = ''
  setAdminPassword(loginInput.value)
  try {
    await adminFetch('/api/admin/categories')
    isAuthenticated.value = true
  } catch (e: any) {
    setAdminPassword('')
    loginError.value = e.data?.statusMessage || e.statusMessage || 'Mot de passe incorrect'
  } finally {
    isVerifying.value = false
  }
}

function logout() {
  setAdminPassword('')
  isAuthenticated.value = false
  loginInput.value = ''
}

const route = useRoute()
const tabs = [
  { name: 'Résultats', to: '/admin' },
  { name: 'Catégories', to: '/admin/categories' },
  { name: 'Nommés', to: '/admin/nominees' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-10">
          <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span class="text-slate-900 font-bold text-lg">E</span>
          </div>
          <h1 class="text-2xl font-semibold text-white mb-1">EVAD Admin</h1>
          <p class="text-slate-400 text-sm">Tableau de bord</p>
        </div>

        <form
          class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6"
          @submit.prevent="login"
        >
          <label class="block mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Mot de passe
          </label>
          <input
            v-model="loginInput"
            type="password"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all mb-4"
            placeholder="••••••••"
            :disabled="isVerifying"
          >
          <p v-if="loginError" class="text-red-400 text-sm mb-4">{{ loginError }}</p>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold py-3 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            :disabled="isVerifying"
          >
            {{ isVerifying ? 'Connexion…' : 'Accéder' }}
          </button>
        </form>

        <p class="text-center mt-8">
          <NuxtLink to="/" class="text-slate-500 hover:text-amber-400 text-sm transition-colors">
            ← Retour au site
          </NuxtLink>
        </p>
      </div>
    </div>

    <!-- Dashboard wrapper -->
    <div v-else class="min-h-screen">
      <header class="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span class="text-slate-900 font-bold text-sm">E</span>
            </div>
            <h1 class="font-semibold text-white">EVAD Admin</h1>
          </div>
          <button
            class="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
            @click="logout"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
        <nav class="max-w-7xl mx-auto px-6">
          <ul class="flex gap-1">
            <li v-for="tab in tabs" :key="tab.to">
              <NuxtLink
                :to="tab.to"
                class="inline-block px-4 py-3 text-sm font-medium transition-colors border-b-2"
                :class="route.path === tab.to ? 'text-amber-400 border-amber-400' : 'text-slate-400 border-transparent hover:text-white'"
              >
                {{ tab.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </header>

      <main class="max-w-7xl mx-auto px-6 py-8">
        <slot />
      </main>
    </div>
  </div>
</template>
