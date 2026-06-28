<script setup lang="ts">
const { data: categories } = useCategories()

useSeoMeta({
  title: 'Evad Ceremony 2026 - Votez pour vos artistes préférés',
  description: 'La cérémonie qui célèbre l\'excellence de la danse. Votez pour vos artistes préférés et rejoignez-nous le 17 octobre 2026.',
})

// Countdown to ceremony date
const ceremonyDate = new Date('2026-10-17T20:00:00')
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
    description: 'Parcourez les 9 catégories et découvrez tous les nommés.',
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
    <section
      class="relative h-screen min-h-[600px] flex items-center justify-center bg-burgundy overflow-hidden hero-height">
      <!-- Enhanced gold gradient orbs -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/8 rounded-full blur-[120px] animate-pulse-gold" />
        <div
          class="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] animate-pulse-gold"
          style="animation-delay: 2s;" />
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-burgundy-900/50 rounded-full blur-[100px]" />
      </div>

      <!-- Decorative gold lines -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <!-- Elegant border frame (desktop only) -->
      <div
        class="hidden md:block absolute top-20 left-12 right-12 bottom-12 border border-cream-400/10 pointer-events-none" />

      <div
        class="container mx-auto px-4 py-8 md:py-12 relative z-10 text-center h-full flex flex-col justify-center gap-[5vh] md:gap-0">
        <!-- Top section: Title -->
        <div class="flex flex-col justify-center">
          <!-- Decorative top element -->
          <div class="flex items-center justify-center gap-4 mb-6 md:mb-4 animate-fade-in">
            <div class="w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <div class="w-2 h-2 rotate-45 border border-gold/50" />
            <div class="w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <h1
            class="font-normal text-7xl sm:text-6xl md:text-7xl lg:text-8xl text-cream-100 mb-4 animate-slide-up text-glow-gold">
            EVAD
          </h1>
          <h2
            class="font-script font-normal text-4xl sm:text-3xl md:text-4xl text-gold mb-4 md:mb-6 animate-slide-up stagger-1">
            Ceremony
          </h2>

          <p class="text-gold text-sm tracking-widest uppercase mb-4 md:mb-6 font-title animate-slide-up stagger-2">17
            Octobre 2026</p>

          <div class="gold-divider mb-6 md:mb-8 animate-fade-in stagger-2" />

          <p
            class="font-body text-cream-400 text-base sm:text-sm md:text-base max-w-xl mx-auto mb-0 md:mb-4 animate-slide-up stagger-3 px-4 leading-relaxed">
            La cérémonie qui célèbre l'excellence et la passion de la danse.
          </p>
        </div>

        <!-- Middle section: Countdown -->
        <div class="py-4 md:py-4 md:mb-4 animate-slide-up stagger-4">
          <div class="flex justify-center gap-3 md:gap-5">
            <div
              class="text-center min-w-[3.5rem] md:min-w-[4.5rem] px-2 py-3 border border-cream-400/10 bg-burgundy-950/50 backdrop-blur-sm">
              <span class="block font-title font-light text-xl md:text-3xl text-cream-100 tabular-nums">{{
                countdown.days }}</span>
              <span class="text-gold/70 text-[9px] md:text-[11px] tracking-widest uppercase font-title">Jours</span>
            </div>
            <span class="text-gold/40 text-xl md:text-3xl font-light self-center">:</span>
            <div
              class="text-center min-w-[3.5rem] md:min-w-[4.5rem] px-2 py-3 border border-cream-400/10 bg-burgundy-950/50 backdrop-blur-sm">
              <span class="block font-title font-light text-xl md:text-3xl text-cream-100 tabular-nums">{{
                countdown.hours }}</span>
              <span class="text-gold/70 text-[9px] md:text-[11px] tracking-widest uppercase font-title">Heures</span>
            </div>
            <span class="text-gold/40 text-xl md:text-3xl font-light self-center">:</span>
            <div
              class="text-center min-w-[3.5rem] md:min-w-[4.5rem] px-2 py-3 border border-cream-400/10 bg-burgundy-950/50 backdrop-blur-sm">
              <span class="block font-title font-light text-xl md:text-3xl text-cream-100 tabular-nums">{{
                countdown.minutes }}</span>
              <span class="text-gold/70 text-[9px] md:text-[11px] tracking-widest uppercase font-title">Min</span>
            </div>
            <span class="text-gold/40 text-xl md:text-3xl font-light self-center hidden sm:block">:</span>
            <div
              class="text-center min-w-[3.5rem] md:min-w-[4.5rem] px-2 py-3 border border-cream-400/10 bg-burgundy-950/50 backdrop-blur-sm hidden sm:block">
              <span class="block font-title font-light text-xl md:text-3xl text-cream-100 tabular-nums">{{
                countdown.seconds }}</span>
              <span class="text-gold/70 text-[9px] md:text-[11px] tracking-widest uppercase font-title">Sec</span>
            </div>
          </div>
        </div>

        <!-- Bottom section: CTA -->
        <div class="pb-4 md:pb-0 animate-slide-up stagger-5">
          <NuxtLink to="#categories" class="btn btn-gold text-xs md:text-sm px-6 md:px-10 py-2.5 md:py-3">
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
    <section id="categories" class="py-16 md:py-28 bg-burgundy-950 relative overflow-hidden">
      <!-- Background accents -->
      <div class="absolute inset-0 bg-luxury-radial pointer-events-none" />
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12 md:mb-20">
          <!-- Decorative element -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-8 h-px bg-gold/30" />
            <span class="text-gold text-xs tracking-[0.3em] uppercase font-title">Sélection 2026</span>
            <div class="w-8 h-px bg-gold/30" />
          </div>
          <h2 class="text-4xl md:text-6xl lg:text-7xl font-script text-cream-100 mb-6 mt-8 text-glow-gold">
            Les Catégories
          </h2>
          <div class="gold-divider-wide" />
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <CategoryCard v-for="category in (categories ?? [])" :key="category.id" :category="category" />
        </div>
      </div>

      <div
        class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-400/10 to-transparent" />
    </section>

    <!-- How to Vote Section -->
    <section id="how-to-vote" class="py-16 md:py-28 bg-burgundy relative overflow-hidden">
      <!-- Background gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-burgundy-950/50 via-burgundy to-burgundy pointer-events-none" />

      <!-- Subtle top border -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12 md:mb-20">
          <!-- Decorative element -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-8 h-px bg-gold/30" />
            <span class="text-gold text-xs tracking-[0.3em] uppercase font-title">Processus</span>
            <div class="w-8 h-px bg-gold/30" />
          </div>
          <h2 class="text-4xl md:text-6xl font-script text-cream-100 mb-6 mt-8 text-glow-gold">
            Comment Voter
          </h2>
          <div class="gold-divider-wide mb-6" />
          <p class="text-sm md:text-base text-cream-400 font-body">
            Votez dans autant de catégories que vous le souhaitez • 1 seul vote par catégorie
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          <div v-for="(step, index) in howToVoteSteps" :key="step.title" class="text-center group relative">
            <!-- Step number -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center">
              <span class="text-gold/40 text-xs font-title">0{{ index + 1 }}</span>
            </div>

            <div class="mb-6 pt-4">
              <div
                class="w-16 h-16 md:w-20 md:h-20 border border-cream-400/20 flex items-center justify-center mx-auto group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500 relative">
                <!-- Corner accents on hover -->
                <div
                  class="absolute -top-px -left-px w-3 h-3 border-t border-l border-transparent group-hover:border-gold/50 transition-colors duration-500" />
                <div
                  class="absolute -top-px -right-px w-3 h-3 border-t border-r border-transparent group-hover:border-gold/50 transition-colors duration-500" />
                <div
                  class="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-transparent group-hover:border-gold/50 transition-colors duration-500" />
                <div
                  class="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-transparent group-hover:border-gold/50 transition-colors duration-500" />

                <svg class="w-7 h-7 md:w-8 md:h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" :d="step.icon" />
                </svg>
              </div>
            </div>
            <h3
              class="font-title font-light text-lg md:text-xl text-cream-100 mb-3 tracking-wide group-hover:text-gold transition-colors duration-500">
              {{ step.title }}
            </h3>
            <p class="font-body text-cream-500 text-sm leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Subtle bottom border -->
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>

    <!-- Ticketing Section -->
    <section id="billetterie" class="py-16 md:py-28 bg-burgundy-950 relative overflow-hidden">
      <!-- Background accents -->
      <div class="absolute inset-0 bg-luxury-radial pointer-events-none" />
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <!-- Decorative element -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-8 h-px bg-gold/30" />
            <span class="text-gold text-xs tracking-[0.3em] uppercase font-title">17 Octobre 2026</span>
            <div class="w-8 h-px bg-gold/30" />
          </div>

          <h2 class="text-4xl md:text-6xl font-script text-cream-100 mb-6 mt-8 text-glow-gold">
            Rejoignez-nous
          </h2>
          <div class="gold-divider-wide mb-8" />

          <p class="font-body text-cream-400 text-base md:text-lg mb-10 leading-relaxed px-4">
            Vivez une soirée exceptionnelle célébrant l'excellence de la danse.
            Réservez dès maintenant votre place pour la cérémonie EVAD 2026.
          </p>

          <a href="https://www.helloasso.com/associations/evad-creation/evenements/evad-ceremony" target="_blank"
            rel="noopener noreferrer"
            class="btn btn-gold text-sm md:text-base px-8 md:px-12 py-3 md:py-4 inline-flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Réserver mes billets
          </a>

          <p class="mt-8 text-cream-600 text-sm font-body">
            Paris • Places limitées
          </p>
        </div>
      </div>

      <div
        class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-400/10 to-transparent" />
    </section>
  </div>
</template>
