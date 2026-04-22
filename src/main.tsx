import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { registerServiceWorker } from './lib/registerServiceWorker.ts'
import { AppProviders } from './providers/AppProviders.tsx'

registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
