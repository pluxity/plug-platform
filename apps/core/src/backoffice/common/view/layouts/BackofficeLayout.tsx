import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button, Badge } from '@plug/ui'
import { BackofficeHeader } from '../components'

interface MenuItem {
  id: string
  label: string
  icon: string
  path: string
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
  { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' },
]

const BackofficeLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            <span className="text-point-blue">Pluxity</span> Admin
          </h2>
          <Badge variant="secondary" className="text-xs mt-2">
            Administrator
          </Badge>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={location.pathname === item.path ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => navigate(item.path)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <BackofficeHeader />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default BackofficeLayout
