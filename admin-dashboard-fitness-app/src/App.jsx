import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Users from './pages/Users';
import HomeScreenConfig from './pages/HomeScreenConfig';
import Workouts from './pages/Workouts';
import SignIn from './pages/SignIn';
import Challenges from './pages/Challenges';
import DashboardHome from './pages/DashboardHome';
import { useSelector } from 'react-redux';

function App() {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!token;

  return (
    <Router>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/home-config" element={<HomeScreenConfig />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
