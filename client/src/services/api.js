const trimTrailingSlash = (value) => value.replace(/\/+$/, '')

const apiOrigin = import.meta.env.VITE_API_BASE_URL
  ? trimTrailingSlash(import.meta.env.VITE_API_BASE_URL)
  : ''

export const buildApiUrl = (path) =>
  `${apiOrigin}${path.startsWith('/') ? path : `/${path}`}`

export const getAuthConfig = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {}
