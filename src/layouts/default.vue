<script setup lang="ts">
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader :is-menu-open="isMenuOpen" @toggle-menu="toggleMenu" @close-menu="closeMenu" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
