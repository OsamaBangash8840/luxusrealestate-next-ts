export const USER_DATA = 'user_data'
export const TOKEN_KEY = 'token'

export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  signup: '/signup',
  logout: '/logout',
  properties: '/properties',
  property: '/property/:id',
  addProperty: '/properties/addProperty',
  editProperty: '/editProperty/:id',
  about: '/about',
  contact: '/contact',
  verifyEmail: '/verify-email',
  resendEmail: '/resend-email',
  emailSent: '/verify-email-sent',
  profile: '/user/profile',
  updateProfile: '/user/profile/update',
  favorites: '/user/favorites',
  savedSearches: '/user/saved-searches',
  seller: '/user/seller',
  sellerProperties: '/user/seller/properties',
  sellerTours: '/user/seller/tours',
  chat: '/chat',
  messages: '/messages',
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminProperties: '/admin/properties',
  adminCategories: '/admin/dashboard/categories',
  adminUsers: '/admin/users',
  adminLogs: '/admin/logs',
}

export const protectedRoutes = [
  routes.profile,
  routes.updateProfile,
  routes.favorites,
  routes.savedSearches,
  routes.seller,
  routes.sellerProperties,
  routes.sellerTours,
  routes.addProperty,
  routes.chat,
  routes.messages,
  routes.admin,
  routes.adminDashboard,
  routes.adminProperties,
  routes.adminCategories,
  routes.adminUsers,
  routes.adminLogs,
]

export const protectedPrefixes = [
  '/user',
  '/admin',
  '/properties/addProperty',
  '/favorites',
  '/saved-searches',
  '/messages',
  '/chat',
]

export const guestOnlyRoutes = [
  routes.login,
  routes.register,
  routes.signup,
]

export const unProtectedRoutes = [
  routes.home,
  routes.properties,
  routes.about,
  routes.contact,
  routes.verifyEmail,
  routes.resendEmail,
  routes.emailSent,
]
