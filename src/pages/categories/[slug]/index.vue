<script setup lang="ts">
import type { Nominee } from '~/types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: category, pending, error } = useCategory(slug)
const { data: allCategories } = useCategories()

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Catégorie non trouvée' })
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const shuffledNominees = computed<Nominee[]>(() => {
  const nominees = category.value?.nominees ?? []
  return shuffleArray(nominees as Nominee[]).map(n => ({ ...n, category_id: category.value!.id }))
})

useSeoMeta({
  title: () => category.value ? `${category.value.name} - Evad Ceremony 2026` : 'Chargement...',
  description: () => category.value?.description || '',
})

const isVoteModalOpen = ref(false)
const selectedNominee = ref<Nominee | null>(null)

function openVoteModal(nominee: Nominee) {
  selectedNominee.value = nominee
  isVoteModalOpen.value = true
}

function closeVoteModal() {
  isVoteModalOpen.value = false
  selectedNominee.value = null
}

function handleVoteSuccess() { }

const isLoading = computed(() => pending.value && !category.value)
</script>

<template>
  <div class="pt-20 grain">
    <!-- Header (sticky) -->
    <section class="bg-burgundy py-8 md:py-12 border-b border-cream-300/20 sticky top-16 z-20">
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
              <NuxtLink to="/#categories" class="hover:text-gold transition-colors duration-500">
                Catégories
              </NuxtLink>
            </li>
            <li>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li class="text-gold">
              <template v-if="!isLoading && category">
                {{ category.name }}
              </template>
              <template v-else>
                <span class="inline-block w-24 h-4 bg-cream-400/20 animate-pulse" />
              </template>
            </li>
          </ol>
        </nav>

        <!-- Title -->
        <div class="max-w-3xl">
          <template v-if="!isLoading && category">
            <div class="w-12 h-px bg-gold mb-6 animate-fade-in" />
            <h1 class="font-script text-4xl sm:text-5xl md:text-6xl text-cream-100 mb-4 animate-fade-in">
              {{ category.name }}
            </h1>
            <p class="font-body text-cream-500 text-base md:text-lg animate-fade-in stagger-1 leading-relaxed">
              {{ category.description }}
            </p>
            <div class="flex flex-wrap items-center gap-3 mt-6 animate-fade-in stagger-2">
              <span
                class="inline-flex items-center gap-2 px-4 py-2 border border-cream-400/20 text-cream-400 font-body text-sm">
                {{ category.nominees.length }} nominé{{ category.nominees.length > 1 ? 's' : '' }}
              </span>
              <span class="px-4 py-2 border border-gold/30 text-gold/80 font-body text-sm">
                Un seul vote autorisé
              </span>
            </div>
          </template>
          <template v-else>
            <div class="h-10 w-2/3 bg-cream-400/10 animate-pulse mb-4" />
            <div class="h-5 w-full bg-cream-400/5 animate-pulse mb-2" />
            <div class="h-5 w-4/5 bg-cream-400/5 animate-pulse" />
          </template>
        </div>
      </div>
    </section>

    <!-- Nominees Grid -->
    <section class="py-12 md:py-20 bg-burgundy-950">
      <div class="container mx-auto px-4">
        <template v-if="!isLoading && category">
          <div v-if="shuffledNominees.length === 0" class="text-center py-16 text-cream-500">
            Aucun nominé pour cette catégorie pour le moment.
          </div>
          <div v-else class="grid grid-cols-2 gap-3 md:gap-6">
            <NomineeCard v-for="(nominee, index) in shuffledNominees" :key="nominee.id" :nominee="nominee"
              :category-slug="slug" :class="[`stagger-${(index % 6) + 1}`]" @vote="openVoteModal" />
          </div>
        </template>
        <template v-else>
          <NomineeSkeleton :count="8" />
        </template>
      </div>
    </section>

    <!-- Other Categories -->
    <section class="py-12 md:py-20 bg-burgundy border-t border-cream-300/20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <span class="text-gold text-xs tracking-[0.3em] uppercase font-title mb-4 block">Explorer</span>
          <h2 class="font-script text-3xl md:text-5xl text-cream-100 mb-2">
            Autres Catégories
          </h2>
          <div class="gold-divider" />
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink v-for="cat in (allCategories ?? []).filter(c => c.slug !== slug)" :key="cat.id"
            :to="`/categories/${cat.slug}`"
            class="px-4 py-2 border border-cream-400/20 hover:border-gold hover:text-gold text-cream-400 font-title text-xs tracking-wider transition-all duration-500">
            {{ cat.name }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Vote Modal -->
    <VoteModal :is-open="isVoteModalOpen" :nominee="selectedNominee" :category-name="category?.name || ''"
      @close="closeVoteModal" @success="handleVoteSuccess" />
  </div>
</template>
