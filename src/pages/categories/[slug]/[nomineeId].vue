<script setup lang="ts">
import { getCategoryBySlug, type Nominee, type Category } from '~/data/mock'

const route = useRoute()
const categorySlug = computed(() => route.params.slug as string)
const nomineeId = computed(() => route.params.nomineeId as string)

// Simulating async data loading
const isLoading = ref(true)
const category = ref<Category | null>(null)
const nominee = ref<Nominee | null>(null)

// Load data
onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const foundCategory = getCategoryBySlug(categorySlug.value)
  if (!foundCategory) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Catégorie non trouvée',
    })
  }
  
  const foundNominee = foundCategory.nominees.find(n => n.id === nomineeId.value)
  if (!foundNominee) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Nominé non trouvé',
    })
  }
  
  category.value = foundCategory
  nominee.value = foundNominee
  isLoading.value = false
})

// SEO
useSeoMeta({
  title: () => nominee.value ? `${nominee.value.name} - ${category.value?.name} - Evad Ceremony` : 'Chargement...',
  description: () => nominee.value?.description || '',
})

// Voting modal state
const isVoteModalOpen = ref(false)

function openVoteModal() {
  isVoteModalOpen.value = true
}

function closeVoteModal() {
  isVoteModalOpen.value = false
}

function handleVoteSuccess() {
  console.log('Vote successful!')
}

// Share functionality
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

const isCopied = ref(false)

async function copyLink() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(shareUrl.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}

async function shareNative() {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${nominee.value?.name} - Evad Ceremony`,
        text: `Vote pour ${nominee.value?.name} dans la catégorie ${category.value?.name} !`,
        url: shareUrl.value,
      })
    } catch (err) {
      // User cancelled or share failed
      copyLink()
    }
  } else {
    copyLink()
  }
}
</script>

<template>
  <div class="pt-20 grain">
    <!-- Header -->
    <section class="bg-burgundy pt-8 pb-4 md:pt-12 md:pb-6 border-b border-cream-300/20">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center gap-2 text-cream-500 font-body text-sm">
            <li>
              <NuxtLink to="/" class="hover:text-gold transition-colors duration-500">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <NuxtLink :to="`/categories/${categorySlug}`" class="hover:text-gold transition-colors duration-500">
                <template v-if="category">{{ category.name }}</template>
                <template v-else><span class="inline-block w-20 h-4 bg-cream-400/20 animate-pulse" /></template>
              </NuxtLink>
            </li>
            <li>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li class="text-gold truncate max-w-[150px]">
              <template v-if="nominee">{{ nominee.name }}</template>
              <template v-else><span class="inline-block w-24 h-4 bg-cream-400/20 animate-pulse" /></template>
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-8 md:py-16 bg-burgundy-950">
      <div class="container mx-auto px-4">
        <template v-if="!isLoading && nominee && category">
          <div class="max-w-4xl mx-auto">
            <div class="luxury-card border border-cream-400/10 overflow-hidden">
              <!-- Top: Image + Video -->
              <div class="grid grid-cols-1 md:grid-cols-2">
                <!-- Image -->
                <div class="aspect-square">
                  <img
                    :src="nominee.imageUrl"
                    :alt="nominee.name"
                    class="w-full h-full object-cover"
                  >
                </div>
                
                <!-- Video -->
                <div class="aspect-square bg-burgundy-950 flex items-center justify-center">
                  <iframe
                    :src="`https://www.youtube.com/embed/${nominee.youtubeVideoId}`"
                    class="w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 md:p-8">
                <!-- Category badge -->
                <NuxtLink 
                  :to="`/categories/${category.slug}`"
                  class="inline-flex items-center gap-2 px-3 py-1 border border-gold/30 text-gold text-xs font-title tracking-wider mb-4 hover:bg-gold/10 transition-colors duration-500"
                >
                  {{ category.name }}
                </NuxtLink>

                <!-- Name -->
                <h1 class="font-title font-light text-2xl md:text-3xl text-cream-100 mb-4 tracking-wide">
                  {{ nominee.name }}
                </h1>

                <!-- Description -->
                <p class="font-body text-cream-500 text-base leading-relaxed mb-8">
                  {{ nominee.description }}
                </p>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-4">
                  <button
                    class="btn btn-gold text-sm flex-1 py-4"
                    @click="openVoteModal"
                  >
                    Voter pour {{ nominee.name.split(' ')[0] }}
                  </button>
                  
                  <button
                    class="btn btn-outline py-4 px-6"
                    @click="shareNative"
                  >
                    <svg v-if="!isCopied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ isCopied ? 'Lien copié !' : 'Partager' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Back link -->
            <div class="mt-8 text-center">
              <NuxtLink
                :to="`/categories/${category.slug}`"
                class="inline-flex items-center gap-2 text-cream-500 hover:text-gold font-body transition-colors duration-500"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
                </svg>
                Voir tous les nominés
              </NuxtLink>
            </div>
          </div>
        </template>

        <!-- Loading skeleton -->
        <template v-else>
          <div class="max-w-4xl mx-auto">
            <div class="luxury-card border border-cream-400/10 overflow-hidden">
              <div class="grid grid-cols-1 md:grid-cols-2">
                <div class="aspect-square bg-cream-400/10 animate-pulse" />
                <div class="aspect-square bg-cream-400/5 animate-pulse" />
              </div>
              <div class="p-6 md:p-8 space-y-4">
                <div class="h-6 w-32 bg-cream-400/10 animate-pulse" />
                <div class="h-10 w-2/3 bg-cream-400/10 animate-pulse" />
                <div class="space-y-2">
                  <div class="h-5 bg-cream-400/5 animate-pulse" />
                  <div class="h-5 bg-cream-400/5 animate-pulse w-5/6" />
                  <div class="h-5 bg-cream-400/5 animate-pulse w-4/6" />
                </div>
                <div class="h-14 bg-cream-400/10 animate-pulse mt-6" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Vote Modal -->
    <VoteModal
      :is-open="isVoteModalOpen"
      :nominee="nominee"
      :category-name="category?.name || ''"
      @close="closeVoteModal"
      @success="handleVoteSuccess"
    />
  </div>
</template>
