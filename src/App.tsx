import { Navigate, Route, Routes } from 'react-router-dom'
import Pitch from './routes/Pitch'
import GuestPortal from './routes/GuestPortal'
import Agency from './routes/Agency'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Pitch />} />
      <Route path="/s/:stayToken" element={<GuestPortal />} />
      <Route path="/agency" element={<Agency />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
