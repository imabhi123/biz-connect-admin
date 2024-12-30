// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/dashboard'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password')
}

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500'
}

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    staff: path(ROOTS_DASHBOARD, '/staff'),
    warehouse: path(ROOTS_DASHBOARD, '/profile/'),
    inventory: path(ROOTS_DASHBOARD, '/inventory/'),
    users:path(ROOTS_DASHBOARD,'/club-and-chapters'),
    coupons:path(ROOTS_DASHBOARD,'/coupons'),
    blogs:path(ROOTS_DASHBOARD,'/offers'),
    threatFeed:path(ROOTS_DASHBOARD,'/biz-reels'),
    malwareManagement:path(ROOTS_DASHBOARD,'/community-management'),
    victimsManagement:path(ROOTS_DASHBOARD,'/news-management'),
    plans:path(ROOTS_DASHBOARD,'/plans'),
    banner:path(ROOTS_DASHBOARD,'/banner-management'),
    services:path(ROOTS_DASHBOARD,'/services-management'),
    event:path(ROOTS_DASHBOARD,'/event-management'),
    userslist:path(ROOTS_DASHBOARD,'/users-list'),
    notifications:path(ROOTS_DASHBOARD,'/notifications'),
    business:path(ROOTS_DASHBOARD,'/business-management'),
    approve_members:path(ROOTS_DASHBOARD,'/approve-members'),

  },

  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),

    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account')
  }
}

export const PATH_DOCS = ''
export const API_DOCS = ''
