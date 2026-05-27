<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-burgundy-950 text-cream-300 border-t border-cream-300/20">
    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Quick Links -->
        <div>
          <h4 class="font-title font-light text-sm tracking-widest uppercase text-cream-200 mb-6">Navigation</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="font-body text-cream-500 hover:text-gold transition-colors duration-500">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#categories" class="font-body text-cream-500 hover:text-gold transition-colors duration-500">
                Catégories
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#how-to-vote" class="font-body text-cream-500 hover:text-gold transition-colors duration-500">
                Comment voter
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Social & Contact -->
        <div>
          <h4 class="font-title font-light text-sm tracking-widest uppercase text-cream-200 mb-6">Suivez-nous</h4>
          <div class="flex gap-4 mb-6">
            <!-- Instagram -->
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 border border-cream-400/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-500"
              aria-label="Instagram"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <!-- YouTube -->
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 border border-cream-400/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-500"
              aria-label="YouTube"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
          <p class="font-body text-cream-600 text-sm">
            18 Octobre 2026 • Paris
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-cream-400/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="font-body text-cream-600 text-xs tracking-wider">
          © {{ currentYear }} EVAD CEREMONY
        </p>
        <p class="font-body text-cream-600 text-xs flex items-center gap-2">
          Développé par
          <a href="https://checkit.dance" target="_blank" rel="noopener noreferrer" class="text-gold hover:underline font-title tracking-wider">
            CHECKIT
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
