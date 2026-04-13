
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { Layout } from './components/layout/Layout';

import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Clients } from './pages/Clients/Clients';
import { Entries } from './pages/Entries/Entries';
import { CreateEntry } from './pages/Entries/CreateEntry';
import { Profile } from './pages/Profile/Profile';
import Hero from './pages/Hero/Hero';
import { DeleteClient } from './pages/Clients/DeleteClient';
import { Sms } from './pages/Sms/Sms';
import Announcement from './pages/Announcement/Announcement';


function App() {

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/hero" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="entries" element={<Entries />} />
            <Route path="/create" element={<CreateEntry />} />
            <Route path="profile" element={<Profile />} />
            <Route path="hero" element={<Hero />} />
            <Route path="/SMS" element={<Sms />} />
            <Route path="/client/delete" element={<DeleteClient />} />
            <Route path="announcement" element={<Announcement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
