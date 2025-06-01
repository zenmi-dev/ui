# Hooks

A collection of useful custom React hooks to encapsulate common logic, manage side effects, and enhance component development in React applications.

## `useDocumentTitle`

Sets the document's title (`document.title`) when the component mounts or the `title` prop changes, and reverts to the original document title (captured when the module first loads) when the component unmounts.

### Signature

```typescript
export function useDocumentTitle(title: string): void
```

### Parameters

-   `title: string`: The desired title for the document. If an empty string or a falsy value (other than `undefined`, which it handles) is provided, it may fall back to the initially captured document title.

### Returns

-   `void`

### Example

```jsx
import { useDocumentTitle } from './hooks'

function MyPage() {
  useDocumentTitle('My Awesome Page Title')
  return <div>Content of my page...</div>
}

function ProductPage({ productName }) {
  useDocumentTitle(productName ? `Product: ${productName}` : 'Our Products')
  // ...
  return <div>Details for {productName}</div>
}
```

## `useFirstRender`

A hook that returns `true` only during the component's first render cycle. After the first render, it will consistently return `false`.

### Signature

```typescript
export function useFirstRender(): boolean
```

### Parameters

-   None.

### Returns

-   `boolean`: `true` if it's the component's first render, `false` otherwise.

### Example

```jsx
import { useEffect } from 'react'
import { useFirstRender } from './hooks'

function MyComponent() {
  const isFirstRender = useFirstRender()

  useEffect(() => {
    if (isFirstRender) {
      console.log('Component mounted - First render specific logic here!')
      // e.g., trigger an animation, fetch initial data that should only load once
    } else {
      console.log('Component has re-rendered.')
    }
  }, [isFirstRender])

  return <div>{isFirstRender ? 'Welcome!' : 'Welcome back!'}</div>
}
```

## `useFunction`

Memoizes a function reference using `useRef` and `useLayoutEffect`. This ensures the returned function reference remains stable across re-renders unless the input `fn` itself changes, helping to prevent stale closures and optimize dependencies for other hooks like `useCallback` or `useEffect`.

### Signature

```typescript
export function useFunction<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T>
```

### Parameters

-   `fn: T`: The function to be memoized.

### Returns

-   `(...args: Parameters<T>) => ReturnType<T>`: A memoized version of the input function that always calls the latest version of `fn`.

### Example

```jsx
import { useFunction } from './hooks'
import { useCallback } from 'react'

function ParentComponent({ dynamicHandler }) {
  // dynamicHandler might be recreated on each render of ParentComponent's parent
  const stableDynamicHandler = useFunction(dynamicHandler)

  // Now stableDynamicHandler can be used in a dependency array
  // for a useCallback or useEffect without causing it to re-run unnecessarily
  // due to dynamicHandler's identity changing.
  const memoizedCallback = useCallback(() => {
    stableDynamicHandler('some_event')
  }, [stableDynamicHandler])

  return <button onClick={memoizedCallback}>Click me</button>
}
```

## `useEventListener`

Attaches an event listener to the global `window` object for the specified event type and automatically removes it when the component unmounts or dependencies change.

### Signature

```typescript
export function useEventListener(
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
): void
```

### Parameters

-   `type: string`: The event type string (e.g., `'click'`, `'resize'`, `'keydown'`).
-   `listener: EventListener`: The callback function to execute when the event occurs.
-   `options?: boolean | AddEventListenerOptions`: Optional. The options to pass to `addEventListener` (e.g., `{ capture: true, passive: true }` or just `true` for capture).

### Returns

-   `void`

### Example

```jsx
import { useState } from 'react'
import { useEventListener } from './hooks'

function MousePositionLogger() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEventListener('mousemove', (event) => {
    // Cast event to MouseEvent if you need specific properties like clientX/Y
    const mouseEvent = event as MouseEvent
    setCoords({ x: mouseEvent.clientX, y: mouseEvent.clientY })
  })

  return (
    <div>
      Mouse Position: X: {coords.x}, Y: {coords.y}
    </div>
  )
}
```

## `useClickOutside`

Triggers a callback function when a click event occurs outside of a specified DOM element (referenced by a React `ref`).

### Signature

```typescript
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  listener: EventListener
): void
```

### Parameters

-   `ref: React.RefObject<HTMLElement | null>`: A React ref object attached to the DOM element to monitor for outside clicks.
-   `listener: EventListener`: The callback function to execute when a click outside the `ref`'s element is detected.

### Returns

-   `void`

### Example

```jsx
import { useRef, useState } from 'react'
import { useClickOutside } from './hooks'

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false)
      console.log('Clicked outside, closing dropdown.')
    }
  })

  return (
    <div ref={dropdownRef} style={{ position: 'relative', border: '1px solid #ccc', padding: '10px' }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      {isOpen && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, border: '1px solid #eee', listStyle: 'none', padding: '5px', margin: 0 }}>
          <li>Option 1</li>
          <li>Option 2</li>
        </ul>
      )}
    </div>
  )
}
```

