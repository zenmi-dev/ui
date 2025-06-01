# Get started with Zenmi UI

This guide will walk you through installing Zenmi UI and using your first component.

**Important:** Zenmi UI is built for modern React features and requires **React v19** or a later version.

## Installation

```bash
npm i @zenmi/ui
```

## Usage

Import the necessary CSS styles in the main entry point of your application.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@zenmi/ui/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
```

Use components in your React files.

```jsx
import { Button } from '@zenmi/ui'

function App() {
  return (
    <>
      <Button>Button</Button>
    </>
  )
}

export default App
```
