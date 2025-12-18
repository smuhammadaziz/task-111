import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/authSlice'
import clientsReducer from './store/clientsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