## `useWindowSize`

Tracks the `window.innerWidth` and `window.innerHeight` and updates the component state when the window is resized.

### Signature

```typescript
export function useWindowSize(): {
  width: number
  height: number
}
```

### Parameters

-   None.

### Returns

-   `object`: An object containing `width` and `height` properties representing the current window dimensions. Returns `{ width: 0, height: 0 }` if `window` is not defined (e.g., during SSR).

### Example

```jsx
import { useWindowSize } from './hooks'

function ResponsiveLayout() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>Current Window Width: {width}px</p>
      <p>Current Window Height: {height}px</p>
      {width < 768 ? (
        <p>Displaying mobile layout.</p>
      ) : (
        <p>Displaying desktop layout.</p>
      )}
    </div>
  )
}
```

## `useResizeObserver`

Observes changes to the dimensions of a specified DOM element using the `ResizeObserver` API and calls a callback function with the `ResizeObserverEntry`.

### Signature

```typescript
export function useResizeObserver(
  ref: React.RefObject<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => any
): void
```

### Parameters

-   `ref: React.RefObject<HTMLElement | null>`: A React ref object attached to the DOM element to observe.
-   `callback: (entry: ResizeObserverEntry) => any`: The function to call when the element's size changes. It receives a `ResizeObserverEntry` object.

### Returns

-   `void`

### Note
The observer is attached when `ref.current` is available and the component (re-)renders. If `ref.current` is `null` initially and becomes an element later, the effect will re-run to attach the observer if the component re-renders due to this change. The observer is disconnected on unmount or if `ref.current` changes.

### Example

```jsx
import { useRef, useState, useEffect } from 'react'
import { useResizeObserver } from './hooks'

function AutoAdjustingTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [observedHeight, setObservedHeight] = useState(0)

  useResizeObserver(textareaRef, (entry) => {
    console.log('Textarea resized:', entry.contentRect)
    setObservedHeight(entry.contentRect.height)
  })

  return (
    <div>
      <textarea
        ref={textareaRef}
        placeholder="Type here, I will observe my size..."
        style={{ resize: 'vertical', minHeight: '50px', border: '1px solid green' }}
      />
      <p>Observed Textarea Height: {observedHeight.toFixed(2)}px</p>
    </div>
  )
}
```

## `useTimeout`

Manages a `setTimeout` call, providing `start` and `stop` controls. The callback function is memoized using `useFunction`.

### Signature

```typescript
export function useTimeout(callback: () => any, timeout: number): {
  start: () => void
  stop: () => void
}
```

### Parameters

-   `callback: () => any`: The function to execute after the timeout.
-   `timeout: number`: The delay in milliseconds before the callback is executed.

### Returns

-   `object`: An object with:
    -   `start: () => void`: Function to start (or restart) the timeout.
    -   `stop: () => void`: Function to clear the timeout.

### Example

```jsx
import { useState } from 'react'
import { useTimeout } from './hooks'

function Notification() {
  const [isVisible, setIsVisible] = useState(false)

  const hideNotification = () => setIsVisible(false)
  const { start: startHideTimer, stop: stopHideTimer } = useTimeout(hideNotification, 3000)

  const showNotification = () => {
    setIsVisible(true)
    startHideTimer() // Notification will hide after 3 seconds
  }

  return (
    <div>
      <button onClick={showNotification}>Show Notification</button>
      <button onClick={stopHideTimer} disabled={!isVisible}>Keep Visible</button>
      {isVisible && (
        <div style={{ background: 'lightyellow', padding: '10px', marginTop: '10px' }}>
          This is a notification! It will disappear soon.
        </div>
      )}
    </div>
  )
}
```

## `useInterval`

Manages a `setInterval` call, providing `start` and `stop` controls. The interval starts automatically when the component mounts and is cleared when it unmounts. The callback is memoized.

### Signature

```typescript
export function useInterval(callback: () => any, timeout: number): {
  start: () => void
  stop: () => void
}
```

### Parameters

-   `callback: () => any`: The function to execute repeatedly at the interval.
-   `timeout: number`: The interval delay in milliseconds.

### Returns

-   `object`: An object with:
    -   `start: () => void`: Function to start (or restart) the interval.
    -   `stop: () => void`: Function to clear the interval.

### Example

```jsx
import { useState } from 'react'
import { useInterval } from './hooks'

function LiveClock() {
  const [time, setTime] = useState(new Date())

  // Interval starts automatically on mount
  const { stop: stopClock, start: startClock } = useInterval(() => {
    setTime(new Date())
  }, 1000)

  return (
    <div>
      <p>Current Time: {time.toLocaleTimeString()}</p>
      <button onClick={stopClock}>Stop Clock</button>
      <button onClick={startClock}>Start Clock</button>
    </div>
  )
}
```

