export interface Nominee {
  id: string
  name: string
  description: string
  imageUrl: string
  youtubeVideoId: string
  categoryId: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  nominees: Nominee[]
}

export interface VoteRecord {
  nomineeId: string
  categoryId: string
  email: string
  votedAt: Date
}

// Mock categories for the Evad Ceremony
export const categories: Category[] = [
  {
    id: 'best-dancer',
    slug: 'best-dancer',
    name: 'Meilleur Danseur',
    description: 'Récompense le danseur qui a marqué l\'année par sa technique, son charisme et son influence sur la scène.',
    nominees: generateNominees('best-dancer', 16),
  },
  {
    id: 'best-female-dancer',
    slug: 'best-female-dancer',
    name: 'Meilleure Danseuse',
    description: 'Célèbre la danseuse qui s\'est distinguée par son talent exceptionnel et sa présence artistique.',
    nominees: generateNominees('best-female-dancer', 16),
  },
  {
    id: 'best-freestyler',
    slug: 'best-freestyler',
    name: 'Meilleur Freestyler',
    description: 'Honore l\'artiste dont l\'improvisation et la créativité ont captivé le public cette année.',
    nominees: generateNominees('best-freestyler', 12),
  },
  {
    id: 'best-choreographer',
    slug: 'best-choreographer',
    name: 'Meilleur Chorégraphe',
    description: 'Distingue le chorégraphe dont les créations ont inspiré et innové dans l\'art de la danse.',
    nominees: generateNominees('best-choreographer', 10),
  },
  {
    id: 'best-crew',
    slug: 'best-crew',
    name: 'Meilleur Crew',
    description: 'Récompense le groupe qui a démontré une cohésion exceptionnelle et des performances mémorables.',
    nominees: generateNominees('best-crew', 12),
  },
  {
    id: 'best-young-talent',
    slug: 'best-young-talent',
    name: 'Meilleur Espoir',
    description: 'Met en lumière la nouvelle génération de danseurs prometteurs qui façonnent l\'avenir de la danse.',
    nominees: generateNominees('best-young-talent', 16),
  },
  {
    id: 'best-volunteer',
    slug: 'best-volunteer',
    name: 'Meilleur Bénévole',
    description: 'Rend hommage à ceux qui donnent de leur temps et énergie pour faire vivre notre communauté.',
    nominees: generateNominees('best-volunteer', 10),
  },
  {
    id: 'best-event',
    slug: 'best-event',
    name: 'Meilleur Événement',
    description: 'Célèbre l\'événement qui a marqué l\'année par son organisation, son ambiance et son impact.',
    nominees: generateNominees('best-event', 8),
  },
  {
    id: 'best-battle',
    slug: 'best-battle',
    name: 'Meilleur Battle',
    description: 'Distingue la compétition qui a offert les moments les plus intenses et mémorables.',
    nominees: generateNominees('best-battle', 8),
  },
  {
    id: 'lifetime-achievement',
    slug: 'lifetime-achievement',
    name: 'Légende de la Danse',
    description: 'Honore une personnalité dont la carrière et l\'influence ont marqué durablement l\'histoire de la danse.',
    nominees: generateNominees('lifetime-achievement', 6),
  },
]

// Generate mock nominees for a category
function generateNominees(categoryId: string, count: number): Nominee[] {
  const firstNames = ['Alexandre', 'Marie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Nathan', 'Chloé', 'Gabriel', 'Manon', 'Louis', 'Camille', 'Raphaël', 'Jade', 'Arthur', 'Louise']
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David']
  
  const descriptions = [
    'Une énergie débordante et un style unique qui ne laisse personne indifférent. Sa passion pour la danse transparaît dans chaque mouvement.',
    'Reconnu(e) pour sa technique impeccable et son interprétation émotionnelle. Un(e) artiste complet(e) qui repousse constamment ses limites.',
    'Innovateur(trice) dans l\'âme, toujours à la recherche de nouvelles formes d\'expression. Son influence sur la scène est indéniable.',
    'Alliant grâce et puissance, sa présence scénique captive instantanément le public. Un talent rare et précieux.',
    'Ambassadeur(trice) de la culture street dance, son parcours inspire toute une génération de danseurs.',
    'Sa créativité sans bornes et son dévouement à l\'art font de lui/elle un pilier de notre communauté.',
  ]

  // Mock YouTube video IDs (real dance videos for demo purposes)
  const youtubeIds = ['dQw4w9WgXcQ', 'JGwWNGJdvx8', 'kJQP7kiw5Fk', 'RgKAFK5djSk', '09R8_2nJtjg', 'hT_nvWreIhg']

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length]
    const lastName = lastNames[(index + 3) % lastNames.length]
    const name = categoryId === 'best-crew' || categoryId === 'best-event' || categoryId === 'best-battle'
      ? `${firstName} Crew ${index + 1}`
      : `${firstName} ${lastName}`

    return {
      id: `${categoryId}-nominee-${index + 1}`,
      name,
      description: descriptions[index % descriptions.length],
      imageUrl: `https://picsum.photos/seed/${categoryId}-${index}/400/400`,
      youtubeVideoId: youtubeIds[index % youtubeIds.length],
      categoryId,
    }
  })
}

// In-memory vote storage (mock database)
export const votes: VoteRecord[] = []

// Mock OTP storage
export const otpStore: Map<string, { code: string, nomineeId: string, categoryId: string, expiresAt: Date }> = new Map()

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getNomineeById(nomineeId: string): Nominee | undefined {
  for (const category of categories) {
    const nominee = category.nominees.find(n => n.id === nomineeId)
    if (nominee) return nominee
  }
  return undefined
}

export function hasVoted(email: string, categoryId: string): boolean {
  return votes.some(v => v.email === email && v.categoryId === categoryId)
}

export function getVoteCountByNominee(nomineeId: string): number {
  return votes.filter(v => v.nomineeId === nomineeId).length
}

export function getVoteCountByCategory(categoryId: string): Record<string, number> {
  const categoryVotes = votes.filter(v => v.categoryId === categoryId)
  const counts: Record<string, number> = {}
  
  for (const vote of categoryVotes) {
    counts[vote.nomineeId] = (counts[vote.nomineeId] || 0) + 1
  }
  
  return counts
}

// Generate some initial mock votes for demo
export function seedMockVotes() {
  const mockEmails = Array.from({ length: 50 }, (_, i) => `voter${i + 1}@example.com`)
  
  for (const category of categories) {
    for (const email of mockEmails.slice(0, Math.floor(Math.random() * 30) + 10)) {
      const randomNominee = category.nominees[Math.floor(Math.random() * category.nominees.length)]
      if (!hasVoted(email, category.id)) {
        votes.push({
          nomineeId: randomNominee.id,
          categoryId: category.id,
          email,
          votedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        })
      }
    }
  }
}

// Seed votes on module load
seedMockVotes()
