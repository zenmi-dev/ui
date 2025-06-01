import { useEffect, useRef, useState } from 'react'
import { useFunction } from '../hooks/index.js'

export function useComponentRef<T = HTMLElement>(
  ref?: React.Ref<T>
): [React.RefObject<T | null>, React.RefCallback<T>] {
  const refObject = useRef<T>(null)

  const refCallback = (el: T) => {
    refObject.current = el
    if (ref) {
      if (typeof ref === 'function') {
        ref(el)
      } else {
        ref.current = el
      }
    }
  }

  return [refObject, refCallback]
}

export function useStateListner<T>(
  state: T,
  onChangeState?: (v: T) => any,
  initialState?: T
): [T, (v: T) => void] {
  const [tmp, setTmp] = useState(state !== void 0 ? state : initialState)
  const [value, setValue] = useState(tmp)

  const changeValue = useFunction((v: T) => {
    if (v !== value) {
      setTmp(v)
      onChangeState?.(v)
    }
  })

  useEffect(() => {
    if (state !== void 0 && state !== tmp) {
      setTmp(state)
      setValue(state)
    } else {
      setValue(tmp)
    }
  }, [state, tmp])

  return [value as T, changeValue]
}

export function clientOnly<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  return globalThis.document && fn(...args)
}
