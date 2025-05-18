import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import Community from './pages/Community';
import Login from './components/auth/Login';
import AIChatBox from './components/chat/AIChatBox';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
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
              <Route path="/cong-dong" element={<Community />} />
            </Routes>
          </main>
          <Footer />
          <AIChatBox />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
