import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import Login from './components/auth/Login';
import ChatBox from './components/chat/ChatBox';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/main.css';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="app min-vh-100 d-flex flex-column">
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Header />
      </div>
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dang-ky" element={<Register />} />
          <Route path="/tim-tro" element={<RoomList />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/phong/:id" element={<RoomDetail />} />
        </Routes>
      </main>
      <Footer />
      {user && <ChatBox currentUserId={user.id} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
