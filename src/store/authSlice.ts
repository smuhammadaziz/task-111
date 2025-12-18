import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

export type AuthUser = {
    id: number
    email: string
    name: string
}

type AuthState = {
    user: AuthUser | null
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
}

type LoginPayload = {
    email: string
    password: string
}

export const login = createAsyncThunk<AuthUser, LoginPayload>(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await fetch('/data.json')
            if (!res.ok) {
                throw new Error('Failed to load mock data')
            }
            const data = (await res.json()) as {
                users: { id: number; email: string; password: string; name: string }[]
            }
            const user = data.users.find(
                (u: { id: number; email: string; password: string; name: string }) =>
                    u.email === email && u.password === password
            )
            if (!user) {
                return rejectWithValue('Invalid email or password') as unknown as AuthUser
            }
            delete (user as { password?: string }).password
            return user
        } catch {
            return rejectWithValue('Unable to login. Please try again.') as unknown as AuthUser
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) ?? 'Login failed'
            })
    },
})

export const { logout } = authSlice.actions

export default authSlice.reducer


