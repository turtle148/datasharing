import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { useHashRouting } from './lib/links'

/**
 * Entry for the single-file build published as a Claude artifact: routes live
 * in the hash, because the page is served from one URL and browser storage is
 * unavailable there (the store falls back to memory on its own).
 */
useHashRouting()

const mount = document.getElementById('root') ?? document.body.appendChild(document.createElement('div'))

createRoot(mount).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
