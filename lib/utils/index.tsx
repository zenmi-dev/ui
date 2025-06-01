export function cls(
  ...args: (undefined | string | string[] | { [k: string]: any })[]
): string | undefined {
  const classList = []
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (typeof arg === 'string') {
      classList.push(arg)
    } else if (Array.isArray(arg)) {
      classList.push(cls(...arg))
    } else if (typeof arg === 'object') {
      for (let [k, v] of Object.entries(arg)) {
        if (v) {
          classList.push(k)
        }
      }
    }
  }
  return classList.join(' ').replace(/\s+/g, ' ').trim() || void 0
}

export function debounce<T extends (...args: Parameters<T>) => any>(
  fn: T,
  delay?: number
): (...args: Parameters<T>) => void {
  let timer: any = void 0
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function throttle<T extends (...args: Parameters<T>) => any>(
  fn: T,
  delay?: number
): (...args: Parameters<T>) => void {
  let timer: any = void 0
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      timer = void 0
    }, delay)
    fn.apply(this, args)
  }
}
