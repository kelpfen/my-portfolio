import { useEffect, useState } from 'react'

const fifaMatches = [
  { home: 'Mexico', guest: 'South Africa', homeScore: 2, guestScore: 0, time: 'Jun 12, 2026, 3:00 AM MYT', status: 'Final' },
  { home: 'Canada', guest: 'Bosnia and Herzegovina', homeScore: 1, guestScore: 1, time: 'Jun 13, 2026, 3:00 AM MYT', status: 'Final' },
  { home: 'USA', guest: 'Paraguay', homeScore: 4, guestScore: 1, time: 'Jun 13, 2026, 8:00 AM MYT', status: 'Final' },

]

const footballDataToken = import.meta.env.VITE_FOOTBALL_DATA_TOKEN
const footballDataUrl = '/api-football/competitions/WC/matches?season=2026'

const malaysiaTimeFormatter = new Intl.DateTimeFormat('en-MY', {
  timeZone: 'Asia/Kuala_Lumpur',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZoneName: 'short',
})

const getMatchStatus = (status) => {
  if (status === 'FINISHED') return 'Final'
  if (['IN_PLAY', 'LIVE', 'PAUSED'].includes(status)) return 'Current'
  return 'Scheduled'
}

const getScoreValue = (score, side) => (
  score?.fullTime?.[side] ??
  score?.regularTime?.[side] ??
  score?.halfTime?.[side] ??
  null
)

const mapFootballDataMatch = (match) => ({
  home: match.homeTeam?.shortName || match.homeTeam?.name || 'TBD',
  guest: match.awayTeam?.shortName || match.awayTeam?.name || 'TBD',
  homeScore: getScoreValue(match.score, 'home'),
  guestScore: getScoreValue(match.score, 'away'),
  time: malaysiaTimeFormatter.format(new Date(match.utcDate)),
  rawUtcDate: match.utcDate,
  status: getMatchStatus(match.status),
})

const themeStyles = {
  light: {
    page: 'bg-slate-50 text-slate-950 selection:bg-teal-200 selection:text-slate-950',
    header: 'bg-white/80 border-slate-200/80',
    panel: 'border-slate-200 bg-white/80',
    inactiveControl: 'text-slate-500 hover:text-slate-950',
    sectionText: 'text-slate-600',
    card: 'bg-white/80 border-slate-200 hover:border-teal-400/70 shadow-slate-200/80',
    mutedText: 'text-slate-600',
    tag: 'bg-slate-100 text-slate-700',
    footer: 'border-slate-200 bg-white',
    footerText: 'text-slate-500',
  },
  dark: {
    page: 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-900',
    header: 'bg-slate-950/70 border-slate-800/50',
    panel: 'border-slate-800 bg-slate-900/70',
    inactiveControl: 'text-slate-400 hover:text-slate-100',
    sectionText: 'text-slate-400',
    card: 'bg-slate-900/50 border-slate-800/60 hover:border-teal-500/40 shadow-slate-950/40',
    mutedText: 'text-slate-400',
    tag: 'bg-slate-800 text-slate-300',
    footer: 'border-slate-900 bg-slate-950',
    footerText: 'text-slate-500',
  },
}

