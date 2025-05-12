import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import RoomList from './pages/RoomList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

function App() {
  return (
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
