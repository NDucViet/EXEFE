import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer py-5 bg-white">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 mb-4 mb-lg-0">
                        <Link to="/" className="d-inline-flex align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <img src="./img/logo-roomnear.png" alt="RoomNear" style={{ width: '200px', height: '200px' }} />
                            </div>
                        </Link>
                    </div>

                    <div className="col-6 col-lg-3 mb-4 mb-lg-0">
                        <h5 className="text-dark mb-3">SELL A HOME</h5>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <Link to="/request-offer" className="text-muted text-decoration-none">Request an offer</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/pricing" className="text-muted text-decoration-none">Pricing</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/reviews" className="text-muted text-decoration-none">Reviews</Link>
                            </li>
                            <li>
                                <Link to="/stories" className="text-muted text-decoration-none">Stories</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 col-lg-3 mb-4 mb-lg-0">
                        <h5 className="text-dark mb-3">BUY, RENT AND SELL</h5>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <Link to="/buy-sell-properties" className="text-muted text-decoration-none">Buy and sell properties</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/rent-home" className="text-muted text-decoration-none">Rent home</Link>
                            </li>
                            <li>
                                <Link to="/builder-trade-up" className="text-muted text-decoration-none">Builder trade-up</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 col-lg-3">
                        <h5 className="text-dark mb-3">HƯỚNG DẪN</h5>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <Link to="/about" className="text-muted text-decoration-none">Về chúng tôi</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/blog" className="text-muted text-decoration-none">Báo giá và hỗ trợ</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/faq" className="text-muted text-decoration-none">Câu hỏi thường gặp</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted text-decoration-none">Góp ý báo lỗi</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-4" />

                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="text-muted mb-0">©2023 Roomnear. All rights reserved</p>
                    </div>
                    <div className="col-md-6">
                        <ul className="list-inline text-center text-md-end mb-0">
                            <li className="list-inline-item">
                                <a href="https://facebook.com" className="text-muted" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-facebook"></i>
                                </a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="https://instagram.com" className="text-muted" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-instagram"></i>
                                </a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="https://twitter.com" className="text-muted" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-twitter"></i>
                                </a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="https://linkedin.com" className="text-muted" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-linkedin"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 