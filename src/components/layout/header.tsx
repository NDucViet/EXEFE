import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { UserResponse } from '../../types/User';

interface HeaderProps {
    user?: UserResponse;
}

const Header = ({ user }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <span className="fw-bold text-primary fs-4">ROOMNEAR</span>
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
                                        className="btn btn-link dropdown-toggle text-dark text-decoration-none"
                                        type="button"
                                        id="userDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {user.name}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                        <li><Link to="/ho-so" className="dropdown-item">Hồ sơ</Link></li>
                                        <li><Link to="/phong-da-dang" className="dropdown-item">Phòng đã đăng</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button onClick={() => {/* Add logout logic */ }} className="dropdown-item">Đăng xuất</button></li>
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