## `useLocalStorage`

A hook that behaves like `useState` but persists the state in the browser's `localStorage`. Values are serialized to JSON for storage and deserialized on retrieval.

### Signature

```typescript
export function useLocalStorage<T = undefined>(
  key: string,
  initialValue?: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>]
```

### Parameters

-   `key: string`: The key under which the value will be stored in `localStorage`.
-   `initialValue?: T | (() => T)`: The initial value to use if no value is found in `localStorage` for the given key. This can be a direct value or a function that returns the value (for lazy initialization).

### Returns

-   `[T, React.Dispatch<React.SetStateAction<T>>]`: A tuple containing the stateful value and a function to update it, similar to `useState`. Setting the value to `undefined` will remove the item from `localStorage`.

### Example

```jsx
import { useLocalStorage } from './hooks'

function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('app-theme', 'light')

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  // Apply theme to body or main app container
  // useEffect(() => { document.body.className = theme }, [theme])

  return (
    <div>
      <p>Current Theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
    </div>
  )
}
```

## `useSessionStorage`

Similar to `useLocalStorage`, but persists the state in the browser's `sessionStorage`. Data in `sessionStorage` is cleared when the page session ends (e.g., when the browser tab is closed).

### Signature

```typescript
export function useSessionStorage<T = undefined>(
  key: string,
  initialValue?: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>]
```

### Parameters

-   `key: string`: The key for `sessionStorage`.
-   `initialValue?: T | (() => T)`: Initial value or lazy initializer.

### Returns

-   `[T, React.Dispatch<React.SetStateAction<T>>]`: State and setter, like `useState`. Setting value to `undefined` removes item.

### Example

```jsx
import { useSessionStorage } from './hooks'

function TemporaryForm() {
  const [formInput, setFormInput] = useSessionStorage('temp-form-input', '')

  return (
    <div>
      <p>This input will be remembered for the current session only:</p>
      <input
        type="text"
        value={formInput}
        onChange={(e) => setFormInput(e.target.value)}
        placeholder="Type something..."
      />
      <p>Current session value: {formInput}</p>
    </div>
  )
}
```

## `useDebounce`

Creates a debounced version of a callback function, memoized for use in React components. The debounced function delays invoking the original callback until after `timeout` milliseconds have elapsed since the last time the debounced function was invoked.

### Signature

```typescript
export function useDebounce<T extends (...args: Parameters<T>) => any>(
  callback: T,
  timeout?: number
): (...args: Parameters<T>) => void
```

### Parameters

-   `callback: T`: The function to debounce.
-   `timeout?: number`: The debounce delay in milliseconds (default is handled by the underlying `debounce` utility).

### Returns

-   `(...args: Parameters<T>) => void`: The memoized, debounced version of the callback.

### Dependencies
-   Requires the `debounce` utility function (e.g., from `./utils`).
-   Uses `useFunction` internally.

### Example

```jsx
import { useState } from 'react'
import { useDebounce } from './hooks'
// Ensure 'debounce' utility is available and imported in hooks.ts

function LiveSearchInput() {
  const [inputValue, setInputValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // setSearchTerm will only be called 500ms after the user stops typing
  const debouncedSetSearchTerm = useDebounce((value: string) => {
    console.log('Debounced API call for:', value)
    setSearchTerm(value)
  }, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSetSearchTerm(value)
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search..."
      />
      <p>Searching for (debounced): {searchTerm}</p>
    </div>
  )
}
```

## `useThrottle`

Creates a throttled version of a callback function, memoized for use in React components. The throttled function ensures the original callback is invoked at most once per `timeout` period.

### Signature

```typescript
export function useThrottle<T extends (...args: Parameters<T>) => any>(
  callback: T,
  timeout?: number
): (...args: Parameters<T>) => void
```

### Parameters

-   `callback: T`: The function to throttle.
-   `timeout?: number`: The throttle period in milliseconds (default is handled by the underlying `throttle` utility).

### Returns

-   `(...args: Parameters<T>) => void`: The memoized, throttled version of the callback.

### Dependencies
-   Requires the `throttle` utility function (e.g., from `./utils`).
-   Uses `useFunction` internally.

### Example

```jsx
import { useState } from 'react'
import { useThrottle } from './hooks'
// Ensure 'throttle' utility is available and imported in hooks.ts

function ThrottledButton() {
  const [apiCallCount, setApiCallCount] = useState(0)

  // This function will only allow an "API call" once every 2 seconds
  const handleThrottledClick = useThrottle(() => {
    console.log('Throttled: Making API call...')
    setApiCallCount(count => count + 1)
    // Simulate API call
  }, 2000)

  return (
    <div>
      <button onClick={handleThrottledClick}>
        Call API (Throttled to 1 call/2s)
      </button>
      <p>API effectively called {apiCallCount} times.</p>
    </div>
  )
}
```
