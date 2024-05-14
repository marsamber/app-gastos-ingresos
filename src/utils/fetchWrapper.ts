interface CustomFetchOptions extends globalThis.RequestInit {
  headers?: globalThis.HeadersInit
}

const customFetch = (url: string, options: CustomFetchOptions = {}): Promise<Response> => {
  const apiKey = localStorage.getItem('apiKey')

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || ''
  }

  const headers = new Headers(options.headers || {})
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.append(key, value)
    }
  })

  const newOptions: globalThis.RequestInit = { ...options, headers }

  return fetch(url, newOptions)
}

export default customFetch
