import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

interface LoginFormData {
    email: string;
    password: string;
}


const Login = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // TODO: Replace with your API endpoint
            const response = await fetch('YOUR_API_URL/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    rememberMe
                }),
            });

            
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google login
        console.log('Google login clicked');
    };

    const handleFacebookLogin = () => {
        // TODO: Implement Facebook login
        console.log('Facebook login clicked');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="text-center mb-4">Đăng nhập</h2>
                
                {/* Social Login Buttons */}
                <div className="social-login mb-4">
                    <button 
                        className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleGoogleLogin}
                        type="button"
                    >
                        <i className="fab fa-google"></i>
                        Đăng nhập với Google
                    </button>
                    <button 
                        className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleFacebookLogin}
                        type="button"
                    >
                        <i className="fab fa-facebook"></i>
                        Đăng nhập với Facebook
                    </button>
                </div>

                <div className="divider">
                    <span>Hoặc</span>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-envelope"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                        <Link to="/quen-mat-khau" className="text-primary text-decoration-none">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        Đăng nhập
                    </button>

                    <p className="text-center mb-0">
                        Chưa có tài khoản? {' '}
                        <Link to="/dang-ky" className="text-primary text-decoration-none">
                            Đăng ký ngay
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login; 