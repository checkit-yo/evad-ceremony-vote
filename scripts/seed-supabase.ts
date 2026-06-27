/**
 * Seed initial Supabase data : 10 catégories + leurs nominés.
 *
 * Usage : pnpm seed
 *   (équivalent : node --env-file=.env --import tsx scripts/seed-supabase.ts)
 *
 * Idempotent — utilise les contraintes UNIQUE (slug, et lower(name) par catégorie).
 * Variables d'env requises : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('✗ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// Sample dance-related YouTube videos for categories
const YOUTUBE_URLS = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=JGwWNGJdvx8',
  'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
  'https://www.youtube.com/watch?v=RgKAFK5djSk',
  'https://www.youtube.com/watch?v=OPf0YbXqDm0',
  'https://www.youtube.com/watch?v=fRh_vgS2dFE',
  'https://www.youtube.com/watch?v=09R8_2nJtjg',
  'https://www.youtube.com/watch?v=YQHsXMglC9A',
  'https://www.youtube.com/watch?v=hT_nvWreIhg',
]

const CATEGORIES = [
  { slug: 'best-dancer', name: 'Meilleur Danseur', description: 'Récompense le danseur qui a marqué l\'année par sa technique, son charisme et son influence sur la scène.', count: 16, youtube_url: YOUTUBE_URLS[0] },
  { slug: 'best-female-dancer', name: 'Meilleure Danseuse', description: 'Célèbre la danseuse qui s\'est distinguée par son talent exceptionnel et sa présence artistique.', count: 16, youtube_url: YOUTUBE_URLS[1] },
  { slug: 'best-freestyler', name: 'Meilleur Freestyler', description: 'Honore l\'artiste dont l\'improvisation et la créativité ont captivé le public cette année.', count: 12, youtube_url: YOUTUBE_URLS[2] },
  { slug: 'best-choreographer', name: 'Meilleur Chorégraphe', description: 'Distingue le chorégraphe dont les créations ont inspiré et innové dans l\'art de la danse.', count: 10, youtube_url: YOUTUBE_URLS[3] },
  { slug: 'best-crew', name: 'Meilleur Crew', description: 'Récompense le groupe qui a démontré une cohésion exceptionnelle et des performances mémorables.', count: 12, youtube_url: YOUTUBE_URLS[4] },
  { slug: 'best-young-talent', name: 'Meilleur Espoir', description: 'Met en lumière la nouvelle génération de danseurs prometteurs qui façonnent l\'avenir de la danse.', count: 16, youtube_url: YOUTUBE_URLS[5] },
  { slug: 'best-volunteer', name: 'Meilleur Bénévole', description: 'Rend hommage à ceux qui donnent de leur temps et énergie pour faire vivre notre communauté.', count: 10, youtube_url: YOUTUBE_URLS[6] },
  { slug: 'best-event', name: 'Meilleur Événement', description: 'Célèbre l\'événement qui a marqué l\'année par son organisation, son ambiance et son impact.', count: 8, youtube_url: YOUTUBE_URLS[7] },
  { slug: 'best-battle', name: 'Meilleur Battle', description: 'Distingue la compétition qui a offert les moments les plus intenses et mémorables.', count: 8, youtube_url: YOUTUBE_URLS[8] },
]

const FIRST_NAMES = ['Alexandre', 'Marie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Nathan', 'Chloé', 'Gabriel', 'Manon', 'Louis', 'Camille', 'Raphaël', 'Jade', 'Arthur', 'Louise']
const LAST_NAMES = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David']
const DESCRIPTIONS = [
  'Une énergie débordante et un style unique qui ne laisse personne indifférent. Sa passion pour la danse transparaît dans chaque mouvement.',
  'Reconnu(e) pour sa technique impeccable et son interprétation émotionnelle. Un(e) artiste complet(e) qui repousse constamment ses limites.',
  'Innovateur(trice) dans l\'âme, toujours à la recherche de nouvelles formes d\'expression. Son influence sur la scène est indéniable.',
  'Alliant grâce et puissance, sa présence scénique captive instantanément le public. Un talent rare et précieux.',
  'Ambassadeur(trice) de la culture street dance, son parcours inspire toute une génération de danseurs.',
  'Sa créativité sans bornes et son dévouement à l\'art font de lui/elle un pilier de notre communauté.',
]

function buildNominees(slug: string, count: number) {
  const isGroup = slug === 'best-crew' || slug === 'best-event' || slug === 'best-battle'
  return Array.from({ length: count }, (_, index) => {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length]
    const lastName = LAST_NAMES[(index + 3) % LAST_NAMES.length]
    const name = isGroup ? `${firstName} Crew ${index + 1}` : `${firstName} ${lastName}`
    return {
      name,
      description: DESCRIPTIONS[index % DESCRIPTIONS.length],
      image_url: `https://picsum.photos/seed/${slug}-${index}/400/400`,
      display_order: index,
    }
  })
}

async function main() {
  console.log('→ Seeding categories…')
  let categoryInserts = 0
  const slugToId = new Map<string, string>()

  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i]
    const { data, error } = await supabase
      .from('categories')
      .upsert(
        {
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          youtube_url: cat.youtube_url,
          display_order: i,
        },
        { onConflict: 'slug' },
      )
      .select('id, slug')
      .single()
    if (error) {
      console.error(`  ✗ ${cat.slug}: ${error.message}`)
      process.exit(1)
    }
    slugToId.set(data.slug, data.id)
    categoryInserts++
  }
  console.log(`  ✓ ${categoryInserts} catégories upsertées`)

  console.log('→ Seeding nominees…')
  let nomineeInserts = 0
  for (const cat of CATEGORIES) {
    const categoryId = slugToId.get(cat.slug)!
    const nominees = buildNominees(cat.slug, cat.count).map(n => ({
      ...n,
      category_id: categoryId,
    }))
    const { error } = await supabase
      .from('nominees')
      .upsert(nominees, { onConflict: 'category_id,name', ignoreDuplicates: false })
    if (error) {
      console.error(`  ✗ ${cat.slug}: ${error.message}`)
      process.exit(1)
    }
    nomineeInserts += nominees.length
  }
  console.log(`  ✓ ${nomineeInserts} nominés upsertés`)
  console.log('\n✓ Seed terminé.')
}

main().catch(err => {
  console.error('✗ Erreur seed:', err)
  process.exit(1)
})
