import { categories, getVoteCountByCategory, votes } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { password } = query

  // Simple password protection
  const config = useRuntimeConfig()
  if (password !== config.adminPassword) {
    throw createError({
      statusCode: 401,
      message: 'Mot de passe incorrect.',
    })
  }

  // Build results data
  const results = categories.map((category) => {
    const voteCounts = getVoteCountByCategory(category.id)
    const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)

    const nomineesWithVotes = category.nominees.map((nominee) => ({
      id: nominee.id,
      name: nominee.name,
      imageUrl: nominee.imageUrl,
      votes: voteCounts[nominee.id] || 0,
      percentage: totalVotes > 0 ? ((voteCounts[nominee.id] || 0) / totalVotes * 100).toFixed(1) : '0',
    })).sort((a, b) => b.votes - a.votes)

    return {
      id: category.id,
      name: category.name,
      totalVotes,
      nominees: nomineesWithVotes,
    }
  })

  // Overall stats
  const stats = {
    totalVotes: votes.length,
    uniqueVoters: new Set(votes.map(v => v.email)).size,
    categoriesCount: categories.length,
    lastVoteAt: votes.length > 0 
      ? votes.reduce((latest, v) => v.votedAt > latest ? v.votedAt : latest, votes[0].votedAt)
      : null,
  }

  return {
    success: true,
    stats,
    results,
  }
})
