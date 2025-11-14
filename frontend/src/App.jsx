// src/App.jsx
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DropListPage from './pages/DropListPage';

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <Link to="/">Drops</Link>{' '}
        {user ? (
          <>
            {' | '}
            <span>{user.email}</span>{' '}
            {' | '}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            {' | '}
            <Link to="/login">Login</Link>
            {' | '}
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<DropListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* İleride: <Route path="/drops/:id" ... /> ve /admin/drops eklenecek */}
        </Routes>
      </main>
    </div>
  );
}

export default function AppRoot() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
