import { combineSlices, configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit'
import { counterSlice } from './features/counter/counterSlice'
import { quotesApiSlice } from './features/quotes/quotesApiSlice'
import { authApiSlice } from './features/auth/login/authApiSlice'
import { registerApiSlice } from './features/auth/register/registerApiSlice'
import { propertiesApiSlice } from './features/properties/propertiesApiSlice'
import { uploadImgSpliceApi } from './features/uploadImages/uploadImgSpliceApi'
import { contactApiSplice } from './features/contact/contactApiSplice'
import { googleAuthApiSlice } from './features/auth/google/googleApiSlice'
import { verifyEmailApiSlice } from './features/auth/verifyEmail/verifyEmailApiSlice'

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(
  counterSlice,
  quotesApiSlice,
  authApiSlice,
  registerApiSlice,
  propertiesApiSlice,
  uploadImgSpliceApi,
  contactApiSplice,
  googleAuthApiSlice,
  verifyEmailApiSlice
)
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        quotesApiSlice.middleware,
        authApiSlice.middleware,
        registerApiSlice.middleware,
        propertiesApiSlice.middleware,
        uploadImgSpliceApi.middleware,
        contactApiSplice.middleware,
        googleAuthApiSlice.middleware,
        verifyEmailApiSlice.middleware,
      ]),
  })

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
