import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// BrowserRouter habilita la navegacion por URL (necesaria para NavLink/Routes en App.tsx)
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Punto de entrada: monta la app dentro del <div id="root"> de index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
