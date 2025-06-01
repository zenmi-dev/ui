import { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react'
import { debounce, throttle } from '../utils/index.js'

const DocumentTitle = globalThis.document?.title

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title || DocumentTitle
    return () => {
      document.title = DocumentTitle
    }
  }, [title])
}

export function useFirstRender(): boolean {
  const [first, setFirst] = useState(true)

  useEffect(() => {
    setFirst(false)
  }, [])

  return first
}

export function useFunction<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const ref = useRef(fn)

  useLayoutEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args) => ref.current(...args), [])
}

export function useEventListener(
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
): void {
  const fn = useFunction(listener)

  useEffect(() => {
    addEventListener(type, fn, options)
    return () => removeEventListener(type, fn, options)
  }, [type, fn, options])
}

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  listener: EventListener
): void {
  useEventListener('click', (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      listener(e)
    }
  }, true)
}

export function useWindowSize(): {
  width: number
  height: number
} {
  const getSize = () => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  const [size, setSize] = useState(getSize)
  useEventListener('resize', () => setSize(getSize))

  return size
}

export function useResizeObserver(
  ref: React.RefObject<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => any
): void {
  const fn = useFunction(callback)

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const observer = new ResizeObserver((entries) => {
      fn(entries[0])
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref.current])
}

export function useTimeout(callback: () => any, timeout: number): {
  start: () => void
  stop: () => void
} {
  const fn = useFunction(callback)
  const timer = useRef(0)

  const start = useCallback(() => {
    if (!timer.current) {
      timer.current = window.setTimeout(fn, timeout)
    }
  }, [])
  const stop = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = 0
  }, [])

  return { start, stop }
}

export function useInterval(callback: () => any, timeout: number): {
  start: () => void
  stop: () => void
} {
  const fn = useFunction(callback)
  const timer = useRef(0)

  const start = useCallback(() => {
    if (!timer.current) {
      timer.current = window.setInterval(fn, timeout)
    }
  }, [])
  const stop = useCallback(() => {
    clearInterval(timer.current)
    timer.current = 0
  }, [])

  useEffect(() => {
    start()
    return () => stop()
  }, [])

  return { start, stop }
}

export function useLocalStorage<T = undefined>(
  key: string,
  initialValue?: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => 
    JSON.parse(globalThis.localStorage?.getItem(key) ?? 'null') ?? initialValue
  )

  useEffect(() => {
    if (value !== void 0) {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.removeItem(key)
    }
  }, [value])

  return [value, setValue]
}

export function useSessionStorage<T = undefined>(
  key: string,
  initialValue?: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() =>
    JSON.parse(globalThis.sessionStorage?.getItem(key) ?? 'null') ?? initialValue
  )

  useEffect(() => {
    if (value !== void 0) {
      sessionStorage.setItem(key, JSON.stringify(value))
    } else {
      sessionStorage.removeItem(key)
    }
  }, [value])

  return [value, setValue]
}

export function useDebounce<T extends (...args: Parameters<T>) => any>(
  callback: T,
  timeout?: number
): (...args: Parameters<T>) => void {
  const fn = useFunction(callback)

  return useCallback(debounce(fn, timeout), [])
}

export function useThrottle<T extends (...args: Parameters<T>) => any>(
  callback: T,
  timeout?: number
): (...args: Parameters<T>) => void {
  const fn = useFunction(callback)

  return useCallback(throttle(fn, timeout), [])
}
