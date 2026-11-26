import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializePwaUpdates } from './pwaUpdate'

initializePwaUpdates()

// Avoid React's development-only double effect replay: screen instructions must
// play exactly once when a screen opens.
createRoot(document.getElementById('root')!).render(<App />)
