# Utility Functions

A collection of useful utility functions for common tasks.

## `cls`

A utility function to conditionally construct a CSS class string from various argument types. It filters out falsy values, handles arrays recursively, and processes objects where keys are class names and values determine inclusion.

### Signature

```typescript
export function cls(
  ...args: (undefined | string | string[] | { [k: string]: any })[]
): string | undefined
```

### Parameters

-   `...args`: A rest parameter accepting a mix of the following:
    -   `string`: The string is added directly to the class list.
    -   `string[]`: Each string in the array is processed (recursively calls `cls`).
    -   `{ [key: string]: any }`: An object where keys are class names. A key is added to the class list if its corresponding value is truthy.
    -   `undefined`: Ignored.

### Returns

-   `string | undefined`: A single string containing all valid class names, separated by single spaces. Extra spaces are removed, and the string is trimmed. Returns `undefined` if no class names are generated.

### Examples

```javascript
import { cls } from '@zenmi/ui/utils'

// Basic strings
console.log(cls('foo', 'bar')) // "foo bar"

// With undefined/null
console.log(cls('foo', undefined, 'bar', null)) // "foo bar"

// Using objects for conditional classes
console.log(cls('button', { 'is-active': true, 'is-hidden': false, 'theme-dark': 1 }))
// "button is-active theme-dark"

// Using arrays
console.log(cls('base', ['component', 'variant-a']))
// "base component variant-a"

// Mixed arguments
console.log(cls(
  'header',
  ['sticky', undefined],
  { 'has-shadow': true, 'is-large': 0 },
  'text-center'
))
// "header sticky has-shadow text-center"

// Empty result
console.log(cls(undefined, { foo: false }, [])) // undefined
console.log(cls()) // undefined
```

## `debounce`

Creates a debounced version of a function that delays its execution until after a specified `delay` time has passed without it being called again. This is useful for events that fire rapidly, like window resizing, search input, ormousemove.

### Signature

```typescript
export function debounce<T extends (...args: Parameters<T>) => any>(
  fn: T,
  delay?: number
): (...args: Parameters<T>) => void
```

### Parameters

-   `fn: T`: The function to debounce.
-   `delay?: number`: The delay in milliseconds before the function `fn` is executed. If not provided, `setTimeout` will treat it as `0`, meaning the function will execute as soon as the current call stack clears.

### Returns

-   `(...args: Parameters<T>) => void`: A new function that, when invoked, will only call `fn` after `delay` milliseconds of inactivity. The `this` context and arguments are preserved.

### Examples

```javascript
import { debounce } from '@zenmi/ui/utils'

// Example: Search input
const handleSearchInput = (query) => {
  console.log(`Searching for: ${query}`)
  // Perform actual search API call here
}

const debouncedSearch = debounce(handleSearchInput, 300)

// Simulating input events
debouncedSearch('j')
debouncedSearch('ja')
debouncedSearch('jav')
debouncedSearch('java')
// After ~300ms of no new calls, "Searching for: java" will be logged once.

// Example: Window resize
// (Conceptual - in a browser environment)
/*
const handleResize = () => {
  console.log('Window resized. Recalculating layout...')
}
const debouncedResize = debounce(handleResize, 250)
window.addEventListener('resize', debouncedResize)
*/
```

## `throttle`

Creates a throttled version of a function that ensures it's executed at most once per every specified `delay` period. The first call to the throttled function is executed immediately. Subsequent calls within the `delay` window are ignored.

### Signature

```typescript
export function throttle<T extends (...args: Parameters<T>) => any>(
  fn: T,
  delay?: number
): (...args: Parameters<T>) => void
```

### Parameters

-   `fn: T`: The function to throttle.
-   `delay?: number`: The throttle period in milliseconds. The function `fn` will not be called again until this amount of time has passed since its last execution. If not provided, `setTimeout` will treat it as `0`, meaning the function can effectively be called repeatedly with a very short cooldown.

### Returns

-   `(...args: Parameters<T>) => void`: A new function that, when invoked, will execute `fn` at most once per `delay` milliseconds. The `this` context and arguments are preserved.

### Examples

```javascript
import { throttle } from '@zenmi/ui/utils'

let scrollCount = 0
const handleScroll = (eventData) => {
  scrollCount++
  console.log(`Scroll event processed ${scrollCount} times. Data:`, eventData)
  // Perform actions on scroll
}

const throttledScroll = throttle(handleScroll, 1000) // Throttle to once per second

// Simulating scroll events
throttledScroll({ position: 100 }) // Executes immediately, logs "Scroll event processed 1 times..."
throttledScroll({ position: 150 }) // Ignored
throttledScroll({ position: 200 }) // Ignored

// Wait for more than 1 second
setTimeout(() => {
  throttledScroll({ position: 500 }) // Executes, logs "Scroll event processed 2 times..."
  throttledScroll({ position: 550 }) // Ignored
}, 1200)

// Example: Button click
// (Conceptual - in a browser environment)
/*
const handleClick = () => {
  console.log('Button clicked! Submitting form...')
  // submitForm()
}
const throttledClick = throttle(handleClick, 2000) // Prevent double-clicks
const button = document.getElementById('myButton')
button.addEventListener('click', throttledClick)
*/
```
