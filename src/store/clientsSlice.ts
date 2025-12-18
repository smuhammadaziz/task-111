import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ClientStatus = 'active' | 'paused'

export type ClientObject = {
  id: string
  type: string
  name: string
}

export type Client = {
  id: string
  companyName: string
  status: ClientStatus
  subscriptionPlan: string
  monthlyPrice: number
  connectedDate: string
  objects: ClientObject[]
}

type SortKey = 'connectedDate' | 'monthlyPrice'
type SortDirection = 'asc' | 'desc'

export type ClientsState = {
  items: Client[]
  loading: boolean
  error: string | null
  search: string
  statusFilter: ClientStatus | 'all'
  sortKey: SortKey
  sortDirection: SortDirection
}

const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
  search: '',
  statusFilter: 'all',
  sortKey: 'connectedDate',
  sortDirection: 'desc',
}

export const fetchClients = createAsyncThunk<Client[]>(
  'clients/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/data.json')
      if (!res.ok) {
        throw new Error('Failed to load mock data')
      }
      const data = (await res.json()) as { clients: Client[] }
      return data.clients
    } catch {
      return rejectWithValue('Failed to fetch clients') as unknown as Client[]
    }
  }
)

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setStatusFilter(state, action: PayloadAction<ClientsState['statusFilter']>) {
      state.statusFilter = action.payload
    },
    setSort(state, action: PayloadAction<{ key: SortKey }>) {
      const { key } = action.payload
      if (state.sortKey === key) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        state.sortKey = key
        state.sortDirection = 'asc'
      }
    },
    updateClientStatus(state, action: PayloadAction<{ id: string; status: ClientStatus }>) {
      const client = state.items.find((c) => c.id === action.payload.id)
      if (client) {
        client.status = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Failed to fetch clients'
      })
  },
})

export const { setSearch, setStatusFilter, setSort, updateClientStatus } = clientsSlice.actions

export default clientsSlice.reducer


