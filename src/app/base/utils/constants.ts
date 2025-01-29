export const USER_DATA = 'user_data'
export const routes = {
  home: '/',
  login: '/login',
  properties: '/properties',
  property: '/property/:id',
  addProperty: '/properties/addproperty',
  editProperty: '/editProperty/:id',
  register: '/signup',
  profile: '/profile',
  logout: '/logout',
  about: '/about',
  contact: '/contact',
  verifyEmail: '/verify-email',
  resendEmail: '/resend-email',
  emailSent: 'verify-email-sent',
}

export const protectedRoutes = [
  routes.profile,
  // routes.adminProjects,
  // routes.adminTestimonials,
  // routes.adminOurTeam,
  // routes.adminServices,
  // routes.adminContactQueries,
  // routes.adminClients,
  // routes.adminHomePage,
]

export const unProtectedRoutes = [routes.home]
