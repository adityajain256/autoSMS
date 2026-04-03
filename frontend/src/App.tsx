
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { Layout } from './components/layout/Layout';

import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Clients } from './pages/Clients/Clients';
import { Entries } from './pages/Entries/Entries';
import { CreateEntry } from './pages/Entries/CreateEntry';


function App() {

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="entries" element={<Entries />} />
            <Route path="entries/create" element={<CreateEntry />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