const filterOptions = [
  { key: 'all', label: 'All Matches' },
  { key: 'matched', label: 'Matched' },
  { key: 'upcoming', label: 'Upcoming / Live' },
  { key: 'favorites', label: 'Favorites ⭐' },
]

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [matches, setMatches] = useState(fifaMatches)
  const [matchDataStatus, setMatchDataStatus] = useState(footballDataToken ? 'Loading live data...' : 'Showing sample data')
  const [filterStatus, setFilterStatus] = useState('all')

  // 💾 Enhanced Initialization: Grab stored items from LocalStorage on mount
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('fifa_report_favorites')
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })

  const colors = themeStyles[theme]
  const finalMatches = matches.filter((match) => match.status === 'Final').length
  const activeMatches = matches.length - finalMatches

  // 💾 Side-Effect Syncing: Write changes straight to LocalStorage whenever favorites array mutates
  useEffect(() => {
    localStorage.setItem('fifa_report_favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (match) => {
    const matchId = `${match.home}-${match.guest}-${match.time}`
    setFavorites((prevFavs) =>
      prevFavs.includes(matchId)
        ? prevFavs.filter((id) => id !== matchId)
        : [...prevFavs, matchId]
    )
  }

  const sendToGoogleCalendar = (match) => {
    const title = encodeURIComponent(`🏆 FIFA 2026: ${match.home} vs ${match.guest}`)
    const details = encodeURIComponent(`Live Match tracked by FIFA.report.\nTime: ${match.time}`)

    const startTime = match.rawUtcDate
      ? new Date(match.rawUtcDate).toISOString().replace(/-|:|\.\d\d\d/g, "")
      : new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")

    const endTimeDate = match.rawUtcDate ? new Date(match.rawUtcDate) : new Date()
    endTimeDate.setHours(endTimeDate.getHours() + 2)
    const endTime = endTimeDate.toISOString().replace(/-|:|\.\d\d\d/g, "")

    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&sf=true&output=xml`
    window.open(gCalUrl, '_blank')
  }

  const filteredMatches = matches.filter((match) => {
    const matchId = `${match.home}-${match.guest}-${match.time}`
    if (filterStatus === 'matched') return match.status === 'Final'
    if (filterStatus === 'upcoming') return match.status === 'Scheduled' || match.status === 'Current'
    if (filterStatus === 'favorites') return favorites.includes(matchId)
    return true
  })

  const formatScore = (match) => (
    match.homeScore === null || match.guestScore === null
      ? 'TBD vs TBD'
      : `${match.homeScore} vs ${match.guestScore}`
  )

  useEffect(() => {
    if (!footballDataToken) return

    const controller = new AbortController()

    const loadMatches = async () => {
      try {
        const response = await fetch(footballDataUrl, {
          headers: { 'X-Auth-Token': footballDataToken },
          signal: controller.signal,
        })

        if (!response.ok) throw new Error(`football-data.org status: ${response.status}`)

        const data = await response.json()
        const apiMatches = [...(data.matches ?? [])]
          .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
          .map(mapFootballDataMatch)

        if (apiMatches.length > 0) {
          setMatches(apiMatches)
          setMatchDataStatus('Live data from football-data.org')
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        setMatchDataStatus('Live API unavailable - showing sample data')
      }
    }

    loadMatches()
    return () => controller.abort()
  }, [])

  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const showActionsColumn = filterStatus === 'favorites'

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 flex flex-col justify-between ${colors.page}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${colors.header}`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <span className="font-bold text-teal-500 tracking-tight text-lg">FIFA.report</span>
          <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${colors.panel} ${colors.inactiveControl}`}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 flex-grow w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">FIFA 2026 Match Report</h1>
          <p className={colors.sectionText}>Previous and current FIFA World Cup 2026 matches in the requested sequence.</p>
          <p className="text-xs font-semibold text-teal-500">{matchDataStatus}</p>
        </div>

        {/* Status Cards */}
        <div className="grid sm:grid-cols-4  gap-4">
          <button onClick={() => setFilterStatus('all')} className={`text-left block rounded-lg border p-5 transition-all active:scale-98 ${colors.panel} ${filterStatus === 'all' ? 'border-teal-500 ring-1 ring-teal-500' : ''}`}>
            <p className={`text-xs font-semibold uppercase ${colors.mutedText}`}>Matches tracked</p>
            <p className="mt-2 text-3xl font-bold text-teal-500">{matches.length}</p>
          </button>
          <button onClick={() => setFilterStatus('matched')} className={`text-left block rounded-lg border p-5 transition-all active:scale-98 ${colors.panel} ${filterStatus === 'matched' ? 'border-teal-500 ring-1 ring-teal-500' : ''}`}>
            <p className={`text-xs font-semibold uppercase ${colors.mutedText}`}>Final results</p>
            <p className="mt-2 text-3xl font-bold text-teal-500">{finalMatches}</p>
          </button>
          <button onClick={() => setFilterStatus('upcoming')} className={`text-left block rounded-lg border p-5 transition-all active:scale-98 ${colors.panel} ${filterStatus === 'upcoming' ? 'border-teal-500 ring-1 ring-teal-500' : ''}`}>
            <p className={`text-xs font-semibold uppercase ${colors.mutedText}`}>Current / scheduled</p>
            <p className="mt-2 text-3xl font-bold text-teal-500">{activeMatches}</p>
          </button>
          <button onClick={() => setFilterStatus('favorites')} className={`text-left block rounded-lg border p-5 transition-all active:scale-98 ${colors.panel} ${filterStatus === 'favorites' ? 'border-teal-500 ring-1 ring-teal-500' : ''}`}>
            <p className={`text-xs font-semibold uppercase ${colors.mutedText}`}>Favorites</p>
            <p className="mt-2 text-3xl font-bold text-teal-500">{favorites.length}</p>
          </button>
        </div>

        {/* Dynamic Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-start gap-2 border-b border-slate-700/20 pb-1">
          {filterOptions.map((opt) => {
            const isFavTab = opt.key === 'favorites'
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFilterStatus(opt.key)}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all uppercase ${filterStatus === opt.key
                    ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                    : isFavTab && favorites.length > 0
                      ? 'text-teal-400 border border-teal-500/30 hover:bg-teal-500/10'
                      : `${colors.inactiveControl} hover:bg-slate-500/10`
                  }`}
              >
                {opt.label}
                {isFavTab && favorites.length > 0 && ` (${favorites.length})`}
              </button>
            )
          })}
        </div>

        {/* Matches Table */}
        <div className={`overflow-hidden rounded-lg border shadow-xl ${colors.card}`}>
          <div className={`hidden md:grid gap-4 border-b px-5 py-3 text-xs font-bold uppercase ${colors.mutedText} ${showActionsColumn
              ? 'grid-cols-[1.3fr_0.9fr_1.1fr_0.5fr_0.3fr_0.7fr]'
              : 'grid-cols-[1.5fr_1fr_1fr_0.7fr_0.3fr]'
            }`}>
            <span>Home vs Guest</span>
            <span>Home score vs Guest score</span>
            <span>Date & time</span>
            <span>Status</span>
            <span className="text-center">Fav</span>
            {showActionsColumn && <span className="text-right">Actions</span>}
          </div>

          <div className="divide-y divide-slate-700/30">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => {
                const matchId = `${match.home}-${match.guest}-${match.time}`
                const isFav = favorites.includes(matchId)
                const canFavorite = match.status !== 'Final'

                return (
                  <div key={matchId} className={`grid gap-3 px-5 py-4 md:items-center ${showActionsColumn
                      ? 'md:grid-cols-[1.3fr_0.9fr_1.1fr_0.5fr_0.3fr_0.7fr]'
                      : 'md:grid-cols-[1.5fr_1fr_1fr_0.7fr_0.3fr]'
                    }`}>
                    <div>
                      <p className={`md:hidden text-[11px] font-bold uppercase ${colors.mutedText}`}>Home vs Guest</p>
                      <p className="font-semibold">{match.home} vs {match.guest}</p>
                    </div>
                    <div>
                      <p className={`md:hidden text-[11px] font-bold uppercase ${colors.mutedText}`}>Home score vs Guest score</p>
                      <p className="font-mono text-lg font-bold text-teal-500">{formatScore(match)}</p>
                    </div>
                    <div>
                      <p className={`md:hidden text-[11px] font-bold uppercase ${colors.mutedText}`}>Date & time</p>
                      <p className={`text-sm ${colors.mutedText}`}>{match.time}</p>
                    </div>
                    <div>
                      <p className={`md:hidden text-[11px] font-bold uppercase ${colors.mutedText}`}>Status</p>
                      <span className={`w-fit rounded px-2.5 py-1 text-xs font-semibold block ${match.status === 'Final' ? colors.tag : 'bg-teal-500/10 text-teal-500'
                        }`}>
                        {match.status}
                      </span>
                    </div>
                    {/* Star Favorite Mechanism */}
                    <div className="flex md:justify-center items-center">
                      {canFavorite ? (
                        <button
                          type="button"
                          onClick={() => toggleFavorite(match)}
                          className={`p-1 rounded text-lg transition-transform active:scale-90 ${isFav ? 'text-yellow-400 hover:text-yellow-500' : 'text-slate-400 hover:text-yellow-400'
                            }`}
                        >
                          {isFav ? '★' : '☆'}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 select-none md:block hidden">-</span>
                      )}
                    </div>

                    {/* Synchronized Action Panel Option */}
                    {showActionsColumn && (
                      <div className="flex md:justify-end items-center">
                        <button
                          type="button"
                          onClick={() => sendToGoogleCalendar(match)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded border border-teal-500/40 bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-slate-950 transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
                        >
                          <span>🗓️</span>
                          <span>Sync Cal</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className={`px-5 py-12 text-center text-sm ${colors.mutedText}`}>
                {filterStatus === 'favorites'
                  ? 'Your favorites list is empty. Click ☆ on upcoming matches to add.'
                  : 'No matches found for this filter.'}
              </div>
            )}
          </div>
        </div>

        <p className={`text-xs ${colors.mutedText}`}>Times are shown in UTC+8 (Malaysia time). Live data loads from football-data.org when a token is available.</p>
      </main>

      <footer className={`border-t mt-12 transition-colors duration-300 ${colors.footer}`}>
        <div className={`max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${colors.footerText}`}>
          <p>© 2026 FIFA World Cup Portal. Powered by React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}