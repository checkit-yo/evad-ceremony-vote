<script setup lang="ts">
import type { Category } from '~/types'

const props = defineProps<{
  category: Category
}>()

const count = computed(() => props.category.nominee_count ?? 0)
</script>

<template>
  <NuxtLink
    :to="`/categories/${category.slug}`"
    class="luxury-card group block border border-cream-300/20 hover:border-gold/30 transition-all duration-500"
  >
    <div class="p-4 md:p-6">
      <!-- Minimal gold accent -->
      <div class="w-8 h-px bg-gold mb-4 md:mb-6 group-hover:w-12 transition-all duration-500" />

      <h3 class="font-title font-light text-sm md:text-lg text-cream-100 mb-2 md:mb-3 group-hover:text-gold transition-colors duration-500 tracking-wide line-clamp-2">
        {{ category.name }}
      </h3>

      <!-- Description hidden on mobile -->
      <p class="hidden md:block font-body text-cream-500 text-sm leading-relaxed line-clamp-2 mb-4">
        {{ category.description }}
      </p>

      <div class="flex items-center justify-between mt-3 md:mt-4">
        <span class="text-xs text-cream-500 font-body">
          {{ count }} nominé{{ count > 1 ? 's' : '' }}
        </span>
        <span class="text-gold font-title text-xs tracking-widest uppercase group-hover:translate-x-1 transition-transform duration-500 flex items-center gap-1">
          <span class="hidden sm:inline">Voir</span>
          <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
