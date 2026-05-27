<script setup lang="ts">
definePageMeta({
  layout: false,
})

interface NomineeResult {
  id: string
  name: string
  imageUrl: string
  votes: number
  percentage: string
}

interface CategoryResult {
  id: string
  name: string
  totalVotes: number
  nominees: NomineeResult[]
}

interface Stats {
  totalVotes: number
  uniqueVoters: number
  categoriesCount: number
  lastVoteAt: string | null
}

interface ResultsData {
  success: boolean
  stats: Stats
  results: CategoryResult[]
}

const password = ref('')
const isAuthenticated = ref(false)
const isLoading = ref(false)
const error = ref('')
const data = ref<ResultsData | null>(null)

async function login() {
  if (!password.value) {
    error.value = 'Veuillez entrer le mot de passe'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch<ResultsData>('/api/admin/results', {
      query: { password: password.value },
    })

    if (response.success) {
      isAuthenticated.value = true
      data.value = response
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Mot de passe incorrect'
  } finally {
    isLoading.value = false
  }
}

function logout() {
  isAuthenticated.value = false
  password.value = ''
  data.value = null
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Aucun vote'
  return new Date(dateString).toLocaleString('fr-FR')
}

function getBarWidth(percentage: string) {
  return `${Math.max(parseFloat(percentage), 2)}%`
}
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
          <p class="text-slate-400 text-sm">Tableau de bord des résultats</p>
        </div>

        <form @submit.prevent="login" class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <label class="block mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Mot de passe
          </label>
          <input
            v-model="password"
            type="password"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all mb-4"
            placeholder="••••••••"
            :disabled="isLoading"
          >
          <p v-if="error" class="text-red-400 text-sm mb-4">{{ error }}</p>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold py-3 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Connexion...' : 'Accéder' }}
          </button>
        </form>

        <p class="text-center mt-8">
          <NuxtLink to="/" class="text-slate-500 hover:text-amber-400 text-sm transition-colors">
            ← Retour au site
          </NuxtLink>
        </p>
      </div>
    </div>

    <!-- Dashboard -->
    <div v-else class="min-h-screen">
      <!-- Header -->
      <header class="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span class="text-slate-900 font-bold text-sm">E</span>
            </div>
            <div>
              <h1 class="font-semibold text-white">EVAD Admin</h1>
              <p class="text-xs text-slate-400">Résultats des votes</p>
            </div>
          </div>
          <button
            @click="logout"
            class="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-slate-400 text-sm font-medium">Total Votes</span>
              <div class="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p class="text-4xl font-bold text-white">{{ data?.stats.totalVotes || 0 }}</p>
          </div>
          <div class="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-slate-400 text-sm font-medium">Votants Uniques</span>
              <div class="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p class="text-4xl font-bold text-white">{{ data?.stats.uniqueVoters || 0 }}</p>
          </div>
        </div>

        <!-- Categories Results -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="category in data?.results"
            :key="category.id"
            class="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
          >
            <div class="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h2 class="font-semibold text-white">{{ category.name }}</h2>
              <span class="text-xs font-medium text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                {{ category.totalVotes }} votes
              </span>
            </div>

            <div class="p-4 space-y-1">
              <div
                v-for="(nominee, index) in category.nominees.slice(0, 5)"
                :key="nominee.id"
                class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/30 transition-colors"
              >
                <!-- Rank -->
                <div class="w-6 h-6 flex items-center justify-center shrink-0">
                  <span v-if="index === 0 && nominee.votes > 0" class="text-base">🥇</span>
                  <span v-else-if="index === 1 && nominee.votes > 0" class="text-base">🥈</span>
                  <span v-else-if="index === 2 && nominee.votes > 0" class="text-base">🥉</span>
                  <span v-else class="text-slate-500 text-xs font-medium">{{ index + 1 }}</span>
                </div>

                <!-- Image -->
                <img
                  :src="nominee.imageUrl"
                  :alt="nominee.name"
                  class="w-9 h-9 object-cover rounded-lg shrink-0"
                >

                <!-- Name & Bar -->
                <div class="flex-1 min-w-0">
                  <p class="text-white text-sm truncate mb-1">{{ nominee.name }}</p>
                  <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                      :style="{ width: getBarWidth(nominee.percentage) }"
                    />
                  </div>
                </div>

                <!-- Stats -->
                <div class="text-right shrink-0 pl-2">
                  <p class="font-semibold text-white text-sm">{{ nominee.votes }}</p>
                  <p class="text-slate-500 text-xs">{{ nominee.percentage }}%</p>
                </div>
              </div>

              <!-- Show more -->
              <div v-if="category.nominees.length > 5" class="pt-2">
                <details class="group">
                  <summary class="text-slate-500 text-xs cursor-pointer hover:text-amber-400 transition-colors px-2">
                    + {{ category.nominees.length - 5 }} autres
                  </summary>
                  <div class="mt-1 space-y-1">
                    <div
                      v-for="(nominee, index) in category.nominees.slice(5)"
                      :key="nominee.id"
                      class="flex items-center gap-3 p-2 rounded-xl"
                    >
                      <div class="w-6 text-center">
                        <span class="text-slate-500 text-xs">{{ index + 6 }}</span>
                      </div>
                      <img :src="nominee.imageUrl" :alt="nominee.name" class="w-7 h-7 object-cover rounded-lg shrink-0">
                      <p class="flex-1 text-slate-400 text-sm truncate">{{ nominee.name }}</p>
                      <span class="text-slate-500 text-xs">{{ nominee.votes }}</span>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
