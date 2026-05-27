<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Administration - Evad Ceremony',
  robots: 'noindex, nofollow',
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

interface AdminData {
  success: boolean
  stats: {
    totalVotes: number
    uniqueVoters: number
    categoriesCount: number
    lastVoteAt: string | null
  }
  results: CategoryResult[]
}

const password = ref('')
const isAuthenticated = ref(false)
const isLoading = ref(false)
const error = ref('')
const data = ref<AdminData | null>(null)
const selectedCategory = ref<string | null>(null)

async function login() {
  if (!password.value) {
    error.value = 'Veuillez entrer le mot de passe.'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch<AdminData>('/api/admin/results', {
      query: { password: password.value },
    })

    if (response.success) {
      isAuthenticated.value = true
      data.value = response
      // Select first category by default
      if (response.results.length > 0) {
        selectedCategory.value = response.results[0].id
      }
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Erreur d\'authentification.'
  } finally {
    isLoading.value = false
  }
}

async function refresh() {
  if (!password.value) return
  
  isLoading.value = true
  try {
    const response = await $fetch<AdminData>('/api/admin/results', {
      query: { password: password.value },
    })
    if (response.success) {
      data.value = response
    }
  } catch (err) {
    console.error('Failed to refresh data')
  } finally {
    isLoading.value = false
  }
}

const selectedCategoryData = computed(() => {
  if (!data.value || !selectedCategory.value) return null
  return data.value.results.find(r => r.id === selectedCategory.value)
})

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Aucun vote'
  return new Date(dateString).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function logout() {
  isAuthenticated.value = false
  password.value = ''
  data.value = null
  selectedCategory.value = null
}
</script>

<template>
  <div class="min-h-screen bg-cream-50">
    <!-- Header -->
    <header class="bg-burgundy text-white">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <span class="text-burgundy font-title font-bold">E</span>
              </div>
              <span class="font-title font-bold text-lg hidden sm:block">Evad Ceremony</span>
            </NuxtLink>
            <span class="text-white/50">|</span>
            <span class="font-title text-sm text-gold">Administration</span>
          </div>
          <button
            v-if="isAuthenticated"
            class="text-white/70 hover:text-white text-sm font-body flex items-center gap-2 transition-colors"
            @click="logout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-[calc(100vh-72px)] p-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-burgundy rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 class="font-title font-bold text-2xl text-burgundy">
              Accès Administrateur
            </h1>
            <p class="font-body text-burgundy-600/70 mt-2">
              Entrez le mot de passe pour accéder aux résultats
            </p>
          </div>

          <form @submit.prevent="login">
            <label class="block mb-2 font-title text-sm font-semibold text-burgundy">
              Mot de passe
            </label>
            <input
              v-model="password"
              type="password"
              class="input mb-4"
              placeholder="••••••••"
              :disabled="isLoading"
            >
            <p v-if="error" class="text-red-600 text-sm mb-4 font-body">
              {{ error }}
            </p>
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Connexion...
              </span>
              <span v-else>Accéder aux résultats</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p class="text-burgundy-600/70 text-sm font-body">Total des votes</p>
              <p class="text-2xl font-title font-bold text-burgundy">{{ data?.stats.totalVotes || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-burgundy-600/70 text-sm font-body">Votants uniques</p>
              <p class="text-2xl font-title font-bold text-burgundy">{{ data?.stats.uniqueVoters || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-cream-300/50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-burgundy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p class="text-burgundy-600/70 text-sm font-body">Catégories</p>
              <p class="text-2xl font-title font-bold text-burgundy">{{ data?.stats.categoriesCount || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-burgundy-600/70 text-sm font-body">Dernier vote</p>
              <p class="text-sm font-title font-semibold text-burgundy">{{ formatDate(data?.stats.lastVoteAt || null) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Selector & Results -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <!-- Category tabs -->
        <div class="border-b border-cream-200 overflow-x-auto">
          <div class="flex">
            <button
              v-for="category in data?.results"
              :key="category.id"
              class="px-6 py-4 font-title text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px"
              :class="[
                selectedCategory === category.id
                  ? 'border-burgundy text-burgundy bg-burgundy/5'
                  : 'border-transparent text-burgundy-600/70 hover:text-burgundy hover:bg-cream-50'
              ]"
              @click="selectedCategory = category.id"
            >
              {{ category.name }}
              <span class="ml-2 text-xs bg-cream-200 px-2 py-0.5 rounded-full">
                {{ category.totalVotes }}
              </span>
            </button>
          </div>
        </div>

        <!-- Results -->
        <div v-if="selectedCategoryData" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="font-title font-bold text-xl text-burgundy">
                {{ selectedCategoryData.name }}
              </h2>
              <p class="font-body text-burgundy-600/70 text-sm">
                {{ selectedCategoryData.totalVotes }} vote{{ selectedCategoryData.totalVotes > 1 ? 's' : '' }} au total
              </p>
            </div>
            <button
              class="btn btn-outline text-sm"
              :disabled="isLoading"
              @click="refresh"
            >
              <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>

          <!-- Nominees ranking -->
          <div class="space-y-3">
            <div
              v-for="(nominee, index) in selectedCategoryData.nominees"
              :key="nominee.id"
              class="flex items-center gap-4 p-4 rounded-xl transition-colors"
              :class="[
                index === 0 && nominee.votes > 0 ? 'bg-gold/10 border border-gold/30' : 'bg-cream-50'
              ]"
            >
              <!-- Rank -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-title font-bold flex-shrink-0"
                :class="[
                  index === 0 && nominee.votes > 0 ? 'bg-gold text-burgundy' : 'bg-cream-200 text-burgundy-600'
                ]"
              >
                {{ index + 1 }}
              </div>

              <!-- Avatar -->
              <img
                :src="nominee.imageUrl"
                :alt="nominee.name"
                class="w-12 h-12 rounded-xl object-cover flex-shrink-0"
              >

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-title font-semibold text-burgundy truncate">
                  {{ nominee.name }}
                </h4>
                <div class="flex items-center gap-2 mt-1">
                  <!-- Progress bar -->
                  <div class="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="[
                        index === 0 && nominee.votes > 0 ? 'bg-gold' : 'bg-burgundy'
                      ]"
                      :style="{ width: `${nominee.percentage}%` }"
                    />
                  </div>
                  <span class="text-xs font-body text-burgundy-600/70 flex-shrink-0">
                    {{ nominee.percentage }}%
                  </span>
                </div>
              </div>

              <!-- Votes count -->
              <div class="text-right flex-shrink-0">
                <span class="font-title font-bold text-lg text-burgundy">{{ nominee.votes }}</span>
                <span class="text-burgundy-600/70 font-body text-sm block">vote{{ nominee.votes > 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer credit -->
    <footer class="py-6 text-center">
      <p class="font-body text-burgundy-600/50 text-sm">
        Développé avec ❤️ par
        <a href="https://checkit.dance" target="_blank" rel="noopener noreferrer" class="text-burgundy hover:underline font-title font-semibold">
          Checkit
        </a>
      </p>
    </footer>
  </div>
</template>
