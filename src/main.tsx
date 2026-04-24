import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from './providers/AppProviders.tsx'
import { showNotification } from './lib/notifications'

const enableServiceWorkerInDev = import.meta.env.VITE_ENABLE_SW_DEV === 'true'
const shouldRegisterServiceWorker = !import.meta.env.DEV || enableServiceWorkerInDev

if ('serviceWorker' in navigator && shouldRegisterServiceWorker) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js')
  })
}

window.addEventListener('appinstalled', () => {
  showNotification({
    title: 'Aplicación instalada',
    message: 'BarberShop ya se agregó a la pantalla de inicio.',
    variant: 'success',
  })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
