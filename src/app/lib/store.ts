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
import { chatApi } from './features/chat/chatApi'
import { scheduleTourApiSlice } from './features/scheduleTours/scheduleToursApiSlice'
import { favoritesApiSlice } from './features/favorites/favoritesApiSlice'
import { savedSearchesApiSlice } from './features/savedSearches/savedSearchesApiSlice'
import { reviewsApiSlice } from './features/reviews/reviewsApiSlice'
import { categoryApiSlice } from './features/categories/categoryApiSlice'
import { authSlice } from './features/auth/authSlice'

const rootReducer = combineSlices(
  authSlice,
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
  chatSlice,
  chatApi,
  scheduleTourApiSlice,
  favoritesApiSlice,
  savedSearchesApiSlice,
  reviewsApiSlice,
  categoryApiSlice
)

export type RootState = ReturnType<typeof rootReducer>

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
        chatApi.middleware,
        scheduleTourApiSlice.middleware,
        favoritesApiSlice.middleware,
        savedSearchesApiSlice.middleware,
        reviewsApiSlice.middleware,
        categoryApiSlice.middleware,
      ]),
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
