import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store'
import { fetchClients, setSearch, setStatusFilter, setSort, updateClientStatus } from '../store/clientsSlice'
import { logout } from '../store/authSlice'

function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error, search, statusFilter, sortKey, sortDirection } = useSelector(
    (state: RootState) => state.clients
  )
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchClients())
    }
  }, [dispatch, items.length])

  const filtered = items
    .filter((c) => (statusFilter === 'all' ? true : c.status === statusFilter))
    .filter((c) => c.companyName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1
      if (sortKey === 'monthlyPrice') {
        return (a.monthlyPrice - b.monthlyPrice) * dir
      }
      return (new Date(a.connectedDate).getTime() - new Date(b.connectedDate).getTime()) * dir
    })

  const handlePauseToggle = (id: string, current: 'active' | 'paused') => {
    dispatch(updateClientStatus({ id, status: current === 'active' ? 'paused' : 'active' }))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">B2B Clients</h1>
          <p className="text-sm text-slate-400">Manage company subscriptions and connected objects.</p>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-right">
              <p className="text-sm font-medium text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800">
        <input
          type="text"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Search by company name…"
          className="flex-1 min-w-[200px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        <select
          value={statusFilter}
          onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setSort({ key: 'connectedDate' }))}
            className={`rounded-lg px-3 py-2 text-xs font-medium ring-1 ring-slate-700 ${
              sortKey === 'connectedDate' ? 'bg-slate-800 text-indigo-300' : 'bg-slate-900 text-slate-200'
            }`}
          >
            Date {sortKey === 'connectedDate' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => dispatch(setSort({ key: 'monthlyPrice' }))}
            className={`rounded-lg px-3 py-2 text-xs font-medium ring-1 ring-slate-700 ${
              sortKey === 'monthlyPrice' ? 'bg-slate-800 text-indigo-300' : 'bg-slate-900 text-slate-200'
            }`}
          >
            Price {sortKey === 'monthlyPrice' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </section>

      <section className="rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800">
        {loading && <p className="text-sm text-slate-400">Loading clients…</p>}
        {error && !loading && <p className="text-sm text-red-400">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-slate-400">No clients found. Try adjusting filters or search.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 text-left">Company</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Plan</th>
                  <th className="py-2 text-right">Monthly</th>
                  <th className="py-2 text-left">Connected</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id} className="border-b border-slate-800/60 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-100">{client.companyName}</p>
                      <p className="text-xs text-slate-500">{client.subscriptionPlan}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          client.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40'
                            : 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40'
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-200">{client.subscriptionPlan}</td>
                    <td className="py-3 pr-4 text-right text-slate-100">
                      ${client.monthlyPrice.toLocaleString('en-US')}
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      {new Date(client.connectedDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/clients/${client.id}`}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handlePauseToggle(client.id, client.status)}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700"
                        >
                          {client.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardPage


