# Zenmi UI

A React UI library designed for intuitive use while providing deep customization capabilities.

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

## Documentation

For detailed information on all available components, props, and usage guidelines, please visit the official documentation:

[**Zenmi UI Official Documentation**](https://ui.zenmi.dev)
