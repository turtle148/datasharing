import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import Pitch from './routes/Pitch'
import GuestPortal from './routes/GuestPortal'
import Agency from './routes/Agency'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pitch />} />
        <Route path="/s/:stayToken" element={<GuestPortal />} />
        <Route path="/agency" element={<Agency />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
