import { createBrowserRouter } from 'react-router';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { PCManagement } from './pages/PCManagement';
import { Reservations } from './pages/Reservations';
import { Users } from './pages/Users';
import { Payments } from './pages/Payments';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'pcs', Component: PCManagement },
      { path: 'reservations', Component: Reservations },
      { path: 'users', Component: Users },
      { path: 'payments', Component: Payments },
    ],
  },
]);
