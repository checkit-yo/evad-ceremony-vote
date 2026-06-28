<script setup lang="ts">
import { adminFetch } from '~/composables/useAdmin'
import type { Category, Nominee } from '~/types'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Nommés - EVAD Admin', robots: 'noindex, nofollow' })

const categories = ref<Category[]>([])
const nominees = ref<Nominee[]>([])
const isLoading = ref(false)
const errorMsg = ref('')
const filterCategoryId = ref<string>('')

async function refresh() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    if (categories.value.length === 0) {
      categories.value = await adminFetch<Category[]>('/api/admin/categories')
    }
    const params = filterCategoryId.value ? `?category_id=${filterCategoryId.value}` : ''
    nominees.value = await adminFetch<Nominee[]>(`/api/admin/nominees${params}`)
  } catch (e: any) {
    errorMsg.value = e.data?.statusMessage || e.statusMessage || 'Erreur de chargement'
  } finally {
    isLoading.value = false
  }
}
onMounted(refresh)
watch(filterCategoryId, refresh)

const categoryNameById = computed(() => {
  const m = new Map<string, string>()
  for (const c of categories.value) m.set(c.id, c.name)
  return m
})

const isModalOpen = ref(false)
const editing = ref<Nominee | null>(null)
const submitting = ref(false)

function openCreate() {
  editing.value = null
  isModalOpen.value = true
}
function openEdit(n: Nominee) {
  editing.value = n
  isModalOpen.value = true
}
function closeModal() {
  isModalOpen.value = false
  editing.value = null
}

async function onSubmit(payload: { category_id: string, name: string, description: string, display_order: number, image?: File | null }) {
  submitting.value = true
  try {
    const { image, ...rest } = payload
    let saved: Nominee
    if (editing.value) {
      saved = await adminFetch<Nominee>(`/api/admin/nominees/${editing.value.id}`, {
        method: 'PATCH',
        body: rest,
      })
    } else {
      saved = await adminFetch<Nominee>('/api/admin/nominees', { method: 'POST', body: rest })
    }
    if (image) {
      const formData = new FormData()
      formData.append('image', image)
      await adminFetch(`/api/admin/nominees/${saved.id}/image`, { method: 'POST', body: formData })
    }
    closeModal()
    await refresh()
  } catch (e: any) {
    alert(e.data?.statusMessage || e.statusMessage || 'Erreur')
  } finally {
    submitting.value = false
  }
}

async function onDelete(n: Nominee) {
  if (!confirm(`Supprimer "${n.name}" ? Les votes associés seront aussi supprimés.`)) return
  try {
    await adminFetch(`/api/admin/nominees/${n.id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e.data?.statusMessage || e.statusMessage || 'Erreur')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-semibold text-white">Nommés</h2>
        <select
          v-model="filterCategoryId"
          class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
      <button
        class="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all text-sm"
        :disabled="categories.length === 0"
        @click="openCreate"
      >
        + Ajouter
      </button>
    </div>

    <p v-if="errorMsg" class="text-red-400 text-sm mb-4">{{ errorMsg }}</p>

    <div v-if="isLoading && nominees.length === 0" class="text-slate-400 text-sm">Chargement…</div>

    <!-- Desktop: table -->
    <div v-else class="hidden md:block bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
          <tr>
            <th class="text-left px-5 py-3 font-medium">Photo</th>
            <th class="text-left px-5 py-3 font-medium">Nom</th>
            <th class="text-left px-5 py-3 font-medium">Catégorie</th>
            <th class="text-left px-5 py-3 font-medium">Ordre</th>
            <th class="text-right px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="n in nominees"
            :key="n.id"
            class="border-t border-slate-700/50 hover:bg-slate-700/20"
          >
            <td class="px-5 py-3">
              <img
                v-if="n.image_url"
                :src="n.image_url"
                :alt="n.name"
                class="w-10 h-10 rounded-lg object-cover"
              >
              <div v-else class="w-10 h-10 bg-slate-700 rounded-lg" />
            </td>
            <td class="px-5 py-3 text-white font-medium">{{ n.name }}</td>
            <td class="px-5 py-3 text-slate-400">{{ categoryNameById.get(n.category_id) || '—' }}</td>
            <td class="px-5 py-3 text-slate-400">{{ n.display_order }}</td>
            <td class="px-5 py-3 text-right whitespace-nowrap">
              <button class="text-amber-400 hover:text-amber-300 text-xs mr-3" @click="openEdit(n)">Éditer</button>
              <button class="text-red-400 hover:text-red-300 text-xs" @click="onDelete(n)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="nominees.length === 0">
            <td colspan="5" class="px-5 py-8 text-center text-slate-500">Aucun nommé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: cards -->
    <div v-if="!isLoading || nominees.length > 0" class="md:hidden space-y-3">
      <div
        v-for="n in nominees"
        :key="n.id"
        class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
      >
        <div class="flex items-start gap-3 mb-3">
          <img
            v-if="n.image_url"
            :src="n.image_url"
            :alt="n.name"
            class="w-14 h-14 rounded-lg object-cover shrink-0"
          >
          <div v-else class="w-14 h-14 bg-slate-700 rounded-lg shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-white font-medium truncate">{{ n.name }}</p>
            <p class="text-slate-500 text-xs mt-0.5 truncate">{{ categoryNameById.get(n.category_id) || '—' }}</p>
            <p class="text-slate-600 text-xs mt-1">Ordre : #{{ n.display_order }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-2 border-t border-slate-700/50">
          <button
            class="flex-1 text-amber-400 hover:text-amber-300 text-xs font-medium py-2 border border-amber-400/30 rounded-lg"
            @click="openEdit(n)"
          >
            Éditer
          </button>
          <button
            class="flex-1 text-red-400 hover:text-red-300 text-xs font-medium py-2 border border-red-400/30 rounded-lg"
            @click="onDelete(n)"
          >
            Supprimer
          </button>
        </div>
      </div>
      <p v-if="nominees.length === 0" class="text-center py-8 text-slate-500 text-sm">
        Aucun nommé.
      </p>
    </div>

    <AdminModal
      :is-open="isModalOpen"
      :title="editing ? 'Éditer le nommé' : 'Nouveau nommé'"
      @close="closeModal"
    >
      <AdminNomineeForm
        :nominee="editing"
        :categories="categories"
        :default-category-id="filterCategoryId"
        :submitting="submitting"
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </AdminModal>
  </div>
</template>
