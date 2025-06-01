import React, { use, useMemo, useState } from 'react'
import { useEventListener, useFunction } from '../hooks/index.js'

declare namespace Router {
  interface Props {
    routes: Route[]
    basename?: string
  }
  interface StaticProps extends React.PropsWithChildren {
    url: string
    basename?: string
  }
  interface UseRouter {
    (): Context
  }
  interface LazyRoutes {
    (
      modules: Record<string, () => Promise<{ default: React.ComponentType<React.PropsWithChildren<any>> }>>,
    ): Route[]
  }
  type Route = {
    path: string
    component?: React.ComponentType<React.PropsWithChildren<any>>
    children?: Route[]
  }
  type Context = {
    pathname: string
    params: { [k: string]: string }
    query: { [k: string]: string }
    navigate: (path: string) => void
  } | null
  type StaticContext = {
    basename: string
    pathname: string
    query: { [k: string]: string }
  } | null
}

const RouterContext = React.createContext<Router.Context>(null)
const StaticContext = React.createContext<Router.StaticContext>(null)

const trim = (str: string) => str.replace(/^\/|\/$/g, '')
const slash = (str: string) => str ? str.replace(/^([^\/])/, '/$1') : '/'
const join = (...strs: string[]) => strs.map(trim).join('/')

function Router(
  {
    routes,
    basename = ''
  }: Router.Props
) {
  const staticContext = use(StaticContext)
  if (typeof window === 'undefined' &&  !staticContext) {
    throw Error('Server-side rendering requires a static router')
  }
  const Basename = staticContext ? staticContext.basename : basename
  const getPathname = (pathname: string) => {
    if (!trim(pathname).startsWith(trim(Basename))) {
      return null
    }
    return trim(pathname).replace(new RegExp(`^${trim(Basename)}`), '/')
  }
  const [pathname, setPathname] = useState(() => getPathname(staticContext ? staticContext.pathname : location.pathname))

  const navigate = useFunction((path: string) => {
    path = slash(path)
    if (path !== pathname) {
      history.pushState(null, '', join(Basename, path))
      setPathname(getPathname(location.pathname))
    }
  })

  useEventListener('popstate', () => {
    setPathname(getPathname(location.pathname))
  })

  const element = useMemo(() => {
    if (!pathname) {
      return null
    }
    function flat(routes: Router.Route[], parentPath: string = '', components: any[] = []): {
      path: string
      components: any[]
    }[] {
      const result = []
      for (let i = 0; i < routes.length; i++) {
        const { path, component, children } = routes[i]
        const currPath = join(parentPath, path)
        const currComponents = [...components]
        if (component !== void 0) {
          currComponents.push(component)
        }
        if (children?.length) {
          result.push(...flat(children, currPath, currComponents))
        }
        if (currComponents.length) {
          result.push({
            path: slash(currPath),
            components: currComponents
          })
        }
      }
      return result
    }
    let element = null
    const flatRoutes = flat(routes)
    for (let i = 0; i < flatRoutes.length; i++) {
      const { path, components } = flatRoutes[i]
      const regex = path === '/' ?
        /^\/$/ : new RegExp(`^${path.replace(/\.?\*\/?/, '.*').replace(/:(\w+)/g, '([^\/]+)')}\/?$`)
      const match = pathname.match(regex)
      if (match) {
        const params: { [k: string]: string } = {}
        const keys = (path.match(/:(\w+)/g) || []).map((k) => k.replace(/^:/, ''))
        for (let i = 0; i < keys.length; i++) {
          params[keys[i]] = match[i + 1]
        }
        for (let j = components.length - 1; j >= 0; j--) {
          const Component = components[j]
          element = <Component>{element}</Component>
        }
        element = (
          <RouterContext.Provider
            value={{
              pathname,
              params,
              query: staticContext ? staticContext.query : Object.fromEntries(new URLSearchParams(location.search)),
              navigate
            }}
          >
            {element}
          </RouterContext.Provider>
        )
        break
      }
    }
    return element
  }, [routes, pathname])

  return element
}

export function StaticRouter(
  {
    url = '',
    basename = '',
    children
  }: Router.StaticProps
) {
  return (
    <StaticContext.Provider
      value={{
        basename,
        pathname: slash(url),
        query: Object.fromEntries(new URL(url, 'http://localhost').searchParams),
      }}
    >
      {children}
    </StaticContext.Provider>
  )
}

export const useRouter: Router.UseRouter = () => {
  return use(RouterContext)
}

export const lazyRoutes: Router.LazyRoutes = (modules) => {
  function findPrefix(arr: string[]) {
    if (arr.length === 1) {
      return arr[0].replace(/\/(\w+).(jsx|tsx)$/, '/')
    }
    let first = arr[0] || ''
    let prefix = ''
    for (let i = 0; i < first.length; i++) {
      const char = first[i]
      for (let j = 1; j < arr.length; j++) {
        const str = arr[j]
        if (i >= str.length || str[i] !== char) {
          return prefix
        }
      }
      prefix += char
    }
    return prefix
  }

  const prefix = findPrefix(Object.keys(modules))
  const routes: Router.Route[] = []
  const routeMap = new Map<string, Router.Route>()
  for (let k in modules) {
    const path = k
      .replace(new RegExp(`^${prefix}(.*)\.(jsx|tsx)$`), '/$1')
      .replace(/\/index$/, '')
      .replace(/\[(.+)\]/, ':$1')
    if (!/_.*/.test(path)) {
      let parentPath = '/'
      const paths = path.split('/')
      for (let i = 0; i < paths.length; i++) {
        const path = slash(paths[i])
        const route: Router.Route = {
          path: path === '/' ? '*' : path,
          children: []
        }
        if (i === paths.length - 1) {
          const Component = React.lazy<React.ComponentType<React.PropsWithChildren>>(modules[k])
          route.component = ({ children }) => (
            <React.Suspense>
              <Component>{children}</Component>
            </React.Suspense>
          )
        }
        const currPath = slash(join(parentPath, path))
        const parentRoute = routeMap.get(parentPath)
        const currRoute = routeMap.get(currPath)
        if (currRoute) {
          if (i === paths.length - 1) {
            currRoute.component = route.component
          }
        } else if (parentRoute) {
          parentRoute.children?.push(route)
          routeMap.set(currPath, route)
        } else {
          routes.push(route)
          routeMap.set(currPath, route)
        }
        parentPath = currPath
      }
    }
  }

  return routes
}

export default Router
