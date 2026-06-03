<script setup lang="ts">
import { adminFetch } from '~/composables/useAdmin'
import type { VoteResultsPayload } from '~/types'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Résultats - EVAD Admin', robots: 'noindex, nofollow' })

const data = ref<VoteResultsPayload | null>(null)
const isLoading = ref(false)
const errorMsg = ref('')

async function refresh() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    data.value = await adminFetch<VoteResultsPayload>('/api/admin/results')
  } catch (e: any) {
    errorMsg.value = e.data?.statusMessage || e.statusMessage || 'Erreur de chargement'
  } finally {
    isLoading.value = false
  }
}

onMounted(refresh)

function getBarWidth(percentage: number | string) {
  const pct = typeof percentage === 'number' ? percentage : parseFloat(percentage)
  return `${Math.max(pct, 2)}%`
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-white">Résultats des votes</h2>
      <button
        class="text-sm text-slate-400 hover:text-amber-400 transition-colors"
        :disabled="isLoading"
        @click="refresh"
      >
        {{ isLoading ? 'Rafraîchissement…' : '↻ Rafraîchir' }}
      </button>
    </div>

    <p v-if="errorMsg" class="text-red-400 text-sm mb-4">{{ errorMsg }}</p>

    <div v-if="data" class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-slate-400 text-sm font-medium">Total Votes</span>
          <div class="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-4xl font-bold text-white">{{ data.stats.totalVotes }}</p>
      </div>
      <div class="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-slate-400 text-sm font-medium">Votants Uniques</span>
          <div class="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <p class="text-4xl font-bold text-white">{{ data.stats.uniqueVoters }}</p>
      </div>
    </div>

    <div v-if="data" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        v-for="category in data.results"
        :key="category.id"
        class="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
      >
        <div class="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 class="font-semibold text-white">{{ category.name }}</h3>
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
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <span v-if="index === 0 && nominee.votes > 0" class="text-base">🥇</span>
              <span v-else-if="index === 1 && nominee.votes > 0" class="text-base">🥈</span>
              <span v-else-if="index === 2 && nominee.votes > 0" class="text-base">🥉</span>
              <span v-else class="text-slate-500 text-xs font-medium">{{ index + 1 }}</span>
            </div>

            <img
              v-if="nominee.imageUrl"
              :src="nominee.imageUrl"
              :alt="nominee.name"
              class="w-9 h-9 object-cover rounded-lg shrink-0"
            >
            <div v-else class="w-9 h-9 bg-slate-700 rounded-lg shrink-0" />

            <div class="flex-1 min-w-0">
              <p class="text-white text-sm truncate mb-1">{{ nominee.name }}</p>
              <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                  :style="{ width: getBarWidth(nominee.percentage) }"
                />
              </div>
            </div>

            <div class="text-right shrink-0 pl-2">
              <p class="font-semibold text-white text-sm">{{ nominee.votes }}</p>
              <p class="text-slate-500 text-xs">{{ nominee.percentage }}%</p>
            </div>
          </div>

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
                  <img
                    v-if="nominee.imageUrl"
                    :src="nominee.imageUrl"
                    :alt="nominee.name"
                    class="w-7 h-7 object-cover rounded-lg shrink-0"
                  >
                  <div v-else class="w-7 h-7 bg-slate-700 rounded-lg shrink-0" />
                  <p class="flex-1 text-slate-400 text-sm truncate">{{ nominee.name }}</p>
                  <span class="text-slate-500 text-xs">{{ nominee.votes }}</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
