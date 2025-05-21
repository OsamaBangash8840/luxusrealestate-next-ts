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
import { profileApiSlice } from './features/profile/profileApiSlice'
import { adminApiSlice } from './features/auth/admin/adminApiSlice'
import { propertyStatusApiSlice } from './features/auth/admin/dashboard/propertyStatus/propertyStatusApiSlice'
import { adminPropertiesApiSlice } from './features/auth/admin/dashboard/propertyStatus/AllProperties/adminPropertiesApiSlice'
import { chatSlice } from './features/chat/chatSlice'
import { chatApi } from './features/chat/chatApi' // Import chatApi
import { scheduleTourApiSlice } from './features/scheduleTours/scheduleToursApiSlice'

const rootReducer = combineSlices(
  counterSlice,
  quotesApiSlice,
  authApiSlice,
  registerApiSlice,
  propertiesApiSlice,
  uploadImgSpliceApi,
  contactApiSplice,
  googleAuthApiSlice,
  verifyEmailApiSlice,
  profileApiSlice,
  adminApiSlice,
  propertyStatusApiSlice,
  adminPropertiesApiSlice,
  chatSlice, // ✅ Added correctly as a slice reducer
  chatApi, // ✅ Added correctly as an API slice,
  scheduleTourApiSlice
)

// ✅ Corrected `RootState`
export type RootState = ReturnType<typeof rootReducer>

// ✅ Fixed `makeStore` function
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,

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
        profileApiSlice.middleware,
        adminApiSlice.middleware,
        propertyStatusApiSlice.middleware,
        adminPropertiesApiSlice.middleware,
        chatApi.middleware, // ✅ Added chat API middleware
        scheduleTourApiSlice.middleware,
      ]),
  })

// ✅ Infer store types
export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
