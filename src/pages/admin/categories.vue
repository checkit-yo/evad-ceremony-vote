<script setup lang="ts">
import { adminFetch } from '~/composables/useAdmin'
import type { Category } from '~/types'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Catégories - EVAD Admin', robots: 'noindex, nofollow' })

const categories = ref<Category[]>([])
const isLoading = ref(false)
const errorMsg = ref('')

async function refresh() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    categories.value = await adminFetch<Category[]>('/api/admin/categories')
  } catch (e: any) {
    errorMsg.value = e.data?.statusMessage || e.statusMessage || 'Erreur de chargement'
  } finally {
    isLoading.value = false
  }
}
onMounted(refresh)

const isModalOpen = ref(false)
const editing = ref<Category | null>(null)
const submitting = ref(false)

function openCreate() {
  editing.value = null
  isModalOpen.value = true
}
function openEdit(cat: Category) {
  editing.value = cat
  isModalOpen.value = true
}
function closeModal() {
  isModalOpen.value = false
  editing.value = null
}

async function onSubmit(payload: { name: string, description: string, youtube_url: string, display_order: number }) {
  submitting.value = true
  try {
    if (editing.value) {
      await adminFetch(`/api/admin/categories/${editing.value.id}`, { method: 'PATCH', body: payload })
    } else {
      await adminFetch('/api/admin/categories', { method: 'POST', body: payload })
    }
    closeModal()
    await refresh()
  } catch (e: any) {
    alert(e.data?.statusMessage || e.statusMessage || 'Erreur')
  } finally {
    submitting.value = false
  }
}

async function onDelete(cat: Category) {
  if (!confirm(`Supprimer la catégorie "${cat.name}" ? Tous ses nommés et votes associés seront aussi supprimés.`)) return
  try {
    await adminFetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e.data?.statusMessage || e.statusMessage || 'Erreur')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-white">Catégories</h2>
      <button
        class="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all text-sm"
        @click="openCreate">
        + Ajouter
      </button>
    </div>

    <p v-if="errorMsg" class="text-red-400 text-sm mb-4">{{ errorMsg }}</p>

    <div v-if="isLoading && categories.length === 0" class="text-slate-400 text-sm">Chargement…</div>

    <!-- Desktop: table -->
    <div v-else class="hidden md:block bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
          <tr>
            <th class="text-left px-5 py-3 font-medium">Ordre</th>
            <th class="text-left px-5 py-3 font-medium">Nom</th>
            <th class="text-left px-5 py-3 font-medium">Slug</th>
            <th class="text-left px-5 py-3 font-medium">Description</th>
            <th class="text-right px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id" class="border-t border-slate-700/50 hover:bg-slate-700/20">
            <td class="px-5 py-3 text-slate-400">{{ cat.display_order }}</td>
            <td class="px-5 py-3 text-white font-medium">{{ cat.name }}</td>
            <td class="px-5 py-3 text-slate-400 font-mono text-xs">{{ cat.slug }}</td>
            <td class="px-5 py-3 text-slate-400 max-w-xs truncate">{{ cat.description }}</td>
            <td class="px-5 py-3 text-right whitespace-nowrap">
              <button class="text-amber-400 hover:text-amber-300 text-xs mr-3" @click="openEdit(cat)">Éditer</button>
              <button class="text-red-400 hover:text-red-300 text-xs" @click="onDelete(cat)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="5" class="px-5 py-8 text-center text-slate-500">Aucune catégorie. Cliquez sur "Ajouter".</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: cards -->
    <div v-if="!isLoading || categories.length > 0" class="md:hidden space-y-3">
      <div v-for="cat in categories" :key="cat.id" class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="min-w-0 flex-1">
            <p class="text-white font-medium truncate">{{ cat.name }}</p>
            <p class="text-slate-500 font-mono text-xs mt-0.5 truncate">/{{ cat.slug }}</p>
          </div>
          <span class="text-slate-500 text-xs shrink-0">#{{ cat.display_order }}</span>
        </div>
        <p v-if="cat.description" class="text-slate-400 text-xs line-clamp-2 mb-3">{{ cat.description }}</p>
        <div class="flex items-center gap-2 pt-2 border-t border-slate-700/50">
          <button
            class="flex-1 text-amber-400 hover:text-amber-300 text-xs font-medium py-2 border border-amber-400/30 rounded-lg"
            @click="openEdit(cat)">
            Éditer
          </button>
          <button
            class="flex-1 text-red-400 hover:text-red-300 text-xs font-medium py-2 border border-red-400/30 rounded-lg"
            @click="onDelete(cat)">
            Supprimer
          </button>
        </div>
      </div>
      <p v-if="categories.length === 0" class="text-center py-8 text-slate-500 text-sm">
        Aucune catégorie. Cliquez sur "Ajouter".
      </p>
    </div>

    <AdminModal :is-open="isModalOpen" :title="editing ? 'Éditer la catégorie' : 'Nouvelle catégorie'"
      @close="closeModal">
      <AdminCategoryForm :category="editing" :submitting="submitting" @submit="onSubmit" @cancel="closeModal" />
    </AdminModal>
  </div>
</template>
