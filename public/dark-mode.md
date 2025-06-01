# Dark Mode

This document outlines how to implement a dark mode feature using CSS custom properties and JavaScript. It also demonstrates how to integrate these theme variables with **Tailwind CSS v4**.

## Toggling Dark Mode

To switch between light and dark mode, you will toggle a `dark` class on the `<html>` element.

In JavaScript, you can achieve this as follows:

```javascript
// To enable dark mode
document.documentElement.classList.add('dark')

// To disable dark mode (revert to light mode)
document.documentElement.classList.remove('dark')

// A simple toggle function
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark')
  // Optional: Save preference to localStorage
  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark')
  } else {
    localStorage.setItem('theme', 'light')
  }
}

// Optional: Check for saved preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})
```

You would typically call `toggleDarkMode()` from a button click or another user interaction.

## Theme CSS Variables

The theming system relies on CSS custom properties (variables) defined for both light (default) and dark modes. These variables use the `oklch()` color function, which provides a perceptually uniform color space.

### Default (Light) Theme

These variables are defined in the `:root` scope, making them globally available.

```css
:root {
  --ui-default: oklch(0% 0 0); /* Text color on light backgrounds */
  --ui-background: oklch(100% 0 0); /* Page background */
  --ui-primary: oklch(0% 0 0); /* Primary accent/text, often matches --ui-default in simple themes */
  --ui-info: oklch(62.3% 0.214 259.815); /* Blue-ish for informational messages */
  --ui-success: oklch(72.3% 0.219 149.579); /* Green-ish for success states */
  --ui-error: oklch(63.7% 0.237 25.331); /* Red-ish for error states */
  --ui-warning: oklch(76.9% 0.188 70.08); /* Yellow/Orange-ish for warnings */
  --ui-light: oklch(92.8% 0.006 264.531); /* Very light gray/off-white, for subtle backgrounds/borders */
  --ui-gray: oklch(70.7% 0.022 261.325); /* Medium gray for secondary text/elements */
  --ui-deep: oklch(44.6% 0.03 256.802); /* Darker gray, for text on lighter backgrounds or subdued elements */
}
```

### Dark Theme

When the `dark` class is applied to the `<html>` element, these variables override the default ones.

```css
.dark {
  --ui-default: oklch(100% 0 0); /* Text color on dark backgrounds */
  --ui-background: oklch(13% 0.028 261.692); /* Dark page background */
  --ui-primary: oklch(100% 0 0); /* Primary accent/text, often matches --ui-default in simple themes */
  --ui-info: oklch(70.7% 0.165 254.624); /* Lighter blue-ish for dark mode */
  --ui-success: oklch(79.2% 0.209 151.711); /* Lighter green-ish for dark mode */
  --ui-error: oklch(70.4% 0.191 22.216); /* Lighter red-ish for dark mode */
  --ui-warning: oklch(75% 0.183 55.934); /* Lighter yellow/orange-ish for dark mode */
  --ui-light: oklch(44.6% 0.03 256.802); /* Corresponds to 'deep' in light mode */
  --ui-gray: oklch(70.7% 0.022 261.325); /* Medium gray (might need contrast adjustment in dark mode) */
  --ui-deep: oklch(92.8% 0.006 264.531); /* Corresponds to 'light' in light mode */
}
```

## Using Theme Variables

Tailwind CSS v4 embraces modern CSS features, including the `@theme` at-rule for defining your theme directly in CSS. This allows you to map your custom CSS properties to Tailwind's theme contract, enabling the use of standard Tailwind utility classes that react to your theme changes.

Place the following in your main CSS file (e.g., `styles.css` or `app.css`), which will be processed by Tailwind CSS:

```css
/* Your main CSS file (e.g., styles.css or app.css) */
@import "tailwindcss";

/* 1. Define your CSS custom properties for light and dark themes (as above) */
:root {
  --ui-default: oklch(0% 0 0);
  --ui-background: oklch(100% 0 0);
  --ui-primary: oklch(0% 0 0);
  --ui-info: oklch(62.3% 0.214 259.815);
  --ui-success: oklch(72.3% 0.219 149.579);
  --ui-error: oklch(63.7% 0.237 25.331);
  --ui-warning: oklch(76.9% 0.188 70.08);
  --ui-light: oklch(92.8% 0.006 264.531);
  --ui-gray: oklch(70.7% 0.022 261.325);
  --ui-deep: oklch(44.6% 0.03 256.802);
}

.dark {
  --ui-default: oklch(100% 0 0);
  --ui-background: oklch(13% 0.028 261.692);
  --ui-primary: oklch(100% 0 0);
  --ui-info: oklch(70.7% 0.165 254.624);
  --ui-success: oklch(79.2% 0.209 151.711);
  --ui-error: oklch(70.4% 0.191 22.216);
  --ui-warning: oklch(75% 0.183 55.934);
  --ui-light: oklch(44.6% 0.03 256.802);
  --ui-gray: oklch(70.7% 0.022 261.325);
  --ui-deep: oklch(92.8% 0.006 264.531);
}

/* 2. Map these CSS variables to Tailwind's theme system using @theme */
/* This tells Tailwind how to interpret your variables for its utility classes. */
@theme {
  --color-default: var(--ui-default);
  --color-background: var(--ui-background);
  --color-primary: var(--ui-primary);
  --color-info: var(--ui-info);
  --color-success: var(--ui-success);
  --color-error: var(--ui-error);
  --color-warning: var(--ui-warning);
  --color-light: var(--ui-light);
  --color-gray: var(--ui-gray);
  --color-deep: var(--ui-deep);
}
```
