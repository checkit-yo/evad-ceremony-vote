<script setup lang="ts">
import type { Category } from '~/types'

const props = defineProps<{
  category?: Category | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { slug: string, name: string, description: string, display_order: number }]
  cancel: []
}>()

const form = reactive({
  slug: '',
  name: '',
  description: '',
  display_order: 0,
})

watchEffect(() => {
  if (props.category) {
    form.slug = props.category.slug
    form.name = props.category.name
    form.description = props.category.description
    form.display_order = props.category.display_order
  }
})

const slugError = ref('')

function onSubmit() {
  slugError.value = ''
  if (!/^[a-z0-9-]+$/.test(form.slug)) {
    slugError.value = 'Lettres minuscules, chiffres et tirets uniquement.'
    return
  }
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Nom</label>
      <input
        v-model="form.name"
        type="text"
        required
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
      >
    </div>

    <div>
      <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Slug (URL)</label>
      <input
        v-model="form.slug"
        type="text"
        required
        placeholder="best-dancer"
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono text-sm"
      >
      <p v-if="slugError" class="text-red-400 text-xs mt-1">{{ slugError }}</p>
    </div>

    <div>
      <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Description</label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
      />
    </div>

    <div>
      <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Ordre d'affichage</label>
      <input
        v-model.number="form.display_order"
        type="number"
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
      >
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        class="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold py-2.5 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
        :disabled="submitting"
      >
        {{ submitting ? 'Enregistrement…' : (category ? 'Enregistrer' : 'Créer') }}
      </button>
      <button
        type="button"
        class="px-4 py-2.5 text-slate-400 hover:text-white transition-colors"
        @click="emit('cancel')"
      >
        Annuler
      </button>
    </div>
  </form>
</template>
