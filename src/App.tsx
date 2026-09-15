import { Route, Routes } from 'react-router-dom'
import GuestPortal from './routes/GuestPortal'
import Agency from './routes/Agency'

/** The demo link lands on a real stay, so the root is the guest portal itself. */
export const DEMO_TOKEN = 'villa-serena-0811'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestPortal token={DEMO_TOKEN} />} />
      <Route path="/s/:stayToken" element={<GuestPortal />} />
      <Route path="/agency" element={<Agency />} />
      <Route path="*" element={<GuestPortal />} />
    </Routes>
  )
}
