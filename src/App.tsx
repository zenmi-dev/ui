import React, { useEffect } from 'react'
import Router, { lazyRoutes } from '../lib/router'
import { useFirstRender, useFunction, useLocalStorage, useWindowSize } from '../lib/hooks'

const modules = import.meta.glob<{ default: React.FC }>('./routes/**/*.tsx')
const routes = lazyRoutes(modules)

export const AppContext = React.createContext<{
  rwd: {
    'sm': number
    'md': number
    'lg': number
    'xl': number
    '2xl': number
  }
  windowSize: {
    width: number
    height: number
  }
  firstRender: boolean
  mode: {
    state: 'light' | 'dark'
    toggle: () => void
  }
} | null>(null)

const rwd = { 'sm': 640, 'md': 768, 'lg': 1024, 'xl': 1280, '2xl': 1536 }

function App() {
  const windowSize = useWindowSize()
  const firstRender = useFirstRender()
  const [mode, setMode] = useLocalStorage<'light' | 'dark'>('app-mode', 'light')

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const toggleMode = useFunction(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  })

  return (
    <AppContext.Provider
      value={{
        rwd,
        windowSize,
        firstRender,
        mode: {
          state: mode,
          toggle: toggleMode
        }
      }}
    >
      <Router routes={routes} />
    </AppContext.Provider>
  )
}

export default App
