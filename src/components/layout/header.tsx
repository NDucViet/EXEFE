import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { User } from '../../types/User';
import './header.css';

interface HeaderProps {
    user?: User;
    onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial scroll position
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            <img src="./img/logo-roomnear.png" alt="RoomNear" style={{ width: '50px', height: '50px' }} />
                            <span className="fw-bold fs-4 ms-2">
                                ROOM<span>NEAR</span>
                            </span>
                        </div>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-controls="navbarNav"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link px-3">Trang chủ</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/tim-tro" className="nav-link px-3">Tìm trọ</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dang-tin" className="nav-link px-3">Đăng tin</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/cong-dong" className="nav-link px-3">Cộng đồng</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/chu-ho" className="nav-link px-3">Chủ hộ</Link>
                            </li>
                        </ul>

                        <div className="d-flex align-items-center">
                            {!user ? (
                                <>
                                    <Link to="/dang-ky" className="btn btn-outline-primary me-2">Đăng ký</Link>
                                    <Link to="/dang-nhap" className="btn btn-primary">Đăng nhập</Link>
                                </>
                            ) : (
                                <div className="dropdown">
                                    <button
                                        className="btn btn-link dropdown-toggle text-decoration-none"
                                        type="button"
                                        id="userDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {user.name}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                        <li><Link to="/ho-so" className="dropdown-item"><i className="fas fa-user-edit me-2"></i>Hồ sơ</Link></li>
                                        <li><Link to="/phong-da-dang" className="dropdown-item"><i className="fas fa-list me-2"></i>Phòng đã đăng</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button 
                                                onClick={onLogout} 
                                                className="dropdown-item"
                                                disabled={!onLogout}
                                            >
                                                <i className="fas fa-sign-out-alt me-2"></i>
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
