import { createBrowserRouter } from 'react-router';
import { RequireAuth } from './components/RequireAuth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { PCManagement } from './pages/PCManagement';
import { Reservations } from './pages/Reservations';
import { Users } from './pages/Users';
import { Payments } from './pages/Payments';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: RequireAuth,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'pcs', Component: PCManagement },
          { path: 'reservations', Component: Reservations },
          { path: 'users', Component: Users },
          { path: 'payments', Component: Payments },
        ],
      },
    ],
  },
]);
