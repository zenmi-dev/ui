# Router

A lightweight, custom React routing solution supporting client-side navigation, server-side rendering, nested routes, path parameters, query parameters, and a utility for generating routes from a file-based structure.

## Features

-   **Client-Side Routing**: Handles URL changes in the browser using the History API.
-   **Server-Side Rendering (SSR) Support**: Works with `StaticRouter` to render routes on the server.
-   **Nested Routes**: Define routes within other routes for complex layouts.
-   **Path Parameters**: Extract dynamic segments from the URL (e.g., `/users/:id`).
-   **Query Parameters**: Access URL query string parameters.
-   **Programmatic Navigation**: `navigate` function to change routes from your components.
-   **File-System Based Routing**: `lazyRoutes` utility to auto-generate route configurations from a module map (e.g., Vite's `import.meta.glob`).
-   **Code Splitting**: `lazyRoutes` leverages `React.lazy` and `React.Suspense` for component-level code splitting.
-   **Basename Support**: Allows the router to operate under a specific base path.

## `Router`

The main component responsible for client-side routing. It listens to URL changes, matches the current path against the provided `routes` configuration, and renders the appropriate component(s).

### Props

-   `routes: Router.Route[]`: An array of route configuration objects.
-   `basename?: string`: (Optional) A base URL path for the application. All routes will be relative to this basename. Defaults to `''`.

### Example

```tsx
// App.tsx
import Router from './Router' // Adjust path as needed
import Home from './pages/Home'
import About from './pages/About'
import UserProfile from './pages/UserProfile'

const routes: Router.Route[] = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/users/:userId', component: UserProfile },
  { path: '*', component: () => <div>404 Not Found</div> } // Wildcard route
]

function App() {
  return <Router routes={routes} basename="/app" />
}
```

### Route Definition

Routes are defined as an array of `Router.Route` objects:

```typescript
type Route = {
  path: string                                     // Path string, e.g., "/", "/about", "/users/:id", "*"
  component?: React.ComponentType<React.PropsWithChildren<any>> // Component to render
  children?: Route[]                               // Optional array of nested routes
}
```

-   `path`:
    -   Static paths: `/about`, `/contact`
    -   Dynamic segments: `/users/:id`, `/products/:category/:productId`
    -   Wildcard (catch-all): `*` (usually placed last). The `Router` implementation also supports `.*` in paths for more flexible wildcards within a path segment, e.g. `/files/.*`.
-   `component`: The React component to render when the path matches. For nested routes, the parent component should render its `children` prop to display the matched child component.
-   `children`: An array of `Route` objects nested under this route. Their paths will be relative to the parent's path.

```tsx
// Example of nested routes
const routes: Router.Route[] = [
  {
    path: '/dashboard',
    component: DashboardLayout, // Renders children
    children: [
      { path: '/', component: DashboardHome }, // Matches /dashboard
      { path: '/profile', component: UserProfile }, // Matches /dashboard/profile
      { path: '/settings', component: SettingsPage }, // Matches /dashboard/settings
    ],
  },
]

// DashboardLayout.tsx
function DashboardLayout({ children }) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      <main>{children}</main> {/* Child route component renders here */}
    </div>
  )
}
```

## `StaticRouter`

Used for server-side rendering. It provides a static context (URL, basename, query params) to the `Router` component, allowing it to render the correct route tree based on the server request URL.

### Props

-   `url: string`: The full request URL (including path and query string) from the server.
-   `basename?: string`: (Optional) The base URL path, same as in `Router`. Defaults to `''`.
-   `children: React.ReactNode`: Typically, this will be the `<Router>` component.

### Example

```tsx
// server.js (conceptual example)
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from './Router' // Adjust path
import AppRoutes from './AppRoutes' // Your <Router routes={...} /> component

function handleRequest(req, res) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter url={req.url} basename="/app">
      <AppRoutes />
    </StaticRouter>
  )
  res.send(`<!DOCTYPE html><html><body><div id="root">${html}</div></body></html>`)
}
```

## `useRouter`

A custom hook that provides access to the current routing context from within any component rendered as a descendant of `<Router>`.

### Returns

- `Router.Context | null`:
  -   `pathname: string`: The current matched path, relative to the basename.
  -   `params: { [k: string]: string }`: An object containing key-value pairs of URL parameters (e.g., for a route `/users/:id` and URL `/users/123`, `params` would be `{ id: '123' }`).
  -   `query: { [k: string]: string }`: An object containing key-value pairs from the URL query string.
  -   `navigate: (path: string) => void`: A function to programmatically navigate to a new path. The path should be relative to the basename.

```tsx
// components/UserProfile.tsx
import { useRouter } from './Router' // Adjust path

function UserProfile() {
  const router = useRouter()

  if (!router) return null // RouterContext not yet available or not in Router

  const { params, query, navigate } = router

  return (
    <div>
      <h1>User Profile: {params.userId}</h1>
      <p>Source: {query.source || 'N/A'}</p>
      <button onClick={() => navigate('/')}>Go Home</button>
      <button onClick={() => navigate('/about?ref=profile')}>Go to About</button>
    </div>
  )
}
```

## `lazyRoutes`

A powerful utility function to automatically generate a `Router.Route[]` array from a map of dynamically imported modules. This is particularly useful with tools like Vite that support `import.meta.glob` for file-system based routing.

### Signature

```typescript
Router.LazyRoutes = (
  modules: Record<string, () => Promise<{ default: React.ComponentType<React.PropsWithChildren<any>> }>>,
): Router.Route[]
```

### Parameters

-   `modules`: An object where keys are file paths (e.g., from `import.meta.globEager` or `import.meta.glob`) and values are functions that return a Promise resolving to a module with a `default` export (the React component).

### Behavior

-   **Path Conversion**:
    -   Removes a common prefix from file paths.
    -   Converts `/index.(jsx|tsx)` to the parent directory path (or `/` for root index).
    -   Converts `/[paramName].(jsx|tsx)` to `/:paramName`.
-   **Wildcard**: A * path, typically for the base route, is assigned the component from a root-level index file (e.g., pages/index.tsx after prefix removal).
-   **Ignoring Files**: Paths containing `/_` (e.g., `/_layout.tsx`) are ignored, allowing for layout components or private modules that are not direct routes.
-   **`React.lazy` & `React.Suspense`**: Wraps each resolved component with `React.lazy` and a `React.Suspense` fallback, enabling code splitting. *Note: You might still want a top-level `<React.Suspense>` in your app for a general loading UI.*

### Example

Assuming a file structure:

```
src/
├── pages/
│   ├── index.tsx           // -> /
│   ├── about.tsx           // -> /about
│   ├── posts/
│   │   ├── index.tsx       // -> /posts
│   │   └── [postId].tsx    // -> /posts/:postId
│   └── _layout.tsx         // Ignored as a direct route
└── App.tsx
```

```tsx
// App.tsx
import Router, { lazyRoutes } from './Router' // Adjust path
import React from 'react'

// With Vite:
const modules = import.meta.glob('./pages/**/*.{ts,tsx}')

const generatedRoutes = lazyRoutes(modules)

function App() {
  return (
    <React.Suspense fallback={<div>Loading Page...</div>}>
      <Router routes={generatedRoutes} />
    </React.Suspense>
  )
}
```
