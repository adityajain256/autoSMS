
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
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
import { api } from './utils/api';
import { useEffect } from 'react';
import { DeleteClient } from './pages/Clients/DeleteClient';


function App() {
    useEffect(() => {
    const findLogin = async () => {
      try {
        const res =  await api.get("/auth/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        })
        if(res.data.message === 'Unauthorized: No token provided' || res.data.message === 'Unauthorized: Invalid token') {
          localStorage.removeItem("token");
        }
        localStorage.setItem("token", res.data.token);
      } catch (error) {
        console.log(error);

      }
    }
    findLogin()
  }, []);
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
            <Route path="entries/create" element={<CreateEntry />} />
            <Route path="profile" element={<Profile />} />
            <Route path="hero" element={<Hero />} />
            <Route path="/client/delete" element={<DeleteClient />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
