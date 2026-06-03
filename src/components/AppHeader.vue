<script setup lang="ts">
const { data: categories } = useCategories()

defineProps<{
  isMenuOpen: boolean
}>()

const emit = defineEmits<{
  toggleMenu: []
  closeMenu: []
}>()

const route = useRoute()

const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="[
      isScrolled ? 'bg-burgundy/95 backdrop-blur-md border-b border-cream-300/10' : 'bg-transparent',
      route.path !== '/' ? 'bg-burgundy/95 backdrop-blur-md border-b border-cream-300/10' : ''
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3" @click="emit('closeMenu')">
          <span class="font-title font-light text-xl text-cream-100 tracking-widest">
            EVAD
          </span>
          <span class="w-px h-4 bg-gold/50" />
          <span class="font-title text-xs text-gold tracking-widest uppercase">
            Ceremony
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-10">
          <NuxtLink
            to="/"
            class="font-title text-xs uppercase tracking-widest text-cream-400 hover:text-gold transition-colors duration-500"
          >
            Accueil
          </NuxtLink>
          <div class="relative group">
            <button class="font-title text-xs uppercase tracking-widest text-cream-400 hover:text-gold transition-colors duration-500 flex items-center gap-2">
              Catégories
              <svg class="w-3 h-3 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- Dropdown -->
            <div class="absolute top-full left-0 mt-4 w-64 bg-burgundy border border-cream-300/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div class="py-2">
                <NuxtLink
                  v-for="category in (categories ?? [])"
                  :key="category.id"
                  :to="`/categories/${category.slug}`"
                  class="block px-4 py-2.5 text-cream-400 hover:text-gold hover:bg-cream-400/5 transition-colors duration-300 font-body text-sm"
                >
                  {{ category.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
          <NuxtLink
            to="/#how-to-vote"
            class="font-title text-xs uppercase tracking-widest text-cream-400 hover:text-gold transition-colors duration-500"
          >
            Comment voter
          </NuxtLink>
        </nav>

        <!-- CTA Button (Desktop) -->
        <NuxtLink
          to="/#categories"
          class="hidden lg:inline-flex btn btn-gold text-xs"
        >
          Voter
        </NuxtLink>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 text-cream-300 hover:text-gold transition-colors"
          @click="emit('toggleMenu')"
          aria-label="Toggle menu"
        >
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMenuOpen" class="lg:hidden bg-burgundy-950 backdrop-blur-md border-t border-gold/30 shadow-xl shadow-burgundy-950/50">
        <nav class="container mx-auto px-4 py-6 space-y-4">
          <NuxtLink
            to="/"
            class="block font-title text-sm tracking-wider text-cream-200 hover:text-gold transition-colors"
            @click="emit('closeMenu')"
          >
            Accueil
          </NuxtLink>
          
          <div class="border-t border-cream-400/10 pt-4">
            <p class="font-title text-xs uppercase tracking-widest text-cream-500 mb-3">Catégories</p>
            <div class="grid grid-cols-2 gap-2">
              <NuxtLink
                v-for="category in (categories ?? [])"
                :key="category.id"
                :to="`/categories/${category.slug}`"
                class="block px-3 py-2 text-sm text-cream-400 hover:text-gold transition-colors font-body"
                @click="emit('closeMenu')"
              >
                {{ category.name }}
              </NuxtLink>
            </div>
          </div>

          <div class="border-t border-cream-400/10 pt-4">
            <NuxtLink
              to="/#categories"
              class="btn btn-gold w-full text-xs"
              @click="emit('closeMenu')"
            >
              Voter maintenant
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>
