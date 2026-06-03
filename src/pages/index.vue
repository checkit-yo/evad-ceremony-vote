<script setup lang="ts">
const { data: categories } = useCategories()

useSeoMeta({
  title: 'Evad Ceremony 2026 - Votez pour vos artistes préférés',
  description: 'La cérémonie qui célèbre l\'excellence de la danse. Votez pour vos artistes préférés et rejoignez-nous le 18 octobre 2026.',
})

// Countdown to ceremony date
const ceremonyDate = new Date('2026-10-18T20:00:00')
const votingOpenDate = new Date('2026-06-07T00:00:00')
const now = ref(new Date())

const countdown = computed(() => {
  const diff = ceremonyDate.getTime() - now.value.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
})

const isVotingOpen = computed(() => now.value >= votingOpenDate)

onMounted(() => {
  const interval = setInterval(() => {
    now.value = new Date()
  }, 1000)

  onUnmounted(() => clearInterval(interval))
})

const howToVoteSteps = [
  {
    title: 'Choisissez',
    description: 'Parcourez les 10 catégories et découvrez tous les nominés.',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    title: 'Sélectionnez',
    description: 'Regardez les vidéos et choisissez votre favori.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    title: 'Confirmez',
    description: 'Validez votre vote avec un code envoyé par email.',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
]
</script>

<template>
  <div class="grain">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center bg-burgundy overflow-hidden">
      <!-- Subtle gold gradient orbs -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
        <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[120px]" />
      </div>

      <!-- Elegant border frame (desktop only) -->
      <div
        class="hidden md:block absolute top-24 left-8 right-8 bottom-8 border border-cream-400/10 pointer-events-none" />

      <div class="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
        <!-- Minimalist logo -->

        <h1
          class="font-title font-light text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-cream-100 mb-4 md:mb-6 animate-slide-up tracking-widest">
          EVAD
        </h1>
        <h2
          class="font-title font-light text-xl sm:text-2xl md:text-3xl text-gold mb-6 md:mb-8 animate-slide-up stagger-1 tracking-[0.2em] uppercase">
          Ceremony
        </h2>

        <div class="gold-divider mb-6 md:mb-8 animate-fade-in stagger-2" />

        <p
          class="font-body text-cream-400 text-sm md:text-lg max-w-xl mx-auto mb-8 md:mb-12 animate-slide-up stagger-2 px-4 leading-relaxed">
          La cérémonie qui célèbre l'excellence et la passion de la danse.
        </p>

        <!-- Elegant countdown -->
        <div class="mb-8 md:mb-12 animate-slide-up stagger-3">
          <p class="text-cream-500 text-xs tracking-widest uppercase mb-4 font-title">Jusqu'à la cérémonie</p>
          <p class="text-gold text-sm tracking-widest uppercase mb-4 font-title">18 Octobre 2026</p>
          <div class="flex justify-center gap-4 md:gap-8">
            <div class="text-center min-w-[3rem] md:min-w-[4rem]">
              <span class="block font-title font-light text-2xl md:text-4xl text-cream-100 tabular-nums">{{
                countdown.days }}</span>
              <span class="text-cream-500 text-[10px] md:text-xs tracking-widest uppercase font-title">Jours</span>
            </div>
            <span class="text-gold/30 text-2xl md:text-4xl font-light">:</span>
            <div class="text-center min-w-[3rem] md:min-w-[4rem]">
              <span class="block font-title font-light text-2xl md:text-4xl text-cream-100 tabular-nums">{{
                countdown.hours }}</span>
              <span class="text-cream-500 text-[10px] md:text-xs tracking-widest uppercase font-title">Heures</span>
            </div>
            <span class="text-gold/30 text-2xl md:text-4xl font-light">:</span>
            <div class="text-center min-w-[3rem] md:min-w-[4rem]">
              <span class="block font-title font-light text-2xl md:text-4xl text-cream-100 tabular-nums">{{
                countdown.minutes }}</span>
              <span class="text-cream-500 text-[10px] md:text-xs tracking-widest uppercase font-title">Min</span>
            </div>
            <span class="text-gold/30 text-2xl md:text-4xl font-light hidden sm:block">:</span>
            <div class="text-center min-w-[3rem] md:min-w-[4rem] hidden sm:block">
              <span class="block font-title font-light text-2xl md:text-4xl text-cream-100 tabular-nums">{{
                countdown.seconds }}</span>
              <span class="text-cream-500 text-[10px] md:text-xs tracking-widest uppercase font-title">Sec</span>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="animate-slide-up stagger-4">
          <NuxtLink to="#categories" class="btn btn-gold text-sm md:text-base px-8 md:px-12 py-3 md:py-4">
            Voter maintenant
          </NuxtLink>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div class="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
      </div>
    </section>

    <!-- Categories Section -->
    <section id="categories" class="py-16 md:py-28 bg-burgundy-950 relative">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 md:mb-20">
          <span class="text-gold text-xs tracking-[0.3em] uppercase font-title mb-4 block">Sélection 2026</span>
          <h2 class="text-2xl md:text-4xl lg:text-5xl font-title font-light text-cream-100 mb-4 tracking-wider">
            Les Catégories
          </h2>
          <div class="gold-divider" />
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          <CategoryCard v-for="category in (categories ?? [])" :key="category.id" :category="category" />
        </div>
      </div>
    </section>

    <!-- How to Vote Section -->
    <section id="how-to-vote" class="py-16 md:py-28 bg-burgundy relative">
      <!-- Subtle top border -->
      <div
        class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-400/10 to-transparent" />

      <div class="container mx-auto px-4">
        <div class="text-center mb-12 md:mb-20">
          <span class="text-gold text-xs tracking-[0.3em] uppercase font-title mb-4 block">Processus</span>
          <h2 class="text-2xl md:text-4xl font-title font-light text-cream-100 mb-4 tracking-wider">
            Comment Voter
          </h2>
          <div class="gold-divider mb-4" />
          <p class="text-sm md:text-base text-cream-500 font-body">
            3 étapes simples • 1 vote par catégorie
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          <div v-for="step in howToVoteSteps" :key="step.title" class="text-center group">
            <div class="mb-6">
              <div
                class="w-16 h-16 md:w-20 md:h-20 border border-cream-400/20 flex items-center justify-center mx-auto group-hover:border-gold/50 transition-colors duration-500">
                <svg class="w-7 h-7 md:w-8 md:h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" :d="step.icon" />
                </svg>
              </div>
            </div>
            <h3 class="font-title font-light text-lg md:text-xl text-cream-100 mb-3 tracking-wide">
              {{ step.title }}
            </h3>
            <p class="font-body text-cream-500 text-sm leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Subtle bottom border -->
      <div
        class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-400/10 to-transparent" />
    </section>
  </div>
</template>
