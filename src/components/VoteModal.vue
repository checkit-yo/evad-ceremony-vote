<script setup lang="ts">
import type { Nominee } from '~/types'

const props = defineProps<{
  isOpen: boolean
  nominee: Nominee | null
  categoryName: string
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

type Step = 'email' | 'otp' | 'loading' | 'success' | 'error' | 'already-voted'

const step = ref<Step>('email')
const email = ref('')
const otpCode = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

// Watch for modal open to reset state
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetState()
  }
})

function resetState() {
  step.value = 'email'
  email.value = ''
  otpCode.value = ''
  errorMessage.value = ''
  isSubmitting.value = false
}

async function handleEmailSubmit() {
  if (!email.value || !isValidEmail(email.value)) {
    errorMessage.value = 'Veuillez entrer une adresse email valide.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Mock API call to initiate vote
    const response = await $fetch('/api/vote', {
      method: 'POST',
      body: {
        email: email.value,
        nomineeId: props.nominee?.id,
        categoryId: props.nominee?.category_id,
      },
    })

    if (response.success) {
      step.value = 'otp'
    } else if (response.alreadyVoted) {
      step.value = 'already-voted'
    } else {
      errorMessage.value = response.message || 'Une erreur est survenue.'
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}

async function handleOtpSubmit() {
  if (!otpCode.value || otpCode.value.length !== 6) {
    errorMessage.value = 'Veuillez entrer le code à 6 chiffres.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Mock API call to verify OTP
    const response = await $fetch('/api/verify-otp', {
      method: 'POST',
      body: {
        email: email.value,
        code: otpCode.value,
      },
    })

    if (response.success) {
      step.value = 'success'
      emit('success')
    } else {
      errorMessage.value = response.message || 'Code invalide. Veuillez réessayer.'
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function handleClose() {
  emit('close')
}

// Handle OTP input - only allow numbers and auto-focus
function handleOtpInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '').slice(0, 6)
  otpCode.value = input.value
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="w-full max-w-md bg-burgundy-950 border border-gold/30 overflow-hidden animate-scale-in shadow-2xl"
          >
            <!-- Header -->
            <div class="px-6 py-5 border-b border-cream-400/10">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-title font-light text-lg text-cream-100 tracking-wide">
                    {{ step === 'success' ? 'Vote confirmé' : step === 'already-voted' ? 'Déjà voté' : 'Voter' }}
                  </h3>
                  <p v-if="nominee && step !== 'success' && step !== 'already-voted'" class="text-cream-500 font-body text-sm mt-1">
                    {{ categoryName }} • {{ nominee.name }}
                  </p>
                </div>
                <button
                  class="text-cream-500 hover:text-gold transition-colors duration-500 p-1"
                  @click="handleClose"
                  aria-label="Fermer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Step: Email -->
              <div v-if="step === 'email'">
                <p class="font-body text-cream-500 mb-6 text-sm leading-relaxed">
                  Pour confirmer votre vote, veuillez entrer votre adresse email. Nous vous enverrons un code de vérification.
                </p>
                <form @submit.prevent="handleEmailSubmit">
                  <label class="block mb-2 font-title text-xs tracking-widest uppercase text-cream-400">
                    Adresse email
                  </label>
                  <input
                    v-model="email"
                    type="email"
                    class="input mb-4"
                    placeholder="votre@email.com"
                    required
                    :disabled="isSubmitting"
                  >
                  <p v-if="errorMessage" class="text-red-400 text-sm mb-4 font-body">
                    {{ errorMessage }}
                  </p>
                  <button
                    type="submit"
                    class="btn btn-gold w-full"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="flex items-center gap-2">
                      <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Envoi en cours...
                    </span>
                    <span v-else>Recevoir le code</span>
                  </button>
                </form>
              </div>

              <!-- Step: OTP -->
              <div v-else-if="step === 'otp'">
                <p class="font-body text-cream-500 mb-6 text-sm leading-relaxed">
                  Un code de vérification a été envoyé à <strong class="text-gold">{{ email }}</strong>. 
                  Entrez-le ci-dessous pour confirmer votre vote.
                </p>
                <form @submit.prevent="handleOtpSubmit">
                  <label class="block mb-2 font-title text-xs tracking-widest uppercase text-cream-400">
                    Code de vérification
                  </label>
                  <input
                    :value="otpCode"
                    type="text"
                    inputmode="numeric"
                    class="input mb-4 text-center text-2xl tracking-[0.5em] font-title"
                    placeholder="000000"
                    maxlength="6"
                    required
                    :disabled="isSubmitting"
                    @input="handleOtpInput"
                  >
                  <p v-if="errorMessage" class="text-red-400 text-sm mb-4 font-body">
                    {{ errorMessage }}
                  </p>
                  <button
                    type="submit"
                    class="btn btn-gold w-full"
                    :disabled="isSubmitting || otpCode.length !== 6"
                  >
                    <span v-if="isSubmitting" class="flex items-center gap-2">
                      <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Vérification...
                    </span>
                    <span v-else>Confirmer mon vote</span>
                  </button>
                  <button
                    type="button"
                    class="w-full mt-3 text-cream-500 hover:text-gold text-sm font-body transition-colors duration-500"
                    @click="step = 'email'"
                  >
                    ← Modifier l'email
                  </button>
                </form>
              </div>

              <!-- Step: Success -->
              <div v-else-if="step === 'success'" class="text-center py-4">
                <div class="w-16 h-16 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 class="font-title font-light text-lg text-cream-100 mb-2 tracking-wide">
                  Merci pour votre vote
                </h4>
                <p class="font-body text-cream-500 text-sm mb-4">
                  Votre vote pour <strong class="text-gold">{{ nominee?.name }}</strong> a bien été enregistré.
                </p>
              </div>

              <!-- Step: Already Voted -->
              <div v-else-if="step === 'already-voted'" class="text-center py-4">
                <div class="w-16 h-16 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="font-title font-light text-lg text-cream-100 mb-2 tracking-wide">
                  Vous avez déjà voté
                </h4>
                <p class="font-body text-cream-500 text-sm mb-4">
                  Vous avez déjà voté dans la catégorie <strong class="text-gold">{{ categoryName }}</strong> avec cette adresse email.
                </p>
                <button
                  class="btn btn-outline"
                  @click="handleClose"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
