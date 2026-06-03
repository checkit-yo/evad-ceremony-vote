<script setup lang="ts">
import type { Category, Nominee } from '~/types'

const props = defineProps<{
  nominee?: Nominee | null
  categories: Category[]
  defaultCategoryId?: string
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { category_id: string, name: string, description: string, display_order: number, image?: File | null }]
  cancel: []
}>()

const form = reactive({
  category_id: '',
  name: '',
  description: '',
  display_order: 0,
})
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

watchEffect(() => {
  if (props.nominee) {
    form.category_id = props.nominee.category_id
    form.name = props.nominee.name
    form.description = props.nominee.description
    form.display_order = props.nominee.display_order
    imagePreview.value = props.nominee.image_url
  } else {
    form.category_id = props.defaultCategoryId || (props.categories[0]?.id ?? '')
    form.name = ''
    form.description = ''
    form.display_order = 0
    imagePreview.value = null
  }
})

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  imageFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => { imagePreview.value = ev.target?.result as string }
    reader.readAsDataURL(file)
  }
}

function onSubmit() {
  emit('submit', { ...form, image: imageFile.value })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Catégorie</label>
      <select
        v-model="form.category_id"
        required
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
      >
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

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

    <div>
      <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Photo</label>
      <div class="flex items-center gap-4">
        <div class="w-20 h-20 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
          <img v-if="imagePreview" :src="imagePreview" alt="" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center text-slate-600 text-xs">Aucune</div>
        </div>
        <label class="cursor-pointer">
          <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="onFileChange">
          <span class="inline-block bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg transition-colors">
            Choisir une image
          </span>
        </label>
      </div>
      <p class="text-xs text-slate-500 mt-1">PNG / JPEG / WebP, max 5 MB.</p>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        class="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold py-2.5 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
        :disabled="submitting"
      >
        {{ submitting ? 'Enregistrement…' : (nominee ? 'Enregistrer' : 'Créer') }}
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
