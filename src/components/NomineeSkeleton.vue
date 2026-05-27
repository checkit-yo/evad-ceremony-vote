<script setup lang="ts">
defineProps<{
  count?: number
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div
      v-for="i in (count || 8)"
      :key="i"
      class="luxury-card border border-cream-300/20 overflow-hidden"
    >
      <!-- Image Skeleton -->
      <div class="aspect-square bg-cream-400/10 animate-pulse" />
      
      <!-- Content Skeleton -->
      <div class="p-5 space-y-3">
        <!-- Title -->
        <div class="h-5 bg-cream-400/10 animate-pulse w-3/4" />
        
        <!-- Description lines -->
        <div class="space-y-2">
          <div class="h-4 bg-cream-400/5 animate-pulse" />
          <div class="h-4 bg-cream-400/5 animate-pulse w-5/6" />
          <div class="h-4 bg-cream-400/5 animate-pulse w-4/6" />
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-2">
          <div class="h-11 bg-cream-400/10 animate-pulse flex-1" />
          <div class="h-11 w-12 bg-cream-400/5 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
</template>
