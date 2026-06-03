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

async function onSubmit(payload: { name: string, description: string, display_order: number }) {
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
  if (!confirm(`Supprimer la catégorie "${cat.name}" ? Tous ses nominés et votes associés seront aussi supprimés.`)) return
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
        @click="openCreate"
      >
        + Ajouter
      </button>
    </div>

    <p v-if="errorMsg" class="text-red-400 text-sm mb-4">{{ errorMsg }}</p>

    <div v-if="isLoading && categories.length === 0" class="text-slate-400 text-sm">Chargement…</div>

    <div v-else class="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
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
          <tr
            v-for="cat in categories"
            :key="cat.id"
            class="border-t border-slate-700/50 hover:bg-slate-700/20"
          >
            <td class="px-5 py-3 text-slate-400">{{ cat.display_order }}</td>
            <td class="px-5 py-3 text-white font-medium">{{ cat.name }}</td>
            <td class="px-5 py-3 text-slate-400 font-mono text-xs">{{ cat.slug }}</td>
            <td class="px-5 py-3 text-slate-400 max-w-xs truncate">{{ cat.description }}</td>
            <td class="px-5 py-3 text-right">
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

    <AdminModal
      :is-open="isModalOpen"
      :title="editing ? 'Éditer la catégorie' : 'Nouvelle catégorie'"
      @close="closeModal"
    >
      <AdminCategoryForm
        :category="editing"
        :submitting="submitting"
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </AdminModal>
  </div>
</template>
