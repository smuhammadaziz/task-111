import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store'
import { type ClientStatus, fetchClients, updateClientStatus } from '../store/clientsSlice'

function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.clients)

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchClients())
    }
  }, [dispatch, items.length])

  const client = items.find((c) => c.id === id)

  useEffect(() => {
    if (!loading && !error && items.length > 0 && !client) {
      navigate('/', { replace: true })
    }
  }, [client, error, items.length, loading, navigate])

  const handleStatusChange = (status: ClientStatus) => {
    if (!client) return
    dispatch(updateClientStatus({ id: client.id, status }))
  }

  if (loading && !client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        Loading client…
      </div>
    )
  }

  if (error && !client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        {error}
      </div>
    )
  }

  if (!client) return null

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold">{client.companyName}</h1>
            <p className="text-sm text-slate-400">Client details and connected objects.</p>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1.5fr]">
          <section className="space-y-4 rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-200">Subscription</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Plan</p>
                <p className="font-medium text-slate-100">{client.subscriptionPlan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Monthly price</p>
                <p className="font-medium text-slate-100">
                  ${client.monthlyPrice.toLocaleString('en-US')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Connected date</p>
                <p className="font-medium text-slate-100">
                  {new Date(client.connectedDate).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    client.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40'
                      : 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40'
                  }`}
                >
                  {client.status}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-300">Change status</p>
              <div className="mt-2 inline-flex rounded-lg bg-slate-900 p-1 ring-1 ring-slate-700">
                <button
                  onClick={() => handleStatusChange('active')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    client.status === 'active'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleStatusChange('paused')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    client.status === 'paused'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Paused
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-200">
              Connected objects ({client.objects.length})
            </h2>
            {client.objects.length === 0 ? (
              <p className="text-sm text-slate-400">No objects connected yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {client.objects.map((obj) => (
                  <li
                    key={obj.id}
                    className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{obj.name}</p>
                      <p className="text-xs text-slate-500">{obj.type}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                      #{obj.id}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default ClientDetailPage


