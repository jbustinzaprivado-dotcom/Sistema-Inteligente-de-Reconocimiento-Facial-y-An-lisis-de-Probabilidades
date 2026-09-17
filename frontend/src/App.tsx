import { History, LayoutDashboard, PieChart, ScanFace, UserSearch } from 'lucide-react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Historial from './pages/Historial'
import Probabilidades from './pages/Probabilidades'
import Reconocimiento from './pages/Reconocimiento'
import RegistroFacial from './pages/RegistroFacial'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
  }`

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-6 py-3">
          <span className="mr-4 font-semibold text-gray-900">Reconocimiento Facial</span>
          <nav className="flex flex-wrap gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/registro" className={navLinkClass}>
              <ScanFace size={16} />
              Registro facial
            </NavLink>
            <NavLink to="/reconocimiento" className={navLinkClass}>
              <UserSearch size={16} />
              Reconocimiento
            </NavLink>
            <NavLink to="/probabilidades" className={navLinkClass}>
              <PieChart size={16} />
              Probabilidades
            </NavLink>
            <NavLink to="/historial" className={navLinkClass}>
              <History size={16} />
              Historial
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registro" element={<RegistroFacial />} />
          <Route path="/reconocimiento" element={<Reconocimiento />} />
          <Route path="/probabilidades" element={<Probabilidades />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </main>
    </div>
  )
}