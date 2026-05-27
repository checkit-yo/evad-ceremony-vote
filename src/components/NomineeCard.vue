<script setup lang="ts">
import type { Nominee } from '~/data/mock'

const props = defineProps<{
  nominee: Nominee
  categorySlug: string
  showVideo?: boolean
}>()

const emit = defineEmits<{
  vote: [nominee: Nominee]
}>()

const isVideoExpanded = ref(false)

function toggleVideo() {
  isVideoExpanded.value = !isVideoExpanded.value
}

function handleVote() {
  console.log('Vote clicked for:', props.nominee.name)
  emit('vote', props.nominee)
}

// Nominee page URL
const nomineeUrl = computed(() => `/categories/${props.categorySlug}/${props.nominee.id}`)
</script>

<template>
  <div class="luxury-card overflow-hidden animate-fade-in border border-cream-300/20">
    <!-- Image - Clickable to go to nominee page -->
    <NuxtLink :to="nomineeUrl" class="block relative aspect-square overflow-hidden group">
      <img
        :src="nominee.imageUrl"
        :alt="nominee.name"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
        loading="lazy"
      >
      <!-- View profile overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div class="w-12 h-12 border border-gold/50 flex items-center justify-center backdrop-blur-sm bg-burgundy/30">
          <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
    </NuxtLink>

    <!-- Video (expanded) -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isVideoExpanded" class="relative aspect-video bg-burgundy-950 overflow-hidden">
        <iframe
          :src="`https://www.youtube.com/embed/${nominee.youtubeVideoId}?autoplay=1`"
          class="absolute inset-0 w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
        <button
          class="absolute top-2 right-2 w-8 h-8 border border-cream-300/30 flex items-center justify-center text-cream-300 hover:border-gold hover:text-gold transition-colors z-10 bg-burgundy/50"
          @click="toggleVideo"
          aria-label="Fermer la vidéo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Content -->
    <div class="p-5">
      <NuxtLink :to="nomineeUrl" class="block group/title">
        <h3 class="font-title font-light text-lg text-cream-100 mb-2 group-hover/title:text-gold transition-colors duration-500 tracking-wide">
          {{ nominee.name }}
        </h3>
      </NuxtLink>
      <p class="font-body text-cream-500 text-sm leading-relaxed mb-5 line-clamp-3">
        {{ nominee.description }}
      </p>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-primary flex-1 text-xs cursor-pointer"
          @click.stop="handleVote"
        >
          Voter
        </button>
        <button
          class="btn btn-outline px-3"
          @click="toggleVideo"
          :aria-label="isVideoExpanded ? 'Masquer la vidéo' : 'Voir la vidéo'"
        >
          <svg v-if="!isVideoExpanded" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <NuxtLink
          :to="nomineeUrl"
          class="btn btn-outline px-3"
          aria-label="Voir le profil et partager"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
