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
  <!-- Mobile: List style -->
  <div class="md:hidden luxury-card overflow-hidden animate-fade-in border border-cream-300/20">
    <div class="flex items-center gap-3 p-3">
      <!-- Image -->
      <NuxtLink :to="nomineeUrl" class="block relative w-14 h-14 flex-shrink-0 overflow-hidden">
        <img :src="imageUrl" :alt="nominee.name" class="w-full h-full object-cover" loading="lazy">
      </NuxtLink>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <NuxtLink :to="nomineeUrl" class="block">
          <h3 class="font-title font-light text-sm text-cream-100 truncate">
            {{ nominee.name }}
          </h3>
        </NuxtLink>
      </div>

      <!-- Vote button -->
      <button type="button" class="btn btn-primary text-xs px-4 py-2 flex-shrink-0" @click.stop="handleVote">
        Voter
      </button>
    </div>
  </div>

  <!-- Desktop: Card style -->
  <div class="hidden md:block luxury-card overflow-hidden animate-fade-in border border-cream-300/20">
    <!-- Image -->
    <NuxtLink :to="nomineeUrl" class="block relative aspect-[4/3] overflow-hidden group">
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
    <div class="p-3 lg:p-4">
      <NuxtLink :to="nomineeUrl" class="block group/title">
        <h3
          class="font-title font-light text-base text-cream-100 mb-1 group-hover/title:text-gold transition-colors duration-500 tracking-wide">
          {{ nominee.name }}
        </h3>
      </NuxtLink>
      <p class="font-body text-cream-500 text-xs leading-relaxed mb-3 line-clamp-2">
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
