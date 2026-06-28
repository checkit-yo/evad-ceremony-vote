import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()

  // 1) Compteurs par (catégorie, nommé) via RPC
  const { data: counts, error: countsErr } = await supabase.rpc('get_vote_counts')
  if (countsErr) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (counts) : ${countsErr.message}` })
  }
  const countMap = new Map<string, Map<string, number>>()
  for (const row of (counts ?? []) as Array<{ category_id: string, nominee_id: string, vote_count: number }>) {
    if (!countMap.has(row.category_id)) countMap.set(row.category_id, new Map())
    countMap.get(row.category_id)!.set(row.nominee_id, Number(row.vote_count))
  }

  // 2) Catégories + nommés
  const { data: categories, error: catsErr } = await supabase
    .from('categories')
    .select('id, slug, name, description, display_order')
    .order('display_order', { ascending: true })
  if (catsErr) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (categories) : ${catsErr.message}` })
  }

  const { data: nominees, error: nomErr } = await supabase
    .from('nominees')
    .select('id, category_id, name, image_url, display_order')
    .order('display_order', { ascending: true })
  if (nomErr) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (nominees) : ${nomErr.message}` })
  }

  const nomineesByCategory = new Map<string, Array<{ id: string, name: string, image_url: string | null }>>()
  for (const n of (nominees ?? [])) {
    if (!nomineesByCategory.has(n.category_id)) nomineesByCategory.set(n.category_id, [])
    nomineesByCategory.get(n.category_id)!.push({ id: n.id, name: n.name, image_url: n.image_url })
  }

  // 3) Stats globales
  const { count: totalVotes, error: totErr } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
  if (totErr) {
    throw createError({ statusCode: 500, statusMessage: `Erreur DB (totalVotes) : ${totErr.message}` })
  }

  const { data: lastVote } = await supabase
    .from('votes')
    .select('voted_at')
    .order('voted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: uniqueRows } = await supabase
    .from('votes')
    .select('email')
  const uniqueVoters = new Set((uniqueRows ?? []).map(r => r.email)).size

  // 4) Construction du payload
  const results = (categories ?? []).map((cat) => {
    const cMap = countMap.get(cat.id) ?? new Map<string, number>()
    const catNominees = nomineesByCategory.get(cat.id) ?? []
    const catTotal = catNominees.reduce((sum, n) => sum + (cMap.get(n.id) ?? 0), 0)
    const nomineesWithVotes = catNominees
      .map((n) => {
        const votes = cMap.get(n.id) ?? 0
        return {
          id: n.id,
          name: n.name,
          imageUrl: n.image_url,
          votes,
          percentage: catTotal > 0 ? ((votes / catTotal) * 100).toFixed(1) : '0',
        }
      })
      .sort((a, b) => b.votes - a.votes)

    return {
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      totalVotes: catTotal,
      nominees: nomineesWithVotes,
    }
  })

  return {
    success: true,
    stats: {
      totalVotes: totalVotes ?? 0,
      uniqueVoters,
      categoriesCount: (categories ?? []).length,
      lastVoteAt: lastVote?.voted_at ?? null,
    },
    results,
  }
})
