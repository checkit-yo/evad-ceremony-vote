<script setup lang="ts">
import type { Nominee } from '~/types'

const props = defineProps<{
  nominee: Nominee
  categorySlug: string
}>()

const emit = defineEmits<{
  vote: [nominee: Nominee]
}>()

function handleVote() {
  emit('vote', props.nominee)
}

const nomineeUrl = computed(() => `/categories/${props.categorySlug}/${props.nominee.id}`)
const imageUrl = computed(() => props.nominee.image_url || '/placeholder-nominee.svg')
</script>

<template>
  <div class="luxury-card overflow-hidden animate-fade-in border border-cream-300/20">
    <!-- Image -->
    <NuxtLink :to="nomineeUrl" class="block relative aspect-square overflow-hidden group">
      <img :src="imageUrl" :alt="nominee.name"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
        loading="lazy">
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div class="w-12 h-12 border border-gold/50 flex items-center justify-center backdrop-blur-sm bg-burgundy/30">
          <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
    </NuxtLink>

    <!-- Content -->
    <div class="p-5">
      <NuxtLink :to="nomineeUrl" class="block group/title">
        <h3
          class="font-title font-light text-lg text-cream-100 mb-2 group-hover/title:text-gold transition-colors duration-500 tracking-wide">
          {{ nominee.name }}
        </h3>
      </NuxtLink>
      <p class="font-body text-cream-500 text-sm leading-relaxed mb-5 line-clamp-3">
        {{ nominee.description }}
      </p>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button type="button" class="btn btn-primary flex-1 text-xs cursor-pointer" @click.stop="handleVote">
          Voter
        </button>
        <NuxtLink :to="nomineeUrl" class="btn btn-outline px-3" aria-label="Voir le profil">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
